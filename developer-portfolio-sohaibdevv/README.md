<h1>AI-Generated Developer Portfolio</h1>

<p>
  This project is a modern, single-page developer portfolio created entirely with the assistance of <b>Google AI Studio</b>. The primary goal was to explore and showcase the capabilities of generative AI in building a functional, responsive, and aesthetically pleasing web application from the ground up, based on a reference design.
</p>

<p>
  The AI handled the entire development process, including:
</p>
<ul>
  <li>Generating the React components with TypeScript.</li>
  <li>Structuring the project with a logical folder hierarchy.</li>
  <li>Styling all components using Tailwind CSS.</li>
  <li>Writing clean, readable, and maintainable code.</li>
  <li>Integrating with Netlify for seamless deployment and form handling.</li>
</ul>

<h2>Features</h2>
<ul>
  <li><b>AI-Powered Development</b>: A testament to the capabilities of Google's Gemini models in software engineering.</li>
  <li><b>Fully Responsive</b>: Adapts seamlessly to all screen sizes, from mobile to desktop.</li>
  <li><b>Modern UI/UX</b>: Clean, visually appealing design with smooth animations and transitions.</li>
  <li><b>Interactive Sections</b>: Includes sections for Home, About, Skills, dynamic Project filtering, and a Contact form.</li>
  <li><b>Netlify-Ready</b>: Optimized for deployment on Netlify, including serverless form handling.</li>
  <li><b>Zero-Build Setup</b>: Uses <code>importmap</code> to load React directly from a CDN, eliminating the need for a complex build process.</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li><b>Framework</b>: React 19</li>
  <li><b>Language</b>: TypeScript</li>
  <li><b>Styling</b>: Tailwind CSS (via CDN)</li>
  <li><b>Module Loading</b>: Native ES Modules with <code>importmap</code></li>
  <li><b>Deployment</b>: Netlify</li>
</ul>

<h2>Getting Started (Local Development)</h2>
<p>
  This project is configured to run without a traditional build step (like Vite or Create React App). You only need a simple local server to view it.
</p>

<h3>Prerequisites</h3>
<p>
  You must have <a href="https://nodejs.org/" rel="nofollow">Node.js</a> installed on your machine, which includes <code>npx</code>.
</p>

<h3>Running Locally</h3>
<ol>
  <li><b>Clone the repository:</b>
    <pre><code>git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name</code></pre>
    <p>*(Note: Update the repository URL after you publish it.)*</p>
  </li>
  <li><b>Start a local server:</b>
    <p>The easiest way to run a local server is with the <code>serve</code> package. Run the following command in the root of your project folder:</p>
    <pre><code>npx serve</code></pre>
  </li>
  <li><b>Open in browser:</b>
    <p>The server will start, and you can view the portfolio in your browser at the URL provided in the terminal (usually <code>http://localhost:3000</code>).</p>
  </li>
</ol>

<h2>Deployment to Netlify</h2>
<p>
  This project is optimized for easy deployment on <a href="https://www.netlify.com/" rel="nofollow">Netlify</a>.
</p>

<h3>Method 1: Manual Deploy (Drag and Drop)</h3>
<p>
  This is the quickest way to get your site live.
</p>
<ol>
  <li>Log in to your Netlify account.</li>
  <li>Go to the "Sites" tab.</li>
  <li>Drag the entire project folder from your computer and drop it into the deployment area in the Netlify UI.</li>
  <li>Netlify will upload the files and your site will be live in seconds!</li>
</ol>

<h3>Method 2: Git-Based Continuous Deployment</h3>
<p>
  This method automatically deploys your site whenever you push changes to your Git repository.
</p>
<ol>
  <li><b>Push your project to a Git provider</b> (e.g., GitHub, GitLab).</li>
  <li><b>In Netlify, click "Add new site" > "Import an existing project".</b></li>
  <li><b>Connect to your Git provider</b> and select the repository for your portfolio.</li>
  <li><b>Configure the build settings:</b>
    <ul>
      <li><b>Build command:</b> Leave this field **blank**.</li>
      <li><b>Publish directory:</b> Set this to <code>.</code> (a single dot) or leave it as the root of your project (the default is often correct).</li>
    </ul>
  </li>
  <li><b>Click "Deploy site".</b> Your site will be built and deployed. Future <code>git push</code> commands to your main branch will trigger automatic deployments.</li>
</ol>

<h2>Form Handling</h2>
<p>
  The contact form is integrated with <b>Netlify Forms</b>.
</p>
<ul>
  <li>When a user submits the form, the data is securely captured in your Netlify dashboard under the "Forms" section for your site.</li>
  <li>The form uses an AJAX submission, so the user receives a confirmation message without the page reloading, providing a smoother experience.</li>
  <li>It also includes a "honeypot" field for basic spam prevention.</li>
</ul>

<h2>Acknowledgement</h2>
<p>
  This project stands as a practical example of the power and potential of Google AI Studio for rapid prototyping and development. The entire application was generated based on high-level prompts and iterative refinements, demonstrating a new paradigm in web development.
</p>

<h2>License</h2>
<p>
  This project is licensed under the MIT License. See the <a href="./LICENSE" rel="noopener noreferrer">LICENSE</a> file for details.
</p>

### Created by
This project was built by [Sohaibdevv](https://github.com/sohaibdevv)
