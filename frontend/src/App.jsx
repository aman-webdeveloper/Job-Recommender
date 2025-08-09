import React, { useState, useEffect } from "react";

function App() {
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [newUpload, setNewUpload] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    applyFilters();
  }, [search, selectedSkill, selectedType, jobs]);

  const handleUpload = async () => {
    if (!resume) {
      alert("Please select a PDF resume.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = contentType && contentType.includes("application/json")
          ? (await res.json()).error
          : await res.text();
        throw new Error(errorText || "Unknown server error");
      }

      const data = await res.json();
      setSkills(data.skills || []);
      setJobs(data.jobs || []);
      setFilteredJobs(data.jobs || []);
      setNewUpload(false);
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (search) {
      filtered = filtered.filter((job) =>
        job.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(
        (job) =>
          Array.isArray(job.keywords) &&
          job.keywords.some((kw) =>
            kw.toLowerCase().includes(selectedSkill.toLowerCase())
          )
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (job) => job.job_type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Job Recommender Tool</h1>

      <div className="flex justify-center mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {
        <div className="text-center mb-6">
          <p className="text-lg font-semibold">
            {
              newUpload ? "" : `${skills.length} Skills Found:`
            }
            <br />
            <span className="text-blue-600">{skills.join(", ")}</span>
          </p>
        </div>
      }

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
        <input
          type="text"
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">Filter by skill</option>
          {skills.map((skill, idx) => (
            <option key={idx} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">Filter by job type</option>
          <option value="full-time">Full-Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="freelance">Freelance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <p className="text-center col-span-2 text-blue-600">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center col-span-2 text-gray-600">No jobs found.</p>
        ) : (
          filteredJobs.map((job, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company_name}</p>
              <p className="text-sm text-blue-600 mb-2">
                {job.job_type || "N/A"}
              </p>
              <a
                href={job.url || job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>
    </div >
  );
}

export default App;
