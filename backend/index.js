require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const extractSkills = require('./skillExtractor');
const fetchJobs = require('./jobFetcher');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: Allow all Vercel frontend URLs + localhost
app.use(cors({
  origin: function (origin, callback) {
    const vercelPattern = /^https:\/\/.*\.vercel\.app$/;

    if (!origin || vercelPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`🚫 CORS Error: Origin ${origin} not allowed.`));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes
app.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const extractedSkills = await extractSkills(fileBuffer);
    const jobResults = await fetchJobs(extractedSkills);
    res.json({ skills: extractedSkills, jobs: jobResults });
  } catch (error) {
    console.error('❌ Error in /upload:', error.message);
    res.status(500).json({ error: 'Failed to process resume or fetch jobs.' });
  }
});

app.post('/api/jobs', async (req, res) => {
  const { keywords } = req.body;

  const options = {
    method: 'POST',
    url: 'https://jooble.org/api/' + process.env.JOOBLE_API_KEY,
    headers: { 'Content-Type': 'application/json' },
    data: {
      keywords: keywords || '',
      location: '',
      radius: '100',
      salary: '0',
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data.jobs || []);
  } catch (error) {
    console.error('❌ Error in /api/jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Jooble.' });
  }
});

app.get('/', (req, res) => {
  res.send('Job Recommender Backend is Running 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
