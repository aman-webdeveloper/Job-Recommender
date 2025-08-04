export const fetchJobs = async (skills) => {
  try {
    const response = await axios.post(
      "https://job-recommender-backend.onrender.com/api/jobs",
      {
        keywords: skills,
      }
    );
    return response.data.jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return [];
  }
};
