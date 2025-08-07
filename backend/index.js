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

// ✅ CORS setup for both local and Vercel frontend
const allowedOrigins = [
  'https://job-recommender-two.vercel.app',
  'http://localhost:5173',
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
  },
  credentials: true
}));

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Job Recommender Backend is Live!');
});

// ✅ Upload route
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file not uploaded' });
    }

    const filePath = path.join(__dirname, req.file.path);
    console.log('📄 Resume received at:', filePath);

    // 🔍 Extract skills
    let skills = [];
    try {
      skills = await extractSkills(filePath);
      console.log('✅ Extracted skills:', skills);
    } catch (err) {
      throw new Error('Skill extraction failed: ' + err.message);
    }

    const keywords = skills.slice(0, 5).join(' ') || 'developer';

    // 🔗 Jooble API Call
    const joobleResponse = await axios.post(
      `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
      {
        keywords,
        location: 'India'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const jobResults = joobleResponse.data.jobs || [];

    // 🧹 Delete uploaded resume
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Could not delete file:', err.message);
      else console.log('🧹 Temp resume deleted');
    });

    res.json({
      skills,
      jobs: jobResults.slice(0, 10)
    });

  } catch (err) {
    console.error('🔥 Upload error:', err.message);
    res.status(500).json({
      error: 'Something went wrong while processing resume or fetching jobs.'
    });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
