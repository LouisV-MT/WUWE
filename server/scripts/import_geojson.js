// server/scripts/import_geojson.js
require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const axios = require('axios');
const Restaurant = require('../models/Restaurant');
const { classifyCuisine } = require('../utils/taxonomy');

// Use the URL you provided
const GEOJSON_URL = "https://montreal-prod.storage.googleapis.com/resources/ece728c7-6f2d-4a51-a36d-21cd70e0ddc7/businesses.geojson?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=test-datapusher-delete%40amplus-data.iam.gserviceaccount.com%2F20260225%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260225T024700Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&x-goog-signature=84b71bfa811d3b5303ffd056aa0a40ca5e3a2f7590eaf441096102efd9ab89b08acbce2e6fd74e3482005c7e8e25c52032d9892226941e6c3bfbe7d2b150a02a46843826ab18fc45eeb9b717a3df2ac48b8a06220f4e2120ec0a000a450f9a9d29095d64cbdd644fefff43e5d944ef92c8a1f56e728dce86d153e83f53e8b08879ddae616039a2dfb3c52c64874fdb608fc0b8cb752a58f9f82bc6644b33331b9bc0998f90458ad13d29dd039a1b34020d1f99ae48a88ff7e42e61af40fc16bf279f4ba886d3eb723a1b1b7ed7112b388f1e1a19bf4d9e5127b47efa29412980c8e39709382464a88b3a7a8312880add7d72677b125c783681efd27b712fee9d";

async function importFromGeoJSON() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("📥 Downloading GeoJSON...");
    const response = await axios.get(GEOJSON_URL);
    const features = response.data.features;
    console.log(`🔎 Found ${features.length} locations. Starting Batch Import...`);

    let bulkOps = [];
    let count = 0;
    const BATCH_SIZE = 1000;

    for (const feature of features) {
      const props = feature.properties;
      const status = props.STATUT || props.ETAT || props.status || "Ouvert";
      const name = props.name || props.NOM || props.ETABLISSEMENT || "Unknown";

      // 1. Filter Garbage
      if (
        status.toLowerCase().includes("ferm") || 
        status.toLowerCase().includes("inactif") || 
        name.toLowerCase().includes("(fermé)") || 
        name.toLowerCase().includes("closed") ||
        !feature.geometry || !feature.geometry.coordinates
      ) continue;

      // 2. Classify (Smart Name Fallback)
      const rawCategory = props.category || props.CATEGORIE || props.type || "General";
      const taxonomy = classifyCuisine(rawCategory, name);
      const google_place_id = `geojson_${props.ID_ETABLISSEMENT || props.id || count}`;
      const address = props.address || props.ADRESSE || props.formatted_address;

      // 3. Build with Defaults
      bulkOps.push({
        updateOne: {
          filter: { google_place_id: google_place_id },
          update: {
            $set: {
              name: name,
              location: {
                type: "Point",
                coordinates: feature.geometry.coordinates,
                address: { street: address, city: "Montreal", province: "QC" }
              },
              cuisine_taxonomy: {
                region: taxonomy.region,
                sub_region: taxonomy.sub_region,
                style: taxonomy.style
              },
              // APPLY HEURISTIC DEFAULT HERE
              vibe_vector: taxonomy.base_vibe, 
              
              is_enriched: false,
              enrichment_source: "manual_import",
              vibe_vote_count: 0
            }
          },
          upsert: true
        }
      });

      if (bulkOps.length >= BATCH_SIZE) {
        await Restaurant.bulkWrite(bulkOps);
        count += bulkOps.length;
        bulkOps = [];
        process.stdout.write(`\r✅ Processed: ${count}`);
      }
    }

    if (bulkOps.length > 0) await Restaurant.bulkWrite(bulkOps);
    console.log("\n🎉 Done!");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importFromGeoJSON();