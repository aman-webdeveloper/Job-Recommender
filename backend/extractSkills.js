const fs = require('fs');
const pdfParse = require('pdf-parse');

const skillsMap = {
  // Web & Software Development
  "HTML": ["html"],
  "CSS": ["css"],
  "JavaScript": ["javascript", "js"],
  "TypeScript": ["typescript", "ts"],
  "React": ["react", "reactjs", "react.js"],
  "Angular": ["angular", "angularjs"],
  "Vue.js": ["vue", "vue.js"],
  "Next.js": ["next.js", "nextjs"],
  "Node.js": ["node", "nodejs", "node.js"],
  "Express": ["express", "expressjs"],
  "Django": ["django"],
  "Flask": ["flask"],
  "Spring Boot": ["spring boot", "springboot"],
  "Laravel": ["laravel"],
  "PHP": ["php"],
  "Ruby on Rails": ["ruby on rails", "rails"],
  "ASP.NET": ["asp.net", "dotnet", "aspnet"],
  "C": ["c language", "c programming", "language c"],
  "C++": ["c++", "cpp"],
  "C#": ["c#"],
  "Java": ["java", "core java"],

  // Mobile
  "Java (Android)": ["android development", "android"],
  "Kotlin": ["kotlin"],
  "Swift": ["swift"],
  "React Native": ["react native"],
  "Flutter": ["flutter", "dart"],

  // Stacks
  "MERN Stack": ["mern"],
  "MEAN Stack": ["mean"],
  "LAMP Stack": ["lamp"],

  // Database
  "MySQL": ["mysql"],
  "PostgreSQL": ["postgresql", "postgres"],
  "SQLite": ["sqlite"],
  "MongoDB": ["mongodb", "mongo"],
  "Redis": ["redis"],
  "Oracle": ["oracle", "pl/sql"],
  "SQL (Data)": ["sql", "structured query language"],

  // Data Science / ML
  "Python (Data)": ["numpy", "pandas", "matplotlib", "seaborn"],
  "Machine Learning": ["machine learning", "ml"],
  "Deep Learning": ["deep learning"],
  "TensorFlow": ["tensorflow"],
  "PyTorch": ["pytorch"],
  "OpenCV": ["opencv"],
  "NLP": ["natural language processing", "nlp"],
  "R Programming": ["r programming", "language r"],

  // Cloud & DevOps
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure", "microsoft azure"],
  "Google Cloud": ["gcp", "google cloud"],
  "Docker": ["docker"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Jenkins": ["jenkins"],
  "CI/CD": ["ci/cd", "continuous integration", "continuous deployment"],
  "Linux": ["linux", "ubuntu", "redhat", "bash", "shell scripting"],
  "Nginx": ["nginx"],
  "Apache": ["apache"],

  // Tools & Testing
  "Git": ["git", "github", "gitlab", "bitbucket"],
  "VS Code": ["vs code", "visual studio code"],
  "Eclipse": ["eclipse"],
  "IntelliJ": ["intellij", "idea"],
  "Jest": ["jest"],
  "Mocha": ["mocha"],
  "Chai": ["chai"],
  "Cypress": ["cypress"],
  "Selenium": ["selenium"],
  "Playwright": ["playwright"],

  // UI/UX & Design
  "Figma": ["figma"],
  "Adobe XD": ["adobe xd", "xd"],
  "Photoshop": ["photoshop"],
  "Canva": ["canva"],

  // Office Tools (Non-Tech)
  "MS Excel": ["ms excel", "excel", "microsoft excel"],
  "MS Word": ["ms word", "word", "microsoft word"],
  "MS PowerPoint": ["ms powerpoint", "powerpoint"],
  "Google Sheets": ["google sheets", "gsheet"],
  "Data Entry": ["data entry", "typing", "data processing"],
  "Typing": ["typing", "wpm"],

  // CAD & Engineering
  "AutoCAD": ["autocad"],
  "Revit": ["revit"],
  "SketchUp": ["sketchup"],

  // Business & Finance
  "Tally": ["tally", "tally erp"],
  "QuickBooks": ["quickbooks"],
  "Accounting": ["accounting", "bookkeeping"],
  "Finance": ["finance"],
  "GST": ["gst", "gst filing"],

  // Management
  "Project Management": ["project management", "pmp", "scrum", "kanban"],
  "Agile": ["agile", "scrum", "kanban"],
  "Leadership": ["leadership", "team lead"],
  "Teamwork": ["teamwork", "collaboration"],

  // Communication & HR
  "Communication": ["communication", "verbal skills"],
  "Customer Support": ["customer support", "csr", "customer service"],
  "Call Center": ["call center", "bpo"],
  "HR": ["hr", "human resources", "recruitment"],

  // Marketing & Content
  "Digital Marketing": ["digital marketing", "seo", "sem", "google ads"],
  "Sales": ["sales", "telecalling", "sales executive"],
  "Content Writing": ["content writing", "copywriting", "blogging"],
  "Technical Writing": ["technical writing"],
  "Editing": ["editing", "proofreading"],

  // Teaching & Training
  "Teaching": ["teaching", "tutor", "trainer"],
  "Curriculum Design": ["curriculum design", "lesson planning"],
  "Online Teaching Tools": ["zoom", "google classroom", "moodle"],

  // APIs & Data
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
