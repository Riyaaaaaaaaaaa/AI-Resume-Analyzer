# AI Resume Analyzer

A frontend-only resume analyzer website that extracts text from PDF, DOCX, and TXT resumes and generates an ATS-style score, keyword match report, missing skills, and improvement suggestions.

## Features

- Upload PDF, DOCX, or TXT resumes
- Real PDF text extraction using PDF.js
- DOCX text extraction using Mammoth.js
- ATS-style score simulation
- Role-based keyword matching
- Missing skills detection
- Suggestions panel
- Extracted text preview
- Responsive dashboard UI
- Deployable on GitHub Pages

## Tech Stack

- HTML
- CSS
- JavaScript
- PDF.js
- Mammoth.js

## How to Run Locally

Open the project folder in terminal and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

On Windows, use:

```bash
python -m http.server 8000
```

## How to Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to Settings > Pages.
4. Select GitHub Actions or Deploy from branch.
5. If using branch deployment, choose main and /root.
6. Open the generated GitHub Pages URL.

## Important Note

This is a frontend portfolio project. The scoring is simulated and should not be treated as a real hiring or ATS decision system. It is designed to demonstrate frontend development, file parsing, data extraction, and UI logic.
