const fs = require('fs');
const pdfParse = require('pdf-parse');

const skillsMap = {
  // --- [Same full map as you already have] ---
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

  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs"],
  "Django": ["django"],
  "Flask": ["flask"],
  "Spring Boot": ["spring boot", "springboot"],
  "Laravel": ["laravel"],
  "PHP": ["php"],
  "Ruby on Rails": ["ruby on rails", "rails"],
  "ASP.NET": ["asp.net", "dotnet", "aspnet"],

  "MERN Stack": ["mern"],
  "MEAN Stack": ["mean"],
  "LAMP Stack": ["lamp"],

  "React Native": ["react native"],
  "Flutter": ["flutter"],
  "Kotlin": ["kotlin"],
  "Swift": ["swift"],
  "Java (Android)": ["android development"],

  "MongoDB": ["mongodb", "mongo"],
  "MySQL": ["mysql"],
  "PostgreSQL": ["postgresql", "postgres"],
  "SQLite": ["sqlite"],
  "Redis": ["redis"],
  "Oracle": ["oracle database"],

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

  "Excel": ["excel", "microsoft excel", "spreadsheets"],
  "Power BI": ["powerbi", "power bi"],
  "Tableau": ["tableau"],
  "Python (Data)": ["numpy", "pandas", "matplotlib", "seaborn"],
  "SQL (Data)": ["sql", "mysql", "postgresql", "sqlite"],
  "R Programming": ["r programming", "language r"],

  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning": ["deep learning"],
  "TensorFlow": ["tensorflow"],
  "PyTorch": ["pytorch"],
  "OpenCV": ["opencv"],
  "NLP": ["natural language processing", "nlp"],

  "Jest": ["jest"],
  "Mocha": ["mocha"],
  "Chai": ["chai"],
  "Cypress": ["cypress"],
  "Selenium": ["selenium"],
  "Playwright": ["playwright"],

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

    if (!pdfData?.text) {
      throw new Error("PDF content unreadable or empty.");
    }

    const text = pdfData.text.toLowerCase();
    const foundSkills = new Set();

    for (const [skill, keywords] of Object.entries(skillsMap)) {
      for (const word of keywords) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(text)) {
          foundSkills.add(skill);
          break;
        }
      }
    }

    const finalSkills = [...foundSkills].sort();

    if (finalSkills.length === 0) {
      console.warn("⚠️ No skills found. Returning fallback.");
      return ["React", "Node.js"];
    }

    console.log("✅ Extracted skills:", finalSkills);
    return finalSkills;

  } catch (err) {
    console.error("❌ Error during skill extraction:", err.message);
    return ["React", "Node.js"];
  }
}

module.exports = extractSkills;
