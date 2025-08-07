const express = require('express');
const axios = require('axios');
const router = express.Router();

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

router.post('/', async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: 'No skills provided' });
  }

  const query = skills.join(' ');
  const country = 'in'; // India

  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=${encodeURIComponent(query)}&content-type=application/json`;

  try {
    const response = await axios.get(url);
    const jobs = response.data.results || [];
    res.json({ jobs });
  } catch (error) {
    console.error('❌ Adzuna API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Adzuna' });
  }
});

module.exports = router;
