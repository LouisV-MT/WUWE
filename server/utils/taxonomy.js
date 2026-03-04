const CUISINE_HIERARCHY = {
  "quebecois_classic": {
    label: "Quebecois & Montreal Staples",
    sub_regions: {
      "casse_croute": {
        keywords: ["poutine", "steamé", "hot_dog", "fries", "casse-croute", "snack_bar", "burger"],
        base_vibe: { spiciness: 0.1, price: 0.2, formality: 0.1, noise: 0.7, healthiness: 0.1 }
      },
      "montreal_deli": {
        keywords: ["smoked_meat", "deli", "jewish_deli", "schwartz", "sandwich"],
        base_vibe: { spiciness: 0.2, price: 0.4, formality: 0.3, noise: 0.6, healthiness: 0.2 }
      },
      "bagel_shop": {
        keywords: ["bagel", "montreal_bagel", "cream_cheese", "bakery"],
        base_vibe: { spiciness: 0.0, price: 0.3, formality: 0.2, noise: 0.4, healthiness: 0.4 }
      },
      "sugar_shack": {
        keywords: ["sugar_shack", "erabliere", "maple", "cabane_a_sucre"],
        base_vibe: { spiciness: 0.0, price: 0.6, formality: 0.4, noise: 0.8, healthiness: 0.1 }
      }
    }
  },
  "french_scene": {
    label: "French & European",
    sub_regions: {
      "classic_french": {
        keywords: ["french", "bistro", "brasserie", "tartare", "francais"],
        base_vibe: { spiciness: 0.1, price: 0.8, formality: 0.8, noise: 0.4, healthiness: 0.6 }
      },
      "portuguese": {
        keywords: ["portuguese", "rotisserie", "chicken", "grillade", "poulet"],
        base_vibe: { spiciness: 0.4, price: 0.4, formality: 0.3, noise: 0.6, healthiness: 0.5 }
      },
      "italian": {
        keywords: ["italian", "pasta", "pizza", "cannoli", "trattoria"],
        base_vibe: { spiciness: 0.2, price: 0.6, formality: 0.6, noise: 0.5, healthiness: 0.4 }
      },
      "greek": {
        keywords: ["greek", "souvlaki", "gyro", "mediterranean"],
        base_vibe: { spiciness: 0.3, price: 0.5, formality: 0.4, noise: 0.6, healthiness: 0.6 }
      }
    }
  },
  "east_asia": {
    label: "East Asian",
    sub_regions: {
      "japanese": {
        keywords: ["japanese", "sushi", "ramen", "izakaya", "udon", "japonais"],
        base_vibe: { spiciness: 0.2, price: 0.7, formality: 0.6, noise: 0.3, healthiness: 0.8 }
      },
      "chinese": {
        keywords: ["chinese", "dim_sum", "dumpling", "szechuan", "cantonese", "hot_pot", "chinois"],
        base_vibe: { spiciness: 0.4, price: 0.4, formality: 0.4, noise: 0.7, healthiness: 0.5 }
      },
      "korean": {
        keywords: ["korean", "bibimbap", "korean_bbq", "fried_chicken", "coreen"],
        base_vibe: { spiciness: 0.7, price: 0.5, formality: 0.4, noise: 0.6, healthiness: 0.5 }
      }
    }
  },
  "west_south_asia": {
    label: "Middle Eastern & South Asian",
    sub_regions: {
      "indian": {
        keywords: ["indian", "curry", "tandoori", "indien", "pakistani", "bengali"],
        base_vibe: { spiciness: 0.8, price: 0.4, formality: 0.4, noise: 0.5, healthiness: 0.6 }
      },
      "lebanese": {
        keywords: ["lebanese", "shish_taouk", "shawarma", "garlic_potatoes", "libanais"],
        base_vibe: { spiciness: 0.3, price: 0.3, formality: 0.2, noise: 0.5, healthiness: 0.6 }
      }
    }
  },
  "african_continent": {
    label: "African",
    sub_regions: {
      "ethiopian": {
        keywords: ["ethiopian", "injera", "tibs"],
        base_vibe: { spiciness: 0.6, price: 0.4, formality: 0.3, noise: 0.4, healthiness: 0.7 }
      },
      "west_african": {
        keywords: ["nigerian", "ghanaian", "fufu", "jollof", "suya"],
        base_vibe: { spiciness: 0.8, price: 0.3, formality: 0.3, noise: 0.6, healthiness: 0.4 }
      },
      "maghreb": { 
        keywords: ["moroccan", "tunisian", "couscous", "tagine", "marocain"],
        base_vibe: { spiciness: 0.5, price: 0.5, formality: 0.5, noise: 0.4, healthiness: 0.6 }
      }
    }
  },
  "europe_east": {
    label: "Eastern European",
    sub_regions: {
      "polish": {
        keywords: ["polish", "pierogi", "kielbasa", "polonais"],
        base_vibe: { spiciness: 0.1, price: 0.4, formality: 0.4, noise: 0.5, healthiness: 0.3 }
      },
      "russian": {
        keywords: ["russian", "borscht", "pelmeni", "russe"],
        base_vibe: { spiciness: 0.1, price: 0.6, formality: 0.6, noise: 0.3, healthiness: 0.4 }
      }
    }
  },
  "latin_south": {
    label: "South American",
    sub_regions: {
      "brazilian": {
        keywords: ["brazilian", "steakhouse", "churrascaria", "bresilien"],
        base_vibe: { spiciness: 0.2, price: 0.8, formality: 0.6, noise: 0.7, healthiness: 0.2 }
      },
      "argentinian": {
        keywords: ["argentinian", "empanadas", "steak", "argentin"],
        base_vibe: { spiciness: 0.1, price: 0.7, formality: 0.6, noise: 0.4, healthiness: 0.3 }
      },
      "venezuelan": {
        keywords: ["venezuelan", "arepas", "tequenos"],
        base_vibe: { spiciness: 0.2, price: 0.3, formality: 0.2, noise: 0.6, healthiness: 0.4 }
      },
      "mexican": {
        keywords: ["mexican", "tacos", "burrito", "quesadilla", "mexicain"],
        base_vibe: { spiciness: 0.6, price: 0.4, formality: 0.3, noise: 0.6, healthiness: 0.4 }
      }
    }
  }
};

