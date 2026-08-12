/**
 * Real-World Places Service
 * 
 * Interacts with real location/places API provider.
 * Normalizes results to consistent LifeOS format.
 */

const CATEGORY_MAP = {
  hospital: {
    osmQuery: 'node["amenity"~"hospital|clinic|doctors"](around:RADIUS,LAT,LON);way["amenity"~"hospital|clinic|doctors"](around:RADIUS,LAT,LON);',
    keywords: 'hospital clinic medical',
  },
  pharmacy: {
    osmQuery: 'node["amenity"="pharmacy"](around:RADIUS,LAT,LON);way["amenity"="pharmacy"](around:RADIUS,LAT,LON);',
    keywords: 'pharmacy chemist drugstore',
  },
  petrol_station: {
    osmQuery: 'node["amenity"="fuel"](around:RADIUS,LAT,LON);way["amenity"="fuel"](around:RADIUS,LAT,LON);',
    keywords: 'fuel petrol gas station',
  },
  mechanic: {
    osmQuery: 'node["shop"~"car_repair|vehicle_repair|motorcycle_repair"](around:RADIUS,LAT,LON);way["shop"~"car_repair|vehicle_repair|motorcycle_repair"](around:RADIUS,LAT,LON);',
    keywords: 'auto repair car mechanic service',
  },
  restaurant: {
    osmQuery: 'node["amenity"~"restaurant|fast_food|cafe"](around:RADIUS,LAT,LON);way["amenity"~"restaurant|fast_food|cafe"](around:RADIUS,LAT,LON);',
    keywords: 'restaurant food cafe dining',
  },
  police: {
    osmQuery: 'node["amenity"="police"](around:RADIUS,LAT,LON);way["amenity"="police"](around:RADIUS,LAT,LON);',
    keywords: 'police station law enforcement',
  },
  towing: {
    osmQuery: 'node["shop"~"car_repair|towing"](around:RADIUS,LAT,LON);way["shop"~"car_repair|towing"](around:RADIUS,LAT,LON);node["amenity"~"car_wash"](around:RADIUS,LAT,LON);',
    keywords: 'towing recovery roadside assistance car repair',
  },
  car_service: {
    osmQuery: 'node["shop"~"car_repair|car_parts|car_wash"](around:RADIUS,LAT,LON);way["shop"~"car_repair|car_parts|car_wash"](around:RADIUS,LAT,LON);',
    keywords: 'car service automobile repair maintenance',
  },
};

/**
 * Haversine formula to calculate distance between two coordinates in kilometers.
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Fetch nearby places using Overpass API (OpenStreetMap real-world data).
 */
async function fetchFromOverpass(latitude, longitude, categoryKey, radius) {
  const catConfig = CATEGORY_MAP[categoryKey];
  if (!catConfig) return [];

  const formattedQuery = catConfig.osmQuery
    .replace(/RADIUS/g, radius)
    .replace(/LAT/g, latitude)
    .replace(/LON/g, longitude);

  const overpassQL = `[out:json][timeout:15];(${formattedQuery});out center 25;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQL)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LifeOS-Roadside-Assist/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error status: ${response.status}`);
  }

  const data = await response.json();
  const elements = data.elements || [];

  return elements
    .map((elem) => {
      const lat = elem.lat || (elem.center && elem.center.lat);
      const lon = elem.lon || (elem.center && elem.center.lon);
      if (!lat || !lon) return null;

      const tags = elem.tags || {};
      const name =
        tags.name ||
        tags['name:en'] ||
        tags.brand ||
        `${categoryKey.replace('_', ' ').toUpperCase()} (${tags.operator || 'Local Service'})`;

      const addressParts = [
        tags['addr:housenumber'],
        tags['addr:street'],
        tags['addr:suburb'] || tags['addr:district'],
        tags['addr:city'],
      ].filter(Boolean);

      const address = addressParts.length > 0 ? addressParts.join(', ') : tags['addr:full'] || null;

      const dist = calculateDistanceKm(latitude, longitude, lat, lon);

      return {
        id: `osm-${elem.type}-${elem.id}`,
        name: name,
        category: categoryKey,
        latitude: lat,
        longitude: lon,
        address: address,
        distance: dist,
        rating: tags.stars ? parseFloat(tags.stars) : null,
        phone: tags.phone || tags['contact:phone'] || null,
      };
    })
    .filter(Boolean);
}

