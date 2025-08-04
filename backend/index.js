require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https'); // 👈 Added for agent handling
const extractSkills = require('./extractSkills');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer for file uploads
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

    // Extract skills
    let skills = [];
    try {
      skills = await extractSkills(filePath);
      console.log('✅ Extracted skills:', skills);
    } catch (err) {
      throw new Error('Resume parsing failed: ' + err.message);
    }

    const keywords = skills.slice(0, 4).join(' ') || 'developer';

    let allJobs = [];

    try {
      // Axios options with fallback agent for dev
      const axiosOptions = {
        params: { search: keywords },
        timeout: 8000,
        headers: { 'Accept': 'application/json' }
      };

      if (process.env.NODE_ENV !== 'production') {
        axiosOptions.httpsAgent = new https.Agent({ rejectUnauthorized: false });
      }

      const response = await axios.get('https://remotive.io/api/remote-jobs', axiosOptions);
      allJobs = response.data.jobs || [];

      // Retry if no jobs found
      if (allJobs.length === 0) {
        axiosOptions.params.search = 'developer';
        const retryResponse = await axios.get('https://remotive.io/api/remote-jobs', axiosOptions);
        allJobs = retryResponse.data.jobs || [];
      }

    } catch (apiErr) {
      console.error('❌ Remotive API error:', apiErr.message);
      throw new Error('Failed to fetch jobs from Remotive');
    }

    // Filter jobs
    const filteredJobs = allJobs.filter(job =>
      skills.some(skill =>
        job.title?.toLowerCase().includes(skill.toLowerCase()) ||
        job.description?.toLowerCase().includes(skill.toLowerCase()) ||
        (Array.isArray(job.tags) &&
          job.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase())))
      )
    );

    // Clean up temp file
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

// Jooble API route
app.use('/api/jobs', jobRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
