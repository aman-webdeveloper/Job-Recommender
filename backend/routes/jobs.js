const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "No skills provided" });
  }

  console.log("🔍 Skills received:", skills);

  const searchQuery = skills.join(" ");

  try {
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
  }
});

module.exports = router;
