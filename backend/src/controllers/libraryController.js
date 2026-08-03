const { Library, Book } = require('../models');

// Haversine distance in kilometers.
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function listLibraries(req, res) {
  const libraries = await Library.findAll({ order: [['name', 'ASC']] });
  res.json({ libraries });
}

async function getLibrary(req, res) {
  const library = await Library.findByPk(req.params.id, {
    include: [{ model: Book, as: 'books' }],
  });
  if (!library) return res.status(404).json({ message: 'Library not found.' });
  res.json({ library });
}

// GET /api/libraries/nearby?lat=..&lng=..&radiusKm=10
async function nearbyLibraries(req, res) {
  const { lat, lng, radiusKm = 15 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat and lng query params are required.' });
  }

  const libraries = await Library.findAll();
  const withDistance = libraries
    .map((lib) => ({
      ...lib.toJSON(),
      distanceKm: Number(
        distanceKm(Number(lat), Number(lng), lib.latitude, lib.longitude).toFixed(2)
      ),
    }))
    .filter((lib) => lib.distanceKm <= Number(radiusKm))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({ libraries: withDistance });
}

module.exports = { listLibraries, getLibrary, nearbyLibraries };
