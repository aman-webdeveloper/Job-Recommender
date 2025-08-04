const fs = require('fs');
const pdfParse = require('pdf-parse');

const skillsMap = {
  "JavaScript": ["javascript", "js"],
  "React": ["react", "reactjs", "react.js"],
  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs"],
  "MongoDB": ["mongodb", "mongo"],
  "Python": ["python"],
  "Java": ["java"],
  "C++": ["c++", "cpp"],
  "SQL": ["sql", "mysql", "postgresql"],
  "HTML": ["html"],
  "CSS": ["css"],
  "AWS": ["aws"],
  "Docker": ["docker"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Git": ["git", "github"],
  "REST API": ["rest", "api"]
};

async function extractSkills(filePath) {
  try {
    console.log("📥 Reading file:", filePath);

    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    if (!pdfData || !pdfData.text) {
      throw new Error("Empty or unreadable PDF content.");
    }

    const text = pdfData.text.toLowerCase();
    let foundSkills = [];

    for (let [skill, variations] of Object.entries(skillsMap)) {
      if (variations.some(v => text.includes(v))) {
        foundSkills.push(skill);
      }
    }

    foundSkills = [...new Set(foundSkills)];

    if (foundSkills.length === 0) {
      console.warn("⚠️ No skills detected — using fallback");
      return ["React", "Node.js"];
    }

    return foundSkills;

  } catch (error) {
    console.error("❌ Error extracting skills from resume:", error.message);
    return ["React", "Node.js"]; // fallback
  }
}

module.exports = extractSkills;
