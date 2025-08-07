const fs = require('fs');
const pdfParse = require('pdf-parse');

// ✅ Comprehensive skills map covering frontend, backend, devops, cloud, data, etc.
const skillsMap = {
  // Frontend
  "HTML": ["html"],
  "CSS": ["css"],
  "JavaScript": ["javascript", "js"],
  "TypeScript": ["typescript", "ts"],
  "React": ["react", "reactjs", "react.js"],
  "Next.js": ["next.js", "nextjs"],
  "Vue.js": ["vue", "vuejs", "vue.js"],
  "Angular": ["angular", "angularjs"],
  "SASS/SCSS": ["sass", "scss"],
  "Tailwind CSS": ["tailwind", "tailwindcss"],
  "Bootstrap": ["bootstrap"],
  "jQuery": ["jquery"],

  // Backend
  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs"],
  "Django": ["django"],
  "Flask": ["flask"],
  "Spring Boot": ["spring boot", "springboot"],
  "Laravel": ["laravel"],
  "PHP": ["php"],
  "Ruby on Rails": ["ruby on rails", "rails"],
  "ASP.NET": ["asp.net", "dotnet", "aspnet"],

  // Full Stack
  "MERN Stack": ["mern"],
  "MEAN Stack": ["mean"],
  "LAMP Stack": ["lamp"],

  // Mobile Development
  "React Native": ["react native"],
  "Flutter": ["flutter"],
  "Kotlin": ["kotlin"],
  "Swift": ["swift"],
  "Java (Android)": ["android development"],

  // Databases
  "MongoDB": ["mongodb", "mongo"],
  "MySQL": ["mysql"],
  "PostgreSQL": ["postgresql", "postgres"],
  "SQLite": ["sqlite"],
  "Redis": ["redis"],
  "Oracle": ["oracle database"],

  // DevOps & Cloud
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure", "microsoft azure"],
  "Google Cloud": ["gcp", "google cloud"],
  "Docker": ["docker"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Jenkins": ["jenkins"],
  "CI/CD": ["ci/cd", "continuous integration", "continuous deployment"],
  "Git": ["git", "github", "gitlab", "bitbucket"],
  "Linux": ["linux", "bash", "shell scripting"],
  "Nginx": ["nginx"],
  "Apache": ["apache"],

  // Data Analysis & Excel
  "Excel": ["excel", "microsoft excel", "spreadsheets"],
  "Power BI": ["powerbi", "power bi"],
  "Tableau": ["tableau"],
  "Python (Data)": ["numpy", "pandas", "matplotlib", "seaborn"],
  "SQL (Data)": ["sql", "mysql", "postgresql", "sqlite"],
  "R Programming": ["r programming", "language r"],

  // AI & ML
  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning": ["deep learning"],
  "TensorFlow": ["tensorflow"],
  "PyTorch": ["pytorch"],
  "OpenCV": ["opencv"],
  "NLP": ["natural language processing", "nlp"],

  // Testing
  "Jest": ["jest"],
  "Mocha": ["mocha"],
  "Chai": ["chai"],
  "Cypress": ["cypress"],
  "Selenium": ["selenium"],
  "Playwright": ["playwright"],

  // Tools & Others
  "Figma": ["figma"],
  "Adobe XD": ["adobe xd", "xd"],
  "Photoshop": ["photoshop"],
  "VS Code": ["vs code", "visual studio code"],
  "Agile": ["agile", "scrum", "kanban"],
  "REST API": ["rest api", "restful"],
  "GraphQL": ["graphql"],
  "JSON": ["json"],
  "YAML": ["yaml", "yml"]
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
