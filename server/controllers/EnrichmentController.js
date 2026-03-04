const enrichmentService = require('../services/EnrichmentService');
const { EnrichmentRequestDto, EnrichmentResponseDto } = require('../dtos/EnrichmentDtos');

exports.enrichRestaurant = async (req, res) => {
  try {
    // 1. Validate Input (DTO)
    const requestDto = new EnrichmentRequestDto(req.params, req.query);

    // 2. Call Service
    const { restaurant, batchStats } = await enrichmentService.enrichRestaurant(
      requestDto.id, 
      requestDto.force
    );

    // 3. Format Output (DTO)
    const responseDto = new EnrichmentResponseDto(restaurant, batchStats);
    
    res.status(200).json(responseDto);

  } catch (err) {
    console.error("❌ Controller Error:", err.message);
    
    if (err.message === "Restaurant not found") {
      return res.status(404).json({ error: err.message });
    }
    
    
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};