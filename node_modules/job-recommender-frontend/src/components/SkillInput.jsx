import React, { useState } from "react";
import axios from "axios";

const SkillInput = () => {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleChange = (e) => setSkills(e.target.value);

  const handleSubmit = async () => {
    console.log("Skills entered:", skills);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/jobs`, {
        keywords: skills.split(",").map((s) => s.trim()),
      });

      console.log("Jobs fetched:", response.data.jobs);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  return (
    <div className="mb-4 text-center">
      <input
        type="text"
        value={skills}
        onChange={handleChange}
        placeholder="Enter your skills (e.g., React, Node.js)"
        className="p-2 border border-gray-300 rounded w-2/3"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Find Jobs
      </button>

      {/* Show jobs below */}
      <div className="mt-6">
        {jobs.length > 0 ? (
          <ul className="text-left w-2/3 mx-auto">
            {jobs.map((job, index) => (
              <li key={index} className="border-b py-2">
                <strong>{job.title}</strong> at {job.company_name}
                <br />
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View Job
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default SkillInput;
