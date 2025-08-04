require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const response = await axios.post(
      `https://${process.env.RAPIDAPI_HOST}/jobs/`, // ✅ Correct endpoint
      {
        keywords: "React OR Node OR JavaScript",
        location: "India"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST
        }
      }
    );

    console.log("✅ Jobs fetched:", response.data.jobs?.length || 0);
    console.log(response.data.jobs?.slice(0, 3));
  } catch (err) {
    console.error("❌ API Error:", err.response?.data || err.message);
  }
})();