/**
 * HELPER: Classify based on Category OR Name
 * Returns the region AND the default 'base_vibe'
 */
function classifyCuisine(rawInput, nameFallback = "") {
  const inputs = Array.isArray(rawInput) ? rawInput : [rawInput];
  if (nameFallback) inputs.push(nameFallback);

  const defaultVibe = { spiciness: 0.1, price: 0.5, formality: 0.5, noise: 0.5, healthiness: 0.5 };

  for (const input of inputs) {
    if (!input) continue;
    
    const cleanTag = input.toLowerCase()
      .replace(/restaurant/g, "")
      .replace(/[()]/g, "")
      .trim();

    for (const [regionKey, regionData] of Object.entries(CUISINE_HIERARCHY)) {
      for (const [subRegionKey, data] of Object.entries(regionData.sub_regions)) {
        if (data.keywords.some(k => cleanTag.includes(k))) {
          return {
            region: regionKey,
            sub_region: subRegionKey,
            style: cleanTag || subRegionKey,
            base_vibe: data.base_vibe 
          };
        }
      }
    }
  }

  return { region: "global", sub_region: "general", style: "general", base_vibe: defaultVibe };
}

function getRootsScore(sourceTaxonomy, candidateTaxonomy) {
  if (!sourceTaxonomy || !candidateTaxonomy) return 0;
  if (sourceTaxonomy.sub_region === candidateTaxonomy.sub_region) return 1.0; 
  if (sourceTaxonomy.region === candidateTaxonomy.region) return 0.5; 
  return 0.0;
}

module.exports = { classifyCuisine, getRootsScore, CUISINE_HIERARCHY };