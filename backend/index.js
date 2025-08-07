console.log("🔑 JOOBLE API KEY:", process.env.JOOBLE_API_KEY);
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

// ✅ CORS setup
const allowedOrigins = [
  'https://job-recommender-two.vercel.app', // your Vercel frontend
  'http://localhost:5173',                 // local Vite dev
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('🚫 CORS: Origin not allowed'));
  },
  credentials: true
}));

app.use(express.json());

// ✅ Multer config
const upload = multer({ dest: 'uploads/' });

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Job Recommender Backend is Live!');
});

// ✅ Upload route
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Resume file not uploaded' });

    const filePath = path.join(__dirname, req.file.path);
    console.log('📄 Uploaded:', filePath);

    // Extract skills
    let skills = [];
    try {
      skills = await extractSkills(filePath);
      console.log('✅ Skills:', skills);
    } catch (err) {
      throw new Error('Resume parsing failed: ' + err.message);
    }

    const keywords = skills.slice(0, 5).join(' ') || 'developer';

    // Jooble API call
    const joobleUrl = 'https://jooble.org/api/';
    const response = await axios.post(
      `${joobleUrl}${process.env.JOOBLE_API_KEY}`,
      {
        keywords,
        location: 'India'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const jobs = response.data.jobs || [];

    // Delete temp file
    fs.unlink(filePath, (err) => {
      if (err) console.warn('⚠️ Failed to delete file:', err.message);
      else console.log('🧹 File deleted');
    });

    res.json({
      skills,
      jobs: jobs.slice(0, 10)
    });

  } catch (err) {
    console.error('🔥 Error:', err.message);
    res.status(500).json({ error: 'Something went wrong during upload or job fetch.' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
