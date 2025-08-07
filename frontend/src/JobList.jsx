export const fetchJobs = async (skills) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/jobs`, {
      keywords: skills,
    });
    return response.data.jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return [];
  }
};
