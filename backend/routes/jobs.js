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
<<<<<<< HEAD
    const response = await axios.get(
      `https://remotive.io/api/remote-jobs?search=${encodeURIComponent(
        searchQuery
      )}`,
      {
        timeout: 8000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const jobs = response.data.jobs || [];

    const filteredJobs = jobs.filter((job) =>
      skills.some(
        (skill) =>
          job.title.toLowerCase().includes(skill.toLowerCase()) ||
          job.description.toLowerCase().includes(skill.toLowerCase())
      )
    );

    res.json({ jobs: filteredJobs });
  } catch (err) {
    console.error("❌ Error fetching jobs:", err.message);

    res.status(500).json({
      error: "Failed to fetch jobs from Remotive API",
      message: err.message,
    });
=======
    const response = await axios.get(url);
    const jobs = response.data.results || [];
    res.json({ jobs });
  } catch (error) {
    console.error('❌ Adzuna API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Adzuna' });
>>>>>>> c1ffb01 (💄 Updated frontend to use Render backend and filters)
  }
});

module.exports = router;
