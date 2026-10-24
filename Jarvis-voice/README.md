<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/en/4/47/Iron_Man_%28film%29.jpg" width="100%" style="border-radius:12px;" alt="Iron Man JARVIS"/>

# ⚡ J.A.R.V.I.S
### Just A Rather Very Intelligent System

<img src="https://readme-typing-svg.demolab.com?font=Courier+New&size=22&duration=3000&pause=1000&color=FFB800&center=true&vCenter=true&width=600&lines=AI+Voice+Assistant;42+Particle+Simulations;Groq+%7C+Llama+3.1+Powered;British+Voice+%7C+HUD+Interface;Press+SPACE+to+Speak%2C+Boss." alt="Typing SVG" />

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_LIVE_DEMO-GitHub_Pages-FFB800?style=for-the-badge&labelColor=000000)](https://sohaibdevv.github.io/Jarvis-voice/)
[![GitHub Stars](https://img.shields.io/github/stars/sohaibdevv/Jarvis-voice?style=for-the-badge&color=FFB800&labelColor=000000)](https://github.com/sohaibdevv/Jarvis-voice/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/sohaibdevv/Jarvis-voice?style=for-the-badge&color=FFB800&labelColor=000000)](https://github.com/sohaibdevv/Jarvis-voice/forks)
[![License](https://img.shields.io/badge/License-MIT-FFB800?style=for-the-badge&labelColor=000000)](LICENSE)

<br/>

> *"Good day, boss. All systems are operational."*

</div>

---

<div align="center">

## 🎬 Preview

```
╔══════════════════════════════════════════════════════════╗
║  J.A.R.V.I.S v3.0                STANDBY          MARK VII  ║
║  ┌──                                                  ──┐  ║
║  │                                                      │  ║
║  │            ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌                       │  ║
║  │         ◌    ╔═══════╗    ◌                         │  ║
║  │       ◌      ║   J   ║      ◌                       │  ║
║  │         ◌    ╚═══════╝    ◌                         │  ║
║  │            ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌ ◌                       │  ║
║  │  ┌─────────────────────────────────────────────┐   │  ║
║  │  │ J.A.R.V.I.S RESPONSE              READY     │   │  ║
║  │  │ Good day boss. All systems are operational. │   │  ║
║  │  └─────────────────────────────────────────────┘   │  ║
║  │                     [ 🎤 SPEAK ]                    │  ║
║  └──                                                  ──┘  ║
║  FPS: 60              VORTEX              PARTICLES: 320  ║
╚══════════════════════════════════════════════════════════╝
```

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Brain** | Groq API with `llama-3.1-8b-instant` — blazing fast responses |
| 🎙️ **Voice Input** | Web Speech API — just press `SPACE` and talk |
| 🔊 **British TTS** | SpeechSynthesis with calm, authoritative British voice |
| 🌌 **42 Particle Sims** | Canvas-powered physics simulations, switchable by voice |
| 🖥️ **HUD Interface** | Iron Man-style UI with rotating rings, scan line, corner brackets |
| ⚡ **Instant Response** | Sub-second Groq inference — no waiting |
| 📱 **Mobile Ready** | Fully responsive on all screen sizes |
| 🔒 **Secure Deploy** | API key injected via GitHub Secrets — never committed |

---

## 🌌 42 Particle Simulations

> Say any simulation name aloud — JARVIS switches instantly.

<div align="center">

| | | | | | |
|---|---|---|---|---|---|
| `vortex` | `galaxy` | `neural` | `dna` | `wave` | `sphere` |
| `orbit` | `rain` | `fire` | `matrix` | `spiral` | `explode` |
| `flow` | `constellation` | `wormhole` | `reactor` | `storm` | `network` |
| `aurora` | `clock` | `repel` | `attract` | `fountain` | `chaos` |
| `grid` | `morph` | `laser` | `bounce` | `rings` | `tunnel` |
| `comet` | `mist` | `shockwave` | `disco` | `weave` | `magneto` |
| `nebula` | `crystal` | `heartbeat` | `swarm` | `pulse` | `snowflake` |

</div>

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sohaibdevv/Jarvis-voice.git
cd Jarvis-voice
```

### 2. Add your Groq API key

```bash
cp config.example.js config.js
```

Open `config.js` and paste your key:

```js
const GROQ_CONFIG = {
  apiKey: "gsk_your_key_here",          // 👈 from console.groq.com
  model: "llama-3.1-8b-instant",
  endpoint: "https://api.groq.com/openai/v1/chat/completions"
};
```

Get a **free** API key → [console.groq.com](https://console.groq.com/)

### 3. Run locally

Open `index.html` directly in Chrome or Edge, or use a local server:

```bash
python3 -m http.server 8080
# → open http://localhost:8080
```

---

## ☁️ Deploy to GitHub Pages (with secret API key)

### Step 1 — Enable GitHub Pages

Go to your repo → **Settings** → **Pages** → Source: `GitHub Actions`

### Step 2 — Add your API key as a secret

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

```
Name:  GROQ_API_KEY
Value: gsk_your_real_key_here
```

### Step 3 — Push and you're live

```bash
git push origin main
# GitHub Actions builds and deploys automatically
# Live at: https://sohaibdevv.github.io/Jarvis-voice/
```

> The workflow injects your secret into `config.js` at build time — the key is **never stored in the repo**.

---

## ⌨️ Controls

| Control | Action |
|---|---|
| `SPACE` | Toggle voice listening |
| `Click mic` | Toggle voice listening |
| `ESC` | Stop listening / stop speech |
| `Say sim name` | Instantly switch particle simulation |
| `1` – `0` keys | Quick switch: vortex → galaxy → neural → fire → matrix → aurora → heartbeat → disco → nebula → wormhole |
| `SIM PANEL` button | Open full simulation picker |

---

## 🛠️ Tech Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-000000?style=for-the-badge&logo=html5&logoColor=FFB800)
![CSS3](https://img.shields.io/badge/CSS3-000000?style=for-the-badge&logo=css3&logoColor=FFB800)
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=for-the-badge&logo=javascript&logoColor=FFB800)
![Groq](https://img.shields.io/badge/Groq_API-000000?style=for-the-badge&logoColor=FFB800)

</div>

| Layer | Technology |
|---|---|
| **AI Model** | Groq — `llama-3.1-8b-instant` |
| **Voice Input** | Web Speech API (`SpeechRecognition`) |
| **Voice Output** | Web Speech API (`SpeechSynthesis`) |
| **Graphics** | Canvas API — custom particle physics engine |
| **Frontend** | Vanilla HTML + CSS + JS — zero dependencies |
| **Deploy** | GitHub Actions + GitHub Pages |
| **Security** | GitHub Secrets — API key never in source |

---

## 🌐 Browser Support

| Browser | Voice Input | Voice Output | Particles |
|---|---|---|---|
| ✅ Chrome | Full | Full | Full |
| ✅ Edge | Full | Full | Full |
| ⚠️ Safari | Partial | Full | Full |
| ❌ Firefox | Not supported | Full | Full |

> **Best experience: Google Chrome**

---

## 📁 Project Structure

```
Jarvis-voice/
├── index.html           # Main HUD layout
├── style.css            # Black & gold theme, animations
├── particles.js         # 42 particle simulation engine
├── jarvis.js            # AI brain — voice, Groq API, TTS
├── config.example.js    # API key template (safe to commit)
├── config.js            # Your real key (gitignored)
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml   # Auto-deploy with secret injection
└── README.md
```

---

## 🤖 JARVIS Personality

```
System: You are J.A.R.V.I.S — Just A Rather Very Intelligent System.
        Witty. Sarcastic. Brilliant. Slightly smug.
        Always calls user "boss".
        Plain text only. Under 4 sentences.
        Ends with a dry quip. Never breaks character.
```

---

<div align="center">

## 💬 Sample Conversations

*"Boss, your question has been processed. The answer, while obvious to me, I'll present at your level."*

*"Switching to galaxy simulation. Aesthetics are a science, boss."*

*"Good day, boss. All systems are operational. Awaiting your command — or a witty remark, whichever comes first."*

---

**Made with ⚡**

[![GitHub](https://img.shields.io/badge/GitHub-sohaibdevv-FFB800?style=for-the-badge&logo=github&labelColor=000000)](https://github.com/sohaibdevv)

*"I was designed to be helpful, not agreeable." ~ J.A.R.V.I.S*

</div>
