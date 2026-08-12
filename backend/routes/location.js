const express = require('express');
const router = express.Router();
const { getNearbyPlaces, SUPPORTED_CATEGORIES } = require('../services/places-service');

/**
 * POST /api/location/nearby
 * 
 * Retrieve real-world nearby places for given device coordinates, category, and radius.
 */
router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, category, radius } = req.body;

    // 1. Validate required fields
    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
      return res.status(400).json({
        error: 'Missing required parameters: latitude and longitude are required.',
      });
    }

    // 2. Validate numeric coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        error: 'Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180.',
      });
    }

    // 3. Validate category
    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        error: 'Missing required parameter: category.',
      });
    }

    const normalizedCategory = category.toLowerCase().trim();
    if (!SUPPORTED_CATEGORIES.includes(normalizedCategory)) {
      return res.status(400).json({
        error: `Unsupported category '${category}'. Supported categories: ${SUPPORTED_CATEGORIES.join(', ')}.`,
      });
    }

    // 4. Validate radius
    let parsedRadius = radius !== undefined && radius !== null ? parseInt(radius, 10) : 5000;
    if (isNaN(parsedRadius) || parsedRadius <= 0 || parsedRadius > 50000) {
      return res.status(400).json({
        error: 'Invalid radius: radius must be a positive integer in meters (up to 50000).',
      });
    }

    // 5. Query places provider service
    const places = await getNearbyPlaces({
      latitude: lat,
      longitude: lon,
      category: normalizedCategory,
      radius: parsedRadius,
    });

    return res.status(200).json({
      success: true,
      category: normalizedCategory,
      radius: parsedRadius,
      count: places.length,
      places: places,
    });
  } catch (error) {
    console.error('Error fetching nearby places:', error.message);
    return res.status(500).json({
      error: 'Failed to retrieve nearby services. Please try again later.',
    });
  }
});

module.exports = router;
