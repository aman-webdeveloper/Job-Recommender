const fs = require('fs');
const pdfParse = require('pdf-parse');

// 🛡️ Escape RegExp special characters (e.g., C++, C#, etc.)
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const skillsMap = {
  "React": ["react", "reactjs"],
  "Node.js": ["node", "nodejs", "node.js"],
  "Express.js": ["express", "express.js"],
  "MongoDB": ["mongodb", "mongo"],
  "JavaScript": ["javascript", "js"],
  "HTML": ["html"],
  "CSS": ["css"],
  "Python": ["python"],
  "Java": ["java"],
  "C++": ["c++", "cpp"],
  "C#": ["c#", "c sharp"],
  "SQL": ["sql", "mysql", "postgresql", "sqlite", "oracle"],
  "PHP": ["php"],
  "Laravel": ["laravel"],
  "Angular": ["angular"],
  "Vue.js": ["vue", "vuejs", "vue.js"],
  "TypeScript": ["typescript", "ts"],
  "Django": ["django"],
  "Flask": ["flask"],
  "Bootstrap": ["bootstrap"],
  "Tailwind CSS": ["tailwind", "tailwindcss"],
  "jQuery": ["jquery"],
  "Spring Boot": ["spring", "spring boot"],
  "Kotlin": ["kotlin"],
  "Swift": ["swift"],
  "Go": ["golang", "go"],
  "Rust": ["rust"],
  "Ruby": ["ruby", "rails", "ruby on rails"],
  "Figma": ["figma"],
  "Canva": ["canva"],
  "Adobe Photoshop": ["photoshop"],
  "Adobe Illustrator": ["illustrator"],
  "WordPress": ["wordpress"],
  "Shopify": ["shopify"],
  "Wix": ["wix"],
  "Excel": ["excel", "microsoft excel"],
  "MS Word": ["ms word", "microsoft word"],
  "PowerPoint": ["powerpoint", "microsoft powerpoint"],
  "Google Sheets": ["google sheets"],
  "Data Entry": ["data entry", "typing speed", "form filling", "copy paste"],
  "Virtual Assistant": ["virtual assistant"],
  "Customer Support": ["customer support", "customer service"],
  "Accounting": ["tally", "gst", "accounting", "bookkeeping"],
  "AutoCAD": ["autocad"],
  "CorelDRAW": ["coreldraw"],
  "Digital Marketing": ["digital marketing", "seo", "sem", "google ads", "facebook ads"],
  "Social Media": ["social media marketing", "smm", "instagram marketing"],
  "HR": ["hr", "human resource", "recruitment", "payroll"],
  "Teaching": ["teaching", "lesson planning", "classroom management"],
  "Content Writing": ["content writing", "blog writing", "copywriting"],
  "Communication": ["communication", "verbal skills", "email writing"],
  "Time Management": ["time management"],
  "Teamwork": ["teamwork", "collaboration"],
  "Problem Solving": ["problem solving"],
  "Critical Thinking": ["critical thinking"],
  "Project Management": ["project management", "scrum", "agile", "jira"],
  "Linux": ["linux", "ubuntu", "redhat"],
  "AWS": ["aws", "amazon web services"],
  "Azure": ["azure"],
  "GCP": ["google cloud", "gcp"],
  "Firebase": ["firebase"],
  "Docker": ["docker"],
  "Kubernetes": ["kubernetes", "k8s"],
  "Git": ["git", "github", "bitbucket", "version control"],
  "CI/CD": ["ci", "cd", "jenkins", "github actions"],
  "Testing": ["jest", "mocha", "cypress", "selenium", "junit"],
  "UI/UX Design": ["ui design", "ux design", "user interface", "user experience"],
  "Matplotlib": ["matplotlib"],
  "Pandas": ["pandas"],
  "NumPy": ["numpy"],
  "OpenAI": ["openai", "chatgpt", "gpt-4", "gpt-3"],
  "Machine Learning": ["machine learning", "scikit", "ml", "tensorflow", "keras"],
  "Deep Learning": ["deep learning", "cnn", "rnn"],
  "NLP": ["natural language processing", "nlp"],
  "Data Analysis": ["data analysis", "data analyst"],
  "Data Visualization": ["data visualization", "tableau", "power bi"],
  "REST API": ["rest api", "restful api"],
  "GraphQL": ["graphql"],
  "WebSocket": ["websocket"],
  "Cybersecurity": ["cybersecurity", "network security", "ethical hacking"],
  "Blockchain": ["blockchain", "solidity", "web3"],
  "DevOps": ["devops", "ci/cd", "automation", "infrastructure as code"]
};

async function extractSkills(filePath) {
  try {
    console.log("\ud83d\udce5 Reading file:", filePath);

    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    if (!pdfData?.text) {
      throw new Error("PDF content unreadable or empty.");
    }

    const text = pdfData.text.toLowerCase();
    const foundSkills = new Set();

    for (const [skill, keywords] of Object.entries(skillsMap)) {
      for (const word of keywords) {
        const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
        if (regex.test(text)) {
          foundSkills.add(skill);
          break;
        }
      }
    }

    const finalSkills = [...foundSkills].sort();

    if (finalSkills.length === 0) {
      console.warn("\u26a0\ufe0f No skills found. Returning fallback.");
      return [];
    }

    console.log("\u2705 Extracted skills:", finalSkills);
    return finalSkills;

  } catch (err) {
    console.error("\u274c Error during skill extraction:", err.message);
    return [];
  }
}

module.exports = extractSkills;
