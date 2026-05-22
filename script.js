const roleKeywords = {
  software: ['javascript', 'python', 'git', 'api', 'database', 'debugging', 'testing', 'algorithms', 'react', 'node'],
  frontend: ['html', 'css', 'javascript', 'react', 'responsive', 'ui', 'accessibility', 'api', 'figma', 'performance'],
  backend: ['node', 'express', 'python', 'flask', 'database', 'sql', 'api', 'authentication', 'testing', 'deployment'],
  data: ['python', 'sql', 'excel', 'statistics', 'dashboard', 'visualization', 'pandas', 'analysis', 'reporting', 'power bi']
};

const resumeText = document.getElementById('resumeText');
const resumeFile = document.getElementById('resumeFile');
const analyzeBtn = document.getElementById('analyzeBtn');
const jobRole = document.getElementById('jobRole');
const scoreValue = document.getElementById('scoreValue');
const scoreLabel = document.getElementById('scoreLabel');
const scoreCircle = document.querySelector('.score-circle');
const matchedKeywords = document.getElementById('matchedKeywords');
const missingKeywords = document.getElementById('missingKeywords');
const matchedCount = document.getElementById('matchedCount');
const missingCount = document.getElementById('missingCount');
const suggestions = document.getElementById('suggestions');

resumeFile.addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    resumeText.value = e.target.result;
  };
  reader.readAsText(file);
});

analyzeBtn.addEventListener('click', () => {
  const text = resumeText.value.toLowerCase();
  const selectedRole = jobRole.value;
  const keywords = roleKeywords[selectedRole];

  if (!text.trim()) {
    alert('Please upload or paste your resume text first.');
    return;
  }

  const matched = keywords.filter(keyword => text.includes(keyword));
  const missing = keywords.filter(keyword => !text.includes(keyword));
  const score = Math.round((matched.length / keywords.length) * 100);

  updateScore(score, matched, missing);
  updateKeywordList(matchedKeywords, matched, 'chip');
  updateKeywordList(missingKeywords, missing, 'chip missing');
  updateSuggestions(score, missing, text);
});

function updateScore(score, matched, missing) {
  scoreValue.textContent = `${score}%`;
  scoreCircle.style.background = `conic-gradient(#38bdf8 ${score * 3.6}deg, rgba(148,163,184,0.2) 0deg)`;
  matchedCount.textContent = matched.length;
  missingCount.textContent = missing.length;

  if (score >= 80) {
    scoreLabel.textContent = 'Strong match. Your resume is well aligned with this role.';
  } else if (score >= 50) {
    scoreLabel.textContent = 'Moderate match. Add more role-specific skills and project details.';
  } else {
    scoreLabel.textContent = 'Low match. Improve keywords, projects, and measurable achievements.';
  }
}

function updateKeywordList(container, items, className) {
  container.className = 'chips';
  container.innerHTML = items.length
    ? items.map(item => `<span class="${className}">${item}</span>`).join('')
    : '<span class="empty">None found.</span>';
}

function updateSuggestions(score, missing, text) {
  const list = [];

  if (missing.length) {
    list.push(`Add relevant missing skills if you genuinely know them: ${missing.slice(0, 5).join(', ')}.`);
  }

  if (!text.includes('project')) {
    list.push('Add a dedicated Projects section with 2–4 strong software projects.');
  }

  if (!text.includes('github')) {
    list.push('Include your GitHub profile or project repository links.');
  }

  if (!/\d/.test(text)) {
    list.push('Add measurable impact where possible, such as number of features, users, pages, or improvements.');
  }

  if (score < 70) {
    list.push('Customize your resume for each role instead of using the same version everywhere.');
  }

  suggestions.innerHTML = list.map(item => `<li>${item}</li>`).join('');
}