/**
 * Fallback provider using Photon API (powered by OpenStreetMap).
 */
async function fetchFromPhoton(latitude, longitude, categoryKey, radius) {
  const catConfig = CATEGORY_MAP[categoryKey];
  const queryTerm = catConfig ? catConfig.keywords.split(' ')[0] : categoryKey;
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(queryTerm)}&lat=${latitude}&lon=${longitude}&limit=20`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LifeOS-Roadside-Assist/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Photon API error status: ${response.status}`);
  }

  const data = await response.json();
  const features = data.features || [];

  return features
    .map((feat) => {
      const coords = feat.geometry && feat.geometry.coordinates;
      if (!coords || coords.length < 2) return null;
      const lon = coords[0];
      const lat = coords[1];

      const props = feat.properties || {};
      const name = props.name || props.street || categoryKey.replace('_', ' ').toUpperCase();

      const addressParts = [props.housenumber, props.street, props.district, props.city, props.state]
        .filter(Boolean);
      const address = addressParts.length > 0 ? addressParts.join(', ') : null;

      const dist = calculateDistanceKm(latitude, longitude, lat, lon);
      if (dist > (radius / 1000) * 1.5) return null; // Filter places outside approximate search radius

      return {
        id: `photon-${props.osm_id || Math.random().toString(36).substring(2, 9)}`,
        name: name,
        category: categoryKey,
        latitude: lat,
        longitude: lon,
        address: address,
        distance: dist,
        rating: null,
        phone: null,
      };
    })
    .filter(Boolean);
}

/**
 * Primary method for fetching nearby places.
 * Tries Overpass API first, falls back to Photon if Overpass is busy/unavailable.
 */
async function getNearbyPlaces({ latitude, longitude, category, radius = 5000 }) {
  const apiKey = process.env.PLACES_API_KEY;

  // If a custom PLACES_API_KEY is configured (e.g., LocationIQ / Geoapify), handle accordingly
  if (apiKey && process.env.PLACES_API_PROVIDER === 'locationiq') {
    try {
      const url = `https://us1.locationiq.com/v1/nearby?key=${apiKey}&lat=${latitude}&lon=${longitude}&tag=${category}&radius=${radius}&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const places = await res.json();
        return places.map((p) => ({
          id: `lociq-${p.place_id}`,
          name: p.display_name.split(',')[0],
          category: category,
          latitude: parseFloat(p.lat),
          longitude: parseFloat(p.lon),
          address: p.display_name,
          distance: calculateDistanceKm(latitude, longitude, parseFloat(p.lat), parseFloat(p.lon)),
          rating: null,
          phone: null,
        }));
      }
    } catch (e) {
      console.warn('LocationIQ provider failed, falling back to OpenStreetMap service:', e.message);
    }
  }

  // Production-ready OpenStreetMap Overpass provider
  try {
    const results = await fetchFromOverpass(latitude, longitude, category, radius);
    if (results.length > 0) {
      // Sort results by distance ascending
      return results.sort((a, b) => a.distance - b.distance);
    }
  } catch (err) {
    console.warn('Overpass API primary query error, attempting Photon secondary service:', err.message);
  }

  // Fallback to Photon real-world provider
  try {
    const fallbackResults = await fetchFromPhoton(latitude, longitude, category, radius);
    return fallbackResults.sort((a, b) => a.distance - b.distance);
  } catch (fallbackErr) {
    console.error('All places API providers failed:', fallbackErr.message);
    return [];
  }
}

module.exports = {
  getNearbyPlaces,
  SUPPORTED_CATEGORIES: Object.keys(CATEGORY_MAP),
};
