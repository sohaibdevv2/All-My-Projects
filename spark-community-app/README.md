<h1>Spark Community</h1>

<p>
  Spark Community is a modern, lightweight blogging platform inspired by Medium. It allows users to read, write, and engage with articles in a clean, minimalist interface. The entire application is built as a single-page application without any server-side rendering or complex build steps.
</p>

<h2>Features</h2>
<ul>
  <li><b>Read Articles:</b> Browse a feed of articles on the homepage.</li>
  <li><b>Full Article View:</b> Click on any article to read its full content.</li>
  <li><b>Write & Publish:</b> Create and publish your own stories.</li>
  <li><b>Delete Stories:</b> Remove articles you've published.</li>
  <li><b>Personalized:</b> The app asks for your name to personalize the experience.</li>
</ul>

<h2>Tech Stack</h2>
<p>
  This project is built with a modern, no-build-step frontend stack:
</p>
<ul>
  <li><b>Framework:</b> <b>React 19</b> (using Hooks for state and effects).</li>
  <li><b>Language:</b> <b>TypeScript</b> for type safety.</li>
  <li><b>Routing:</b> <b>React Router</b> for client-side navigation.</li>
  <li><b>Styling:</b> <b>Tailwind CSS</b> (via CDN) for a utility-first CSS workflow.</li>
  <li><b>Module Loading:</b> <b>ES Modules via Import Maps</b>. All dependencies (<code>react</code>, <code>react-dom</code>, etc.) are loaded directly in the browser from the <code>esm.sh</code> CDN, eliminating the need for a local build process (like Webpack or Vite).</li>
</ul>

<h2>Running Locally</h2>
<p>
  Since this project uses a no-build-step setup, you don't need to install any <code>node_modules</code>. You only need a simple local web server to serve the <code>index.html</code> file.
</p>
<ol>
  <li>Open your terminal in the project's root directory.</li>
  <li>Run one of the following commands:
    <br/><br/>
    <b>If you have Python 3:</b>
    <pre><code>python -m http.server</code></pre>
    <br/>
    <b>If you have Node.js/npx:</b>
    <pre><code>npx serve</code></pre>
  </li>
  <li>Open your browser and navigate to the local address provided (e.g., <code>http://localhost:8000</code> or <code>http://localhost:3000</code>).</li>
</ol>

<h2>Manual Deployment to Netlify</h2>
<p>
  Deploying this app to Netlify is incredibly simple because there are no build steps.
</p>
<ol>
  <li><b>Log in</b> to your Netlify account.</li>
  <li>Navigate to the <b>"Sites"</b> section.</li>
  <li><b>Drag and drop</b> your entire project folder directly onto the deployment area in the Netlify UI.</li>
</ol>
<p>
  That's it! Netlify will automatically detect the <code>index.html</code> file and deploy your site. No build command or publish directory configuration is needed.
</p>
