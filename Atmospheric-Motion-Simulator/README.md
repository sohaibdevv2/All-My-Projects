# Atmospheric Motion Simulator

A minimalist, high-fidelity interactive physical presentation simulator built with **React**, **Vite**, **Tailwind CSS v4**, and **Motion**. This application features elegant real-time simulation vectors demonstrating fluid client-side rendering for medium-sized falling snowflakes and rising helium balloons.

---

## 🎨 Design Concept & Features

- **Formal Aesthetic**: Styled with a minimal high-contrast layout using the "Space Grotesk" display font, "Inter" primary UI font, and subtle slate color scales.
- **Physical Particle Rendering**:
  - **Snowflakes Cascade**: Generates medium-sized crystalline snowflakes falling dynamically from top to bottom with variable wind drift and rotational speed.
  - **Balloons Ascent**: Animates multi-colored jewel-tone physical balloon vectors floating gracefully upwards from the bottom of the screen with visual specularity highlights, knot ties, and delicate anchor strings.
- **Micro-Interactions**: Features a real-time countdown progress controller set exactly to a **5.0-second duration cutoff** with full simulation interruption capabilities.

---

## 💻 Local Workspace Installation

Follow these steps to run the application locally on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) and [npm](https://www.npmjs.com/) installed.

### Step 1: Clone or Extract the Project
If using a ZIP export, extract all the contents into a clean workspace directory.

### Step 2: Install Node Modules
Open your terminal inside the project root folder and execute:
```bash
npm install
```

### Step 3: Launch local development server
Run the development command to launch the hot-reloading server:
```bash
npm run dev
```
By default, the server will be available at: **`http://localhost:3000`** (or another port outputted in your console).

### Step 4: Build for Production locally
To verify production packaging and bundle optimizations, run:
```bash
npm run build
```
This produces optimized production assets inside the local `/dist` directory.

---

## 🚀 Deployment Instructions

### 1. Deploying to Vercel (Highly Recommended for Vite)

Vercel provides native, automatic, zero-configuration hosting for Vite/React applications.

#### Approach A: Using Vercel Integration with GitHub
1. Create a repository on **GitHub** and push your project code there.
2. Sign in to [Vercel](https://vercel.com).
3. Click **"Add New"** > **"Project"**.
4. Import your GitHub repository.
5. Vercel will automatically detect **Vite** and configure the correct settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your live production URL will compile in under a minute!

#### Approach B: Using Vercel CLI
If you want to deploy directly from your local terminal:
```bash
# Install Vercel CLI globally
npm install -g vercel

# Run the deployment command inside the root folder
vercel
```
Follow the interactive prompts to authenticate, choose your workspace, and launch your site.

---

### 2. Deploying to GitHub Pages

To compile and host this static client app directly onto GitHub's free servers:

#### Step 1: Add the `gh-pages` package to devDependencies
```bash
npm install --save-dev gh-pages
```

#### Step 2: Configure root directory base in `vite.config.ts`
If your repository URL is `https://github.com/username/repo-name`, add the `base` configuration option to your exports in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/repo-name/', // Replaces "repo-name" with your exact GitHub repository path
  // ... other parameters
})
```

#### Step 3: Add deployment scripts to `package.json`
Insert these scripts under the `"scripts"` field in your `package.json` file:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

#### Step 4: Trigger Deployment
Run the following terminal script to compile and push your code path directly to the `gh-pages` branch:
```bash
npm run deploy
```
Lastly, navigate to your repository's **Settings > Pages** page on GitHub, and verify the source is pointing to the `gh-pages` branch.

---

## 📁 Technical Architecture

```text
├── index.html            # Primary single-page HTML template entrypoint
├── package.json          # Node dependency orchestrator and build scripts
├── vite.config.ts        # Vite execution configurations
├── tsconfig.json         # Strict TypeScript compiler options
└── src/
    ├── main.tsx          # React virtual-DOM bootstrapping hook
    ├── App.tsx           # Main application shell with simulation vectors
    ├── index.css         # Tailwind v4 directives and Custom Google Fonts
    ├── types.ts          # Strongly typed Snowflake & Balloon definitions
    └── components/
        └── ParticleLayer.tsx # Core high-performance dynamic rendering component
```
