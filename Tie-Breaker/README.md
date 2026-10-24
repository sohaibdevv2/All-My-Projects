# The Tiebreaker ⚖️

An interactive, AI-powered multi-factor decision analysis application designed to dismantle challenging personal and professional dilemmas. **The Tiebreaker** evaluates alternative paths through structured SWOT quadrants, weighted side-by-side pros/cons lists, and a dynamic interactive matrix scorecard.

---

## ✨ Features

*   **AI-Powered Strategic Consultation:** Injects professional decision strategy and deep logical consensus powered by the Google Gemini 3.5 API.
*   **Weighted Pros & Cons Lists:** Pros and cons mapped directly to custom weighted impact indexes (1 to 5) to balance critical variables against light properties.
*   **Dynamic Comparison Matrix Grid:** Score categories (Financial, Emotional, Lifestyle, Career, and Time) side-by-side. 
*   **Interactive Weighting Playground:** Tweak matrix row weights to compute real-time sensitivities and instantly recalculate recommendations.
*   **Bento-Grid SWOT Matrix:** Deconstructs internal attributes (Strengths/Weaknesses) and external parameters (Opportunities/Threats).
*   **Local History & Secure Bookmarks:** Tracks historical decisions inside client-side local browser storage for speed and absolute privacy.
*   **Dynamic Choice Inference:** Leave choices empty, and the AI will auto-deduce the two most logical conflicting strategic options for you.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend:** React 19, TypeScript, motion, Tailwind CSS (w/ Outfit & JetBrains Mono display pairings)
*   **Backend Proxy:** Node.js, Express, Google GenAI SDK (prevents client-side API key leakages)
*   **Compiler & Bundler:** Vite 6, esbuild (bundles codebases for efficient startup)


## 🖥️ Local Installation & Development

If you download the repository or clone it locally from GitHub, follow these simple steps to run:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sohaibdevv/the-tiebreaker.git
cd the-tiebreaker
npm install
```

### 2. Configure Environment Secrets
Create a `.env` file at the root of the project:
```env
# Root /.env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```
*(No sensitive keys are stored in the codebase; the server loads them securely from this file or host system environment variables.)*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## ☁️ Deployment Guide

### Deploying to Google Cloud Run (Recommended & Automated)
The app is constructed with a full-stack Node/Express engine configured for Cloud Run ingress (binding to `0.0.0.0:3000` automatically).

1.  Connect your repository using **Google Cloud Console**.
2.  Enable Cloud Run Continuous Deployment from your GitHub main branch.
3.  Inject `GEMINI_API_KEY` into your Cloud Run **Environment Variables** securely.

### Deploying to other VPS platforms
Any virtual server or container system can run the compiled production bundle:
```bash
npm run build
npm run start
```
This produces a compiled self-contained bundle in `/dist` and fires up the Express proxy natively.

---

*Formulated with high accuracy and sleek visual design by The Tiebreaker resolution framework.*
