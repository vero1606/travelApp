// server/routes/destinations.js
const router = require('express').Router();
const Destination = require('../server/models/Destination');

// GET /api/destinations?search=paris&country=France
router.get('/', async (req, res) => {
  try {
    const { search, country } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { city:    { $regex: search, $options: 'i' } },
        { category:{ $regex: search, $options: 'i' } },
      ];
    }
    if (country) filter.country = { $regex: country, $options: 'i' };

    const destinations = await Destination.find(filter).sort({ city: 1 });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const dest = await Destination.findById(req.params.id);
    if (!dest) return res.status(404).json({ message: 'Not found' });
    res.json(dest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
