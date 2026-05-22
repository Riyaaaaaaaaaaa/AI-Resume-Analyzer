const resumeInput = document.getElementById("resumeInput");
const fileName = document.getElementById("fileName");
const analyzeBtn = document.getElementById("analyzeBtn");
const message = document.getElementById("message");
const roleSelect = document.getElementById("roleSelect");
const jobDescription = document.getElementById("jobDescription");
const scoreValue = document.getElementById("scoreValue");
const resultTitle = document.getElementById("resultTitle");
const resultSummary = document.getElementById("resultSummary");
const wordCount = document.getElementById("wordCount");
const keywordCount = document.getElementById("keywordCount");
const missingCount = document.getElementById("missingCount");
const matchedSkills = document.getElementById("matchedSkills");
const missingSkills = document.getElementById("missingSkills");
const suggestionsList = document.getElementById("suggestionsList");
const textPreview = document.getElementById("textPreview");
const scoreCircle = document.querySelector(".score-circle");

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const roleKeywords = {
  frontend: [
    "html", "css", "javascript", "react", "responsive design", "api", "git", "github", "ui", "accessibility", "debugging", "frontend"
  ],
  software: [
    "python", "java", "javascript", "data structures", "algorithms", "oop", "git", "api", "sql", "debugging", "testing", "problem solving"
  ],
  fullstack: [
    "html", "css", "javascript", "react", "node", "express", "mongodb", "sql", "api", "authentication", "frontend", "backend"
  ],
  cybersecurity: [
    "networking", "linux", "owasp", "security", "vulnerability", "python", "nmap", "burp", "authentication", "risk", "incident", "firewall"
  ]
};

const defaultDescriptions = {
  frontend: "HTML CSS JavaScript React responsive design API Git GitHub UI accessibility debugging frontend",
  software: "Python Java JavaScript data structures algorithms OOP Git API SQL debugging testing problem solving",
  fullstack: "HTML CSS JavaScript React Node Express MongoDB SQL API authentication frontend backend",
  cybersecurity: "Networking Linux OWASP security vulnerability Python Nmap Burp authentication risk incident firewall"
};

roleSelect.addEventListener("change", () => {
  if (!jobDescription.value.trim()) {
    jobDescription.value = defaultDescriptions[roleSelect.value];
  }
});

jobDescription.value = defaultDescriptions[roleSelect.value];

resumeInput.addEventListener("change", () => {
  const file = resumeInput.files[0];
  fileName.textContent = file ? `${file.name} (${formatBytes(file.size)})` : "No file selected";
});

analyzeBtn.addEventListener("click", async () => {
  const file = resumeInput.files[0];

  if (!file) {
    message.textContent = "Please upload a resume first.";
    return;
  }

  message.textContent = "Reading resume...";
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing...";

  try {
    const resumeText = await extractText(file);

    if (!resumeText || resumeText.trim().length < 40) {
      throw new Error("Could not extract enough text from this file. Try another PDF/DOCX/TXT file.");
    }

    const keywords = buildKeywordList();
    const result = analyzeResume(resumeText, keywords);
    renderResults(result, resumeText);
    message.textContent = "Analysis complete.";
  } catch (error) {
    message.textContent = error.message;
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Resume";
  }
});

async function extractText(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return extractPdfText(file);
  }

  if (name.endsWith(".docx")) {
    return extractDocxText(file);
  }

  if (name.endsWith(".txt")) {
    return file.text();
  }

  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

async function extractPdfText(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF parser did not load. Check your internet connection and refresh.");
  }

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}

async function extractDocxText(file) {
  if (!window.mammoth) {
    throw new Error("DOCX parser did not load. Check your internet connection and refresh.");
  }

  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

function buildKeywordList() {
  const selectedRole = roleSelect.value;
  const baseKeywords = roleKeywords[selectedRole] || [];
  const jdWords = jobDescription.value
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2);

  const combined = [...baseKeywords, ...jdWords];
  return [...new Set(combined)].slice(0, 40);
}

function analyzeResume(text, keywords) {
  const normalized = text.toLowerCase();
  const words = normalized.match(/[a-z0-9+#.]+/g) || [];

  const matched = keywords.filter(keyword => normalized.includes(keyword.toLowerCase()));
  const missing = keywords.filter(keyword => !normalized.includes(keyword.toLowerCase()));

  const keywordScore = Math.round((matched.length / Math.max(keywords.length, 1)) * 70);
  const lengthScore = words.length >= 350 ? 10 : words.length >= 200 ? 7 : 4;
  const sectionScore = calculateSectionScore(normalized);
  const score = Math.min(100, keywordScore + lengthScore + sectionScore);

  return {
    score,
    matched,
    missing,
    wordTotal: words.length,
    suggestions: generateSuggestions(normalized, missing, words.length, score)
  };
}

function calculateSectionScore(text) {
  const sections = ["experience", "projects", "skills", "education", "certifications", "summary"];
  const found = sections.filter(section => text.includes(section)).length;
  return Math.min(20, found * 4);
}

function generateSuggestions(text, missing, totalWords, score) {
  const suggestions = [];

  if (score < 70) {
    suggestions.push("Add more role-specific keywords naturally inside your project descriptions and skills section.");
  }

  if (missing.length > 0) {
    suggestions.push(`Consider adding relevant missing skills such as ${missing.slice(0, 5).join(", ")} if you have experience with them.`);
  }

  if (!text.includes("projects")) {
    suggestions.push("Add a Projects section with 2-4 strong projects, tech stack, features, and measurable outcomes.");
  }

  if (!text.includes("github")) {
    suggestions.push("Add your GitHub link so recruiters can verify your work and see your code quality.");
  }

  if (!text.includes("linkedin")) {
    suggestions.push("Add your LinkedIn profile to make your resume easier to validate professionally.");
  }

  if (totalWords < 250) {
    suggestions.push("Your resume text appears short. Add more detail about projects, tools used, responsibilities, and achievements.");
  }

  if (!/\b(api|database|frontend|backend|react|python|javascript|sql)\b/.test(text)) {
    suggestions.push("Mention specific tools, languages, frameworks, and technical responsibilities instead of only broad descriptions.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Strong match. Improve further by adding measurable results, project links, and concise achievement-focused bullet points.");
  }

  return suggestions;
}

function renderResults(result, resumeText) {
  scoreValue.textContent = result.score;
  scoreCircle.style.background = `conic-gradient(#22c55e ${result.score * 3.6}deg, #1e293b 0deg)`;

  resultTitle.textContent = result.score >= 80 ? "Strong resume match" : result.score >= 60 ? "Good base, needs improvement" : "Needs stronger role alignment";
  resultSummary.textContent = "This score is simulated for portfolio/demo purposes and is based on keyword match, resume length, and section coverage.";

  wordCount.textContent = result.wordTotal;
  keywordCount.textContent = result.matched.length;
  missingCount.textContent = result.missing.length;

  renderPills(matchedSkills, result.matched, "No matched keywords found");
  renderPills(missingSkills, result.missing.slice(0, 16), "No missing keywords found");

  suggestionsList.innerHTML = result.suggestions.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  textPreview.textContent = resumeText.slice(0, 2500) + (resumeText.length > 2500 ? "\n\n...preview trimmed" : "");
}

function renderPills(container, items, emptyText) {
  container.classList.remove("empty");
  if (!items.length) {
    container.classList.add("empty");
    container.textContent = emptyText;
    return;
  }

  container.innerHTML = items.map(item => `<span>${escapeHtml(item)}</span>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
