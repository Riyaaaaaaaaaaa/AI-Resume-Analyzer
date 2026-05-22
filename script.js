pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const roleKeywords = {
  frontend: [
    "html", "css", "javascript", "react", "responsive design",
    "api", "git", "ui", "frontend", "accessibility"
  ],
  software: [
    "python", "java", "javascript", "data structures", "algorithms",
    "git", "api", "debugging", "testing", "problem solving"
  ],
  backend: [
    "node", "express", "database", "sql", "api", "authentication",
    "server", "rest", "mongodb", "backend"
  ],
  fullstack: [
    "html", "css", "javascript", "react", "node", "express",
    "database", "api", "git", "full stack"
  ]
};

async function analyzeResume() {
  const file = document.getElementById("resumeFile").files[0];
  const role = document.getElementById("role").value;
  const jobText = document.getElementById("jobText").value.toLowerCase();

  if (!file) {
    alert("Please upload a resume first.");
    return;
  }

  let resumeText = "";

  if (file.name.endsWith(".pdf")) {
    resumeText = await readPDF(file);
  } else if (file.name.endsWith(".docx")) {
    resumeText = await readDOCX(file);
  } else if (file.name.endsWith(".txt")) {
    resumeText = await file.text();
  } else {
    alert("Unsupported file type.");
    return;
  }

  resumeText = resumeText.toLowerCase();

  const keywords = jobText
    ? extractKeywords(jobText)
    : roleKeywords[role];

  const matched = keywords.filter(keyword =>
    resumeText.includes(keyword.toLowerCase())
  );

  const missing = keywords.filter(keyword =>
    !resumeText.includes(keyword.toLowerCase())
  );

  const score = Math.round((matched.length / keywords.length) * 100);

  updateUI(score, matched, missing);
}

async function readPDF(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    text += pageText + " ";
  }

  return text;
}

async function readDOCX(file) {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

function extractKeywords(text) {
  const commonWords = [
    "and", "the", "for", "with", "you", "are", "this", "that",
    "from", "have", "will", "your", "our", "using", "work"
  ];

  return [...new Set(
    text
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
  )].slice(0, 20);
}

function updateUI(score, matched, missing) {
  document.getElementById("score").textContent = score + "%";

  const label = document.getElementById("scoreLabel");

  if (score >= 80) {
    label.textContent = "Strong match. Your resume fits this role well.";
  } else if (score >= 50) {
    label.textContent = "Moderate match. Add more relevant keywords and project details.";
  } else {
    label.textContent = "Low match. Your resume needs stronger alignment with this role.";
  }

  document.getElementById("matched").innerHTML =
    matched.length
      ? matched.map(item => `<span class="chip">${item}</span>`).join("")
      : `<span class="chip">No strong matches found</span>`;

  document.getElementById("missing").innerHTML =
    missing.length
      ? missing.map(item => `<span class="chip missing">${item}</span>`).join("")
      : `<span class="chip">No major missing keywords</span>`;

  const suggestions = [];

  if (missing.length > 0) {
    suggestions.push(`Add missing keywords like ${missing.slice(0, 5).join(", ")} where honestly applicable.`);
  }

  if (score < 70) {
    suggestions.push("Add more role-specific project descriptions and measurable achievements.");
    suggestions.push("Use stronger action verbs such as built, developed, implemented, optimized, and deployed.");
  }

  suggestions.push("Keep your resume clean, readable, and focused on skills, projects, and impact.");

  document.getElementById("suggestions").innerHTML =
    suggestions.map(item => `<li>${item}</li>`).join("");
}
