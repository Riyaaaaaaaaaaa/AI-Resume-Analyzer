# AI Resume Analyzer

A modern frontend project that simulates an AI-powered resume analysis tool. Users can upload or paste resume text, choose a target role, and receive an ATS-style match score, keyword analysis, and improvement suggestions.

## Features

- Resume text upload using `.txt` files
- Paste resume content manually
- Target role selection
- ATS-style match percentage
- Skill keyword detection
- Missing keyword analysis
- Resume improvement suggestions
- Responsive dashboard UI

## Tech Stack

- HTML
- CSS
- JavaScript

## How to Run Locally

### Option 1: Open directly
Open `index.html` in your browser.

### Option 2: Run with a local server
From the project folder, run:

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

1. Create a new GitHub repository named `ai-resume-analyzer`
2. Upload all project files
3. Go to **Settings**
4. Open **Pages**
5. Under **Build and deployment**, choose **Deploy from a branch**
6. Select branch: `main`
7. Select folder: `/root`
8. Save

Your website will be available at:

```text
https://your-username.github.io/ai-resume-analyzer/
```

## Project Note

This is a frontend demo project. It does not use a real AI model or store uploaded resumes. The analysis is simulated using keyword matching logic in JavaScript.
