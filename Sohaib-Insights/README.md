# Sohaib Insights


This project was developed to demonstrate the capabilities of AI within Google AI Studio, following the completion of the Google Prompting Essentials Specialization course.

A modern, responsive React application that seamlessly fetches and displays articles from your Medium profile in an elegant card layout. Built with cutting-edge technologies for optimal performance and user experience.

## How to Deploy This App (Fastest Method)

To take this code from the playground to a real live website, follow these steps.

### Prerequisites
- Node.js installed on your computer.
- A GitHub account.
- A Vercel account (free).

### Step 1: Create a Local Project
Open your terminal and run the following command to create a standard React + Vite project named **sohaib-insights**:

```bash
npm create vite@latest sohaib-insights -- --template react-ts
cd sohaib-insights
npm install
```

### Step 2: Install Dependencies
Install the required libraries used in this code:

```bash
npm install lucide-react
```

### Step 3: Copy the Code
1. Open `src/App.tsx` in your code editor.
2. **Replace** the entire content of `src/App.tsx` with the code from the `index.tsx` file in this project (excluding the `createRoot` and `render` calls at the very bottom).
3. Ensure `main.tsx` (created by Vite) is rendering `<App />`.

### Step 4: Push to GitHub
Run these commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit"
# Go to GitHub.com, create a new repository called 'sohaib-insights', and copy the URL.
git remote add origin https://github.com/YOUR_USERNAME/sohaib-insights.git
git push -u origin main
```

### Step 5: Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Import your `sohaib-insights` GitHub repository.
4. Click **"Deploy"**.

Done! Your site will be live in less than a minute.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sohaib-insights.git
   cd sohaib-insights
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. The app will display your Medium articles in a card layout.
3. Customize the content by modifying the `src/App.tsx` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6.svg)](https://www.typescriptlang.org/)
