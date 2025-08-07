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

// ✅ Allow frontend origins
const allowedOrigins = [
  'https://job-recommender-two.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`🚫 CORS: Origin ${origin} not allowed`));
    }
  }
}));

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ Job Recommender Backend is Live!');
});

// ✅ Resume Upload + Jooble Job Fetch
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file not uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    console.log('📄 File uploaded at:', filePath);

    // 🔍 Extract skills
    let skills = [];
    try {
      skills = await extractSkills(filePath);
      console.log('✅ Extracted skills:', skills);
    } catch (err) {
      throw new Error('Resume parsing failed: ' + err.message);
    }

    const keywords = skills.slice(0, 5).join(' ') || 'developer';

    // 🔗 Jooble API call
    const joobleUrl = 'https://jooble.org/api/';
    const response = await axios.post(
      `${joobleUrl}${process.env.JOOBLE_API_KEY}`,
      {
        keywords: keywords,
        location: 'India'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const jobResults = response.data.jobs || [];

    // 🧹 Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Could not delete temp file:', err.message);
      else console.log('🧹 Deleted temp resume file');
    });

    res.json({
      skills,
      jobs: jobResults.slice(0, 10) // show top 10 jobs
    });

  } catch (err) {
    console.error('🔥 Upload route crashed:', err.message);
    res.status(500).json({ error: 'Something went wrong while processing the resume or fetching jobs.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
