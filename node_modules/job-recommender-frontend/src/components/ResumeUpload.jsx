import React, { useState } from "react";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume file first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed. Please try again.");
      }

      const data = await response.json();
      setSkills(data.skills);
      setJobs(data.jobs);
    } catch (error) {
      console.error("❌ Upload failed:", error.message);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center my-8">
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload Resume"}
      </button>

      {skills.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">✅ Extracted Skills:</h2>
          <p>{skills.join(", ")}</p>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">🧠 Job Recommendations:</h2>
          <ul className="text-left w-2/3 mx-auto">
            {jobs.map((job, index) => (
              <li key={index} className="border-b py-3">
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
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
