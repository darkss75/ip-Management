const express = require('express');
const memoryStore = require('../data/vercelStore');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all countries with statistics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const countries = await memoryStore.findCountries({ isActive: true });
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Get country by code
router.get('/:code', authenticateToken, async (req, res) => {
  try {
    const country = await memoryStore.findCountryByCode(req.params.code);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({ error: 'Failed to fetch country' });
  }
});

// Initialize default countries
router.post('/initialize', authenticateToken, async (req, res) => {
  try {
    res.json({ message: 'Countries already initialized' });
  } catch (error) {
    console.error('Error initializing countries:', error);
    res.status(500).json({ error: 'Failed to initialize countries' });
  }
});

// Toggle country favorite
router.put('/:code/favorite', authenticateToken, async (req, res) => {
  try {
    const country = await memoryStore.toggleCountryFavorite(req.params.code);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.json({ 
      message: country.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      country 
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

module.exports = router;