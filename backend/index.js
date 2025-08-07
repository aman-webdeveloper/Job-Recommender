require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const extractSkills = require('./extractSkills');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/', (req, res) => {
  res.send('✅ Job Recommender Backend is Live!');
});

// Upload route
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file not uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    console.log('📄 File uploaded at:', filePath);

    // Extract skills from resume
    let skills = [];
    try {
      skills = await extractSkills(filePath);
      console.log('✅ Extracted skills:', skills);
    } catch (err) {
      throw new Error('Resume parsing failed: ' + err.message);
    }

    const keywords = skills.slice(0, 4).join(' ') || 'developer';
    const encodedKeywords = encodeURIComponent(keywords);

    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=20&what=${encodedKeywords}&content-type=application/json`;

    let allJobs = [];

    try {
      const response = await axios.get(adzunaUrl);
      allJobs = response.data.results || [];
    } catch (apiErr) {
      console.error('❌ Adzuna API error:', apiErr.message);
      throw new Error('Failed to fetch jobs from Adzuna');
    }

    // Filter jobs by skills
    const filteredJobs = allJobs.filter(job =>
      skills.some(skill =>
        job.title?.toLowerCase().includes(skill.toLowerCase()) ||
        job.description?.toLowerCase().includes(skill.toLowerCase())
      )
    );

    // Clean up uploaded resume
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Could not delete temp file:', err.message);
      else console.log('🧹 Deleted temp resume file');
    });

    res.json({
      skills,
      jobs: filteredJobs.length > 0 ? filteredJobs : allJobs.slice(0, 10)
    });

  } catch (err) {
    console.error('🔥 Upload route crashed:', err.message);
    res.status(500).json({ error: 'Something went wrong while processing the resume.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
