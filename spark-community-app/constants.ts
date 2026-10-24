import { Article } from './types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Rise of Serverless: A Developer\'s Guide',
    authorName: 'Alex Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    publicationDate: 'Oct 22, 2023',
    readTimeMinutes: 8,
    snippet: 'Serverless architecture is more than a buzzword; it\'s a paradigm shift. It frees developers from managing infrastructure, allowing them to focus purely on code and innovation.',
    content: `
      <p class="mb-6 text-lg">In the ever-evolving landscape of cloud computing, serverless has emerged as a transformative force. But what does it really mean? At its core, serverless architecture allows developers to build and run applications without thinking about servers. The cloud provider automatically provisions, scales, and manages the infrastructure required to run the code.</p>
      <p class="mb-6 text-lg">This model, exemplified by services like AWS Lambda, Azure Functions, and Google Cloud Functions, offers immense benefits. Developers can accelerate their time-to-market, reduce operational overhead, and pay only for the compute time they consume. It's a powerful approach for microservices, real-time data processing, and event-driven applications.</p>
      <img src="https://picsum.photos/800/400?random=5" alt="Cloud native abstract art" class="w-full h-auto rounded-lg my-8 shadow-md" />
      <h3 class="text-2xl font-bold mt-8 mb-4">The Trade-offs and Considerations</h3>
      <p class="mb-6 text-lg">However, serverless is not a silver bullet. It introduces new complexities like "cold starts," potential for vendor lock-in, and challenges in local testing and debugging. Understanding these trade-offs is crucial. Choosing serverless means embracing a new way of thinking about application architecture, one that prioritizes stateless functions and event-driven communication.</p>
    `,
    imageUrl: 'https://picsum.photos/600/400?random=5',
    claps: 1800,
    comments: 62
  },
  {
    id: '2',
    title: 'From Classes to Hooks: Mastering Modern React',
    authorName: 'Brian Smith',
    authorAvatar: 'https://randomuser.me/api/portraits/men/47.jpg',
    publicationDate: 'Oct 20, 2023',
    readTimeMinutes: 10,
    snippet: 'React Hooks revolutionized how we write components. This guide demystifies useState, useEffect, and custom hooks to help you write cleaner, more reusable, and more powerful React code.',
    content: `
      <p class="mb-6 text-lg">For years, React developers relied on class components to manage state and lifecycle methods. With the introduction of Hooks in React 16.8, that all changed. Hooks allow you to "hook into" React state and lifecycle features from function components, leading to more concise and readable code.</p>
      <h3 class="text-2xl font-bold mt-8 mb-4">Understanding useState and useEffect</h3>
      <p class="mb-6 text-lg">The two most fundamental hooks are <code>useState</code> and <code>useEffect</code>. <code>useState</code> provides a simple way to add state to your components, returning a stateful value and a function to update it. <code>useEffect</code>, on the other hand, lets you perform side effects in your components, such as fetching data, subscribing to events, or manually changing the DOM. It combines the functionalities of <code>componentDidMount</code>, <code>componentDidUpdate</code>, and <code>componentWillUnmount</code> into a single API.</p>
      <img src="https://picsum.photos/800/400?random=6" alt="React code on a screen" class="w-full h-auto rounded-lg my-8 shadow-md" />
      <h3 class="text-2xl font-bold mt-8 mb-4">The Power of Custom Hooks</h3>
      <p class="mb-6 text-lg">The true power of Hooks is unlocked when you start creating your own. A custom hook is simply a JavaScript function whose name starts with "use" and that can call other hooks. This allows you to extract component logic into reusable functions. Imagine a <code>useApi</code> hook that handles data fetching, loading states, and errors for you. This is the new frontier of React development—building powerful, encapsulated, and shareable logic.</p>
    `,
    imageUrl: 'https://picsum.photos/600/400?random=6',
    claps: 2500,
    comments: 98
  },
  {
    id: '3',
    title: 'The Unsung Hero: Why Great API Design Matters',
    authorName: 'Carlos Rodriguez',
    authorAvatar: 'https://randomuser.me/api/portraits/men/48.jpg',
    publicationDate: 'Oct 18, 2023',
    readTimeMinutes: 7,
    snippet: 'We perfect our UI and optimize our databases, but what about the glue that holds it all together? A well-designed API is crucial for a scalable, maintainable, and developer-friendly system.',
    content: `
      <p class="mb-6 text-lg">An API (Application Programming Interface) is the contract that allows different parts of a software system, or different systems altogether, to communicate. A great API can accelerate development and adoption, while a poor one can lead to confusion, bugs, and endless frustration. It is the unsung hero of modern software.</p>
      <img src="https://picsum.photos/800/400?random=7" alt="Abstract API connection diagram" class="w-full h-auto rounded-lg my-8 shadow-md" />
      <h3 class="text-2xl font-bold mt-8 mb-4">Principles of Good API Design</h3>
      <p class="mb-6 text-lg">What makes an API "good"? It starts with being predictable and consistent. Use clear resource naming (e.g., <code>/users</code> instead of <code>/getUsers</code>), leverage HTTP verbs correctly (GET, POST, PUT, DELETE), and provide meaningful status codes (200 OK, 201 Created, 404 Not Found, etc.).</p>
      <p class="mb-6 text-lg">Furthermore, great documentation is non-negotiable. Tools like Swagger or OpenAPI can automatically generate interactive documentation that makes your API easy for other developers to discover and use. Finally, think about versioning from the start (e.g., <code>/api/v1/users</code>). It will save you from breaking changes and headaches down the road.</p>
    `,
    imageUrl: 'https://picsum.photos/600/400?random=7',
    claps: 1650,
    comments: 55
  },
  {
    id: '4',
    title: 'Docker in Plain English: A Developer\'s Guide',
    authorName: 'Samuel Lee',
    authorAvatar: 'https://randomuser.me/api/portraits/men/49.jpg',
    publicationDate: 'Oct 15, 2023',
    readTimeMinutes: 9,
    snippet: 'Tired of saying "it works on my machine"? Docker solves that. This guide breaks down containerization, showing how Docker can streamline your development workflow and deployment.',
    content: `
      <p class="mb-6 text-lg">Docker is a platform for developing, shipping, and running applications in containers. A container packages up code and all its dependencies, so the application runs quickly and reliably from one computing environment to another. It's like a lightweight, portable virtual machine.</p>
      <p class="mb-6 text-lg">The core of Docker is the <code>Dockerfile</code>, a simple text file that contains instructions for how to build a Docker image. This image is a snapshot, a template for your application environment. From this one image, you can spin up hundreds of identical containers, ensuring consistency from your laptop to the production server.</p>
      <img src="https://picsum.photos/800/400?random=8" alt="Docker whale logo with containers" class="w-full h-auto rounded-lg my-8 shadow-md" />
      <h3 class="text-2xl font-bold mt-8 mb-4">Why Should You Care?</h3>
      <p class="mb-6 text-lg">For developers, Docker eliminates the "works on my machine" problem. New team members can get up and running in minutes, not days. For operations, it simplifies deployment and scaling. Complex applications can be managed with tools like Docker Compose or Kubernetes, orchestrating many containers working together.</p>
      <p class="mb-6 text-lg">Learning Docker is no longer a niche skill for DevOps engineers; it's a fundamental tool for the modern software developer. It improves collaboration, simplifies releases, and ultimately allows you to build better software, faster.</p>
    `,
    imageUrl: 'https://picsum.photos/600/400?random=8',
    claps: 2200,
    comments: 81
  }
];