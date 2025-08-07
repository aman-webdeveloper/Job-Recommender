const express = require("express");
const axios = require("axios");
const router = express.Router();

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY || "";

router.post("/", async (req, res) => {
  const { skills } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "No skills provided" });
  }

  const query = skills.join(" ");
  const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;
  const body = {
    keywords: query,
    location: "India",
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jobs = response.data.jobs || [];
    res.json({ jobs });
  } catch (error) {
    console.error(
      "❌ Jooble API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch jobs from Jooble" });
  }
});

module.exports = router;
