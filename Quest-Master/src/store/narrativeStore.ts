import { create } from 'zustand';
import {
  NarrativeNode,
  CareerAccomplishment,
  TechBadge,
  ProjectHighlight,
  NarrativeState,
} from '@/types/narrative';

interface NarrativeStore extends NarrativeState {
  narrativeNodes: NarrativeNode[];
  allAccomplishments: CareerAccomplishment[];
  allBadges: TechBadge[];
  allProjects: ProjectHighlight[];

  // Narrative Actions
  startNarrative: () => void;
  makeChoice: (choiceId: string) => void;
  getCurrentNode: () => NarrativeNode | undefined;

  // Unlock Actions
  unlockAccomplishment: (id: string) => void;
  unlockBadge: (id: string) => void;
  unlockProject: (id: string) => void;

  // Query Actions
  getUnlockedAccomplishments: () => CareerAccomplishment[];
  getUnlockedBadges: () => TechBadge[];
  getUnlockedProjects: () => ProjectHighlight[];

  // Reset
  resetNarrative: () => void;
}

// Narrative content - the full branching story
const narrativeNodes: NarrativeNode[] = [
  {
    id: 'start',
    title: 'Your Journey Begins',
    text: `Welcome, aspiring developer! You're about to embark on your tech career. The path you choose will shape your skills, technologies, and the projects you create. What approach resonates with you?`,
    choices: [
      {
        id: 'choice-frontend',
        text: '🎨 Start with Frontend: Build beautiful user experiences',
        nextNodeId: 'frontend-path-1',
        outcomes: {
          techBadges: ['react', 'tailwind'],
          accomplishments: ['first-line-code'],
        },
      },
      {
        id: 'choice-backend',
        text: '⚙️ Start with Backend: Build powerful servers',
        nextNodeId: 'backend-path-1',
        outcomes: {
          techBadges: ['nodejs', 'database'],
          accomplishments: ['first-line-code'],
        },
      },
      {
        id: 'choice-fullstack',
        text: '🚀 Go Full Stack: Master both worlds',
        nextNodeId: 'fullstack-path-1',
        outcomes: {
          techBadges: ['typescript', 'nodejs'],
          accomplishments: ['first-line-code', 'full-stack-mindset'],
        },
      },
    ],
  },
  {
    id: 'frontend-path-1',
    title: 'The Frontend Journey Begins',
    text: `You've chosen to master user interfaces! Your first task is to build responsive layouts. You spend weeks learning CSS Flexbox and Grid.`,
    choices: [
      {
        id: 'choice-fw-framework',
        text: '📚 Learn a Framework (React/Vue)',
        nextNodeId: 'frontend-path-2',
        outcomes: {
          techBadges: ['react', 'javascript'],
          accomplishments: ['framework-master'],
          xpReward: 100,
        },
      },
      {
        id: 'choice-fw-styling',
        text: '🎨 Master CSS & Design Systems',
        nextNodeId: 'frontend-design-specialist',
        outcomes: {
          techBadges: ['tailwind', 'design-systems'],
          accomplishments: ['design-specialist'],
          projects: ['design-system-project'],
          xpReward: 80,
        },
      },
    ],
  },
  {
    id: 'frontend-path-2',
    title: 'Building with React',
    text: `You dive deep into React, learning about components, hooks, and state management. You build your first interactive web app and deploy it online.`,
    choices: [
      {
        id: 'choice-state-mgmt',
        text: '📦 Master State Management (Redux/Zustand)',
        nextNodeId: 'state-management-specialist',
        outcomes: {
          techBadges: ['zustand', 'state-management'],
          accomplishments: ['state-management-expert'],
          projects: ['complex-app-project'],
          xpReward: 120,
        },
      },
      {
        id: 'choice-animation',
        text: '✨ Learn Animations & Interactions',
        nextNodeId: 'animation-specialist',
        outcomes: {
          techBadges: ['framer-motion', 'ux-design'],
          accomplishments: ['animation-expert'],
          projects: ['interactive-experience-project'],
          xpReward: 100,
        },
      },
    ],
  },
  {
    id: 'backend-path-1',
    title: 'The Backend Adventure',
    text: `You start with the server side, learning about HTTP, databases, and APIs. You build your first REST API and are amazed by its power.`,
    choices: [
      {
        id: 'choice-language',
        text: '🐍 Learn Python & Django',
        nextNodeId: 'python-specialist',
        outcomes: {
          techBadges: ['python', 'django'],
          accomplishments: ['backend-foundation'],
          xpReward: 90,
        },
      },
      {
        id: 'choice-nodejs',
        text: '🟢 Master Node.js & Express',
        nextNodeId: 'nodejs-specialist',
        outcomes: {
          techBadges: ['nodejs', 'javascript'],
          accomplishments: ['backend-foundation'],
          xpReward: 90,
        },
      },
    ],
  },
  {
    id: 'fullstack-path-1',
    title: 'The Full Stack Awakening',
    text: `You realize you can build entire applications from database to interface. This is powerful! You start creating full-stack projects with Next.js.`,
    choices: [
      {
        id: 'choice-nextjs',
        text: '▲ Master Next.js for Full Stack',
        nextNodeId: 'nextjs-specialist',
        outcomes: {
          techBadges: ['nextjs', 'typescript', 'full-stack'],
          accomplishments: ['full-stack-master'],
          projects: ['saas-project'],
          xpReward: 150,
        },
      },
      {
        id: 'choice-microservices',
        text: '🏗️ Learn Microservices Architecture',
        nextNodeId: 'microservices-specialist',
        outcomes: {
          techBadges: ['microservices', 'devops', 'docker'],
          accomplishments: ['architect-mindset'],
          xpReward: 130,
        },
      },
    ],
  },
  {
    id: 'state-management-specialist',
    title: 'State Management Expert',
    text: `You've mastered predictable state management. Your applications are scalable and maintainable. You're approached by companies who need your expertise!`,
    choices: [
      {
        id: 'choice-contribution',
        text: '🌟 Contribute to Open Source',
        nextNodeId: 'open-source-end',
        outcomes: {
          accomplishments: ['open-source-contributor', 'community-leader'],
          xpReward: 100,
        },
      },
      {
        id: 'choice-job-offer',
        text: '💼 Accept Dream Job Offer',
        nextNodeId: 'dream-job-end',
        outcomes: {
          accomplishments: ['first-major-role'],
          xpReward: 150,
        },
      },
    ],
  },
  {
    id: 'animation-specialist',
    title: 'The Animation Wizard',
    text: `Your interfaces dance and delight users. Every micro-interaction is carefully crafted. You become known for creating beautiful, performant experiences.`,
    choices: [
      {
        id: 'choice-design-collab',
        text: '🤝 Collaborate with Designers',
        nextNodeId: 'design-collaboration-end',
        outcomes: {
          accomplishments: ['designer-collaboration'],
          projects: ['award-winning-project'],
          xpReward: 120,
        },
      },
      {
        id: 'choice-freelance',
        text: '🎯 Go Freelance & Build Products',
        nextNodeId: 'entrepreneur-end',
        outcomes: {
          accomplishments: ['product-creator'],
          xpReward: 140,
        },
      },
    ],
  },
  {
    id: 'nodejs-specialist',
    title: 'Node.js Mastery',
    text: `You've built scalable APIs, handled real-time communication, and optimized database queries. Your servers handle millions of requests. You're a backend powerhouse!`,
    choices: [
      {
        id: 'choice-devops',
        text: '☁️ Learn DevOps & Deployment',
        nextNodeId: 'devops-specialist',
        outcomes: {
          techBadges: ['docker', 'kubernetes', 'aws'],
          accomplishments: ['devops-engineer'],
          xpReward: 140,
        },
      },
      {
        id: 'choice-startup',
        text: '🚀 Join a Fast-Growing Startup',
        nextNodeId: 'startup-end',
        outcomes: {
          accomplishments: ['startup-veteran'],
          xpReward: 160,
        },
      },
    ],
  },
  {
    id: 'nextjs-specialist',
    title: 'The Full Stack Master',
    text: `You've created multiple SaaS applications, each more impressive than the last. You understand the entire stack deeply. Companies want to learn from you!`,
    choices: [
      {
        id: 'choice-mentor',
        text: '👥 Become a Mentor & Educator',
        nextNodeId: 'mentor-end',
        outcomes: {
          accomplishments: ['mentor', 'thought-leader'],
          projects: ['educational-platform'],
          xpReward: 130,
        },
      },
      {
        id: 'choice-startup-founder',
        text: '🌍 Found Your Own Startup',
        nextNodeId: 'founder-end',
        outcomes: {
          accomplishments: ['founder', 'entrepreneur'],
          xpReward: 200,
        },
      },
    ],
  },
  {
    id: 'open-source-end',
    title: 'Open Source Champion 🌟',
    text: `Your contributions to open source have impacted millions of developers worldwide. You're now maintaining popular libraries and mentoring new contributors. Your code is used in production across the globe!`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'dream-job-end',
    title: 'Dream Role Secured 💼',
    text: `You land a position at a top tech company working on projects you're passionate about. Your expertise in state management becomes invaluable, and you grow into a senior role leading technical decisions.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'design-collaboration-end',
    title: 'Design-Dev Superpower ✨',
    text: `Your collaboration with designers creates award-winning digital experiences. You bridge the gap between design and development, becoming an invaluable team member everywhere you go.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'entrepreneur-end',
    title: 'Independent Builder 🎯',
    text: `Your freelance career thrives as clients appreciate your ability to create beautiful, interactive experiences. You build your own products and watch them grow, gaining both financial independence and creative fulfillment.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'devops-specialist',
    title: 'DevOps Engineer 🚀',
    text: `You've mastered deployment pipelines, containerization, and cloud infrastructure. You're now ensuring applications run smoothly at scale, and your skills are in high demand across the industry.`,
    choices: [
      {
        id: 'choice-cloud-architect',
        text: '☁️ Become a Cloud Architect',
        nextNodeId: 'cloud-architect-end',
        outcomes: {
          accomplishments: ['cloud-architect'],
          xpReward: 200,
        },
      },
    ],
  },
  {
    id: 'startup-end',
    title: 'Startup Success Story 🚀',
    text: `You're part of a fast-growing startup that's changing the industry. Your backend skills handle the rapid scaling, and you witness your code powering a product used by millions.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'mentor-end',
    title: 'Educator & Mentor 👥',
    text: `You've created courses, written technical articles, and mentored dozens of developers. Your impact extends beyond code—you're shaping the next generation of developers.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'founder-end',
    title: 'Founder & Visionary 🌍',
    text: `Your SaaS startup is growing rapidly with real customers and revenue. You're building a company, not just code. You're now a founder addressing real-world problems with elegant solutions.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'cloud-architect-end',
    title: 'Cloud Architecture Leader ☁️',
    text: `You're designing enterprise-scale cloud infrastructure that powers billions of transactions. Your architectural decisions impact millions of users worldwide.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'frontend-design-specialist',
    title: 'Design System Architect',
    text: `You've created a comprehensive design system used across multiple products. Your component libraries and design tokens are the foundation of beautiful, consistent experiences.`,
    choices: [
      {
        id: 'choice-design-lead',
        text: '🎨 Lead Design at a Company',
        nextNodeId: 'design-lead-end',
        outcomes: {
          accomplishments: ['design-leader'],
          xpReward: 150,
        },
      },
    ],
  },
  {
    id: 'design-lead-end',
    title: 'Design Systems Leader 🎨',
    text: `You're leading the design system initiative at a growing company. Your work standardizes how the entire organization builds beautiful interfaces.`,
    choices: [],
    isEnding: true,
    endingType: 'success',
  },
  {
    id: 'python-specialist',
    title: 'Python Backend Expert',
    text: `You've built robust APIs with Django, handled data processing, and optimized database queries. Python's simplicity and power have made you efficient and productive.`,
    choices: [
      {
        id: 'choice-data-engineer',
        text: '📊 Transition to Data Engineering',
        nextNodeId: 'data-engineer-end',
        outcomes: {
          accomplishments: ['data-engineer'],
          xpReward: 140,
        },
      },
    ],
  },
  {
    id: 'data-engineer-end',
    title: 'Data Engineering Expert 📊',
    text: `You've pivoted into data engineering, building pipelines that process terabytes of data. Your expertise in both backend and data makes you incredibly valuable.`,
    choices: [],
    isEnding: true,
    endingType: 'pivot',
  },
  {
    id: 'microservices-specialist',
    title: 'Microservices Architect',
    text: `You've mastered distributed systems, service communication, and DevOps practices. Your architecture enables teams to scale independently and deploy rapidly.`,
    choices: [
      {
        id: 'choice-enterprise-architect',
        text: '🏢 Enterprise Architecture Role',
        nextNodeId: 'enterprise-architect-end',
        outcomes: {
          accomplishments: ['enterprise-architect'],
          xpReward: 180,
        },
      },
    ],
  },
  {
    id: 'enterprise-architect-end',
    title: 'Enterprise Architect 🏢',
    text: `You're now architecting large-scale systems for enterprises. Your decisions influence how thousands of engineers build software across the organization.`,
    choices: [],
    isEnding: true,
    endingType: 'specialization',
  },
];

// Career accomplishments data
const allAccomplishments: CareerAccomplishment[] = [
  {
    id: 'first-line-code',
    title: 'First Line of Code',
    description: 'Wrote your very first line of production code',
    icon: '✍️',
    isUnlocked: false,
  },
  {
    id: 'framework-master',
    title: 'Framework Master',
    description: 'Mastered a modern web framework',
    icon: '🎯',
    isUnlocked: false,
  },
  {
    id: 'design-specialist',
    title: 'Design Specialist',
    description: 'Became an expert in UI/UX design',
    icon: '🎨',
    isUnlocked: false,
  },
  {
    id: 'state-management-expert',
    title: 'State Management Expert',
    description: 'Mastered predictable state management',
    icon: '📦',
    isUnlocked: false,
  },
  {
    id: 'animation-expert',
    title: 'Animation Expert',
    description: 'Created delightful interactions and animations',
    icon: '✨',
    isUnlocked: false,
  },
  {
    id: 'backend-foundation',
    title: 'Backend Foundation',
    description: 'Built your first robust API',
    icon: '⚙️',
    isUnlocked: false,
  },
  {
    id: 'full-stack-mindset',
    title: 'Full Stack Mindset',
    description: 'Embraced full stack development',
    icon: '🚀',
    isUnlocked: false,
  },
  {
    id: 'full-stack-master',
    title: 'Full Stack Master',
    description: 'Became proficient in full stack development',
    icon: '👑',
    isUnlocked: false,
  },
  {
    id: 'architect-mindset',
    title: 'Architect Mindset',
    description: 'Started thinking about system architecture',
    icon: '🏗️',
    isUnlocked: false,
  },
  {
    id: 'open-source-contributor',
    title: 'Open Source Contributor',
    description: 'Contributed to open source projects',
    icon: '🌟',
    isUnlocked: false,
  },
  {
    id: 'community-leader',
    title: 'Community Leader',
    description: 'Leading a community of developers',
    icon: '👥',
    isUnlocked: false,
  },
  {
    id: 'first-major-role',
    title: 'First Major Role',
    description: 'Landed your first significant job',
    icon: '💼',
    isUnlocked: false,
  },
  {
    id: 'designer-collaboration',
    title: 'Designer Collaboration',
    description: 'Mastered working with designers',
    icon: '🤝',
    isUnlocked: false,
  },
  {
    id: 'product-creator',
    title: 'Product Creator',
    description: 'Created your own digital products',
    icon: '🎯',
    isUnlocked: false,
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Mastered deployment and infrastructure',
    icon: '☁️',
    isUnlocked: false,
  },
  {
    id: 'startup-veteran',
    title: 'Startup Veteran',
    description: 'Scaled a startup from early stage',
    icon: '🚀',
    isUnlocked: false,
  },
  {
    id: 'mentor',
    title: 'Mentor',
    description: 'Started mentoring other developers',
    icon: '👥',
    isUnlocked: false,
  },
  {
    id: 'thought-leader',
    title: 'Thought Leader',
    description: 'Became a thought leader in your field',
    icon: '💡',
    isUnlocked: false,
  },
  {
    id: 'founder',
    title: 'Founder',
    description: 'Founded your own startup',
    icon: '🌍',
    isUnlocked: false,
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Built your business',
    icon: '💰',
    isUnlocked: false,
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    description: 'Mastered cloud architecture',
    icon: '☁️',
    isUnlocked: false,
  },
  {
    id: 'design-leader',
    title: 'Design Leader',
    description: 'Leading design at a company',
    icon: '🎨',
    isUnlocked: false,
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    description: 'Transitioned into data engineering',
    icon: '📊',
    isUnlocked: false,
  },
  {
    id: 'enterprise-architect',
    title: 'Enterprise Architect',
    description: 'Architecting enterprise-scale systems',
    icon: '🏢',
    isUnlocked: false,
  },
];

// Tech badges data
const allBadges: TechBadge[] = [
  {
    id: 'react',
    name: 'React',
    description: 'Master of React and component-based architecture',
    category: 'frontend',
    icon: '⚛️',
    isUnlocked: false,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Utility-first CSS expert',
    category: 'frontend',
    icon: '🎨',
    isUnlocked: false,
  },
  {
    id: 'vue',
    name: 'Vue.js',
    description: 'Progressive JavaScript framework expert',
    category: 'frontend',
    icon: '💚',
    isUnlocked: false,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'Type-safe JavaScript specialist',
    category: 'tools',
    icon: '🔵',
    isUnlocked: false,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'JavaScript language expert',
    category: 'frontend',
    icon: '📜',
    isUnlocked: false,
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'Server-side JavaScript expert',
    category: 'backend',
    icon: '🟢',
    isUnlocked: false,
  },
  {
    id: 'database',
    name: 'Databases',
    description: 'SQL and NoSQL database expert',
    category: 'database',
    icon: '🗄️',
    isUnlocked: false,
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python programming expert',
    category: 'backend',
    icon: '🐍',
    isUnlocked: false,
  },
  {
    id: 'django',
    name: 'Django',
    description: 'Django web framework expert',
    category: 'backend',
    icon: '🔗',
    isUnlocked: false,
  },
  {
    id: 'zustand',
    name: 'Zustand',
    description: 'Lightweight state management expert',
    category: 'frontend',
    icon: '🌀',
    isUnlocked: false,
  },
  {
    id: 'state-management',
    name: 'State Management',
    description: 'Redux, Zustand, Context API expert',
    category: 'tools',
    icon: '📦',
    isUnlocked: false,
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    description: 'Motion and animation library expert',
    category: 'frontend',
    icon: '✨',
    isUnlocked: false,
  },
  {
    id: 'ux-design',
    name: 'UX Design',
    description: 'User experience design specialist',
    category: 'frontend',
    icon: '🎯',
    isUnlocked: false,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    description: 'React framework and full-stack development',
    category: 'frontend',
    icon: '▲',
    isUnlocked: false,
  },
  {
    id: 'full-stack',
    name: 'Full Stack',
    description: 'Complete full-stack development expertise',
    category: 'tools',
    icon: '🚀',
    isUnlocked: false,
  },
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'Microservices architecture expert',
    category: 'devops',
    icon: '🏗️',
    isUnlocked: false,
  },
  {
    id: 'devops',
    name: 'DevOps',
    description: 'DevOps and CI/CD specialist',
    category: 'devops',
    icon: '☁️',
    isUnlocked: false,
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Container technology expert',
    category: 'devops',
    icon: '🐳',
    isUnlocked: false,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Container orchestration expert',
    category: 'devops',
    icon: '⚙️',
    isUnlocked: false,
  },
  {
    id: 'aws',
    name: 'AWS',
    description: 'Amazon Web Services cloud specialist',
    category: 'devops',
    icon: '☁️',
    isUnlocked: false,
  },
  {
    id: 'design-systems',
    name: 'Design Systems',
    description: 'Design systems and component libraries',
    category: 'frontend',
    icon: '🎨',
    isUnlocked: false,
  },
];

// Projects data
const allProjects: ProjectHighlight[] = [
  {
    id: 'design-system-project',
    title: 'Design System Component Library',
    description: 'Built a comprehensive design system with reusable components',
    technologies: ['React', 'Tailwind', 'Storybook'],
    icon: '📚',
    isUnlocked: false,
    impact: 'Used by 50+ developers across the organization',
  },
  {
    id: 'complex-app-project',
    title: 'Complex State Management App',
    description: 'Built a large-scale application with sophisticated state management',
    technologies: ['React', 'Zustand', 'TypeScript'],
    icon: '🎯',
    isUnlocked: false,
    impact: 'Handles 10,000+ concurrent users',
  },
  {
    id: 'interactive-experience-project',
    title: 'Interactive Motion Experience',
    description: 'Created delightful, animated user experiences',
    technologies: ['React', 'Framer Motion', 'CSS'],
    icon: '✨',
    isUnlocked: false,
    impact: 'Increased user engagement by 40%',
  },
  {
    id: 'saas-project',
    title: 'Full-Stack SaaS Platform',
    description: 'Built a complete SaaS application from database to UI',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
    icon: '🚀',
    isUnlocked: false,
    impact: 'Acquired 1,000+ paying customers',
  },
  {
    id: 'award-winning-project',
    title: 'Award-Winning Digital Experience',
    description: 'Created a visually stunning, award-winning website',
    technologies: ['React', 'Framer Motion', 'Three.js'],
    icon: '🏆',
    isUnlocked: false,
    impact: 'Won 3 international design awards',
  },
  {
    id: 'educational-platform',
    title: 'Educational Learning Platform',
    description: 'Built a platform for teaching developers',
    technologies: ['Next.js', 'React', 'MDX'],
    icon: '📚',
    isUnlocked: false,
    impact: '100,000+ students graduated',
  },
];

const initialState: NarrativeState = {
  currentNodeId: 'start',
  visitedNodes: [],
  unlockedAccomplishments: [],
  unlockedBadges: [],
  unlockedProjects: [],
  narrativeStarted: false,
  narrativeEnded: false,
};

export const useNarrativeStore = create<NarrativeStore>((set, get) => ({
  ...initialState,
  narrativeNodes,
  allAccomplishments,
  allBadges,
  allProjects,

  startNarrative: () => {
    set({
      narrativeStarted: true,
      visitedNodes: ['start'],
    });
  },

  makeChoice: (choiceId: string) => {
    const state = get();
    const currentNode = state.getCurrentNode();

    if (!currentNode) return;

    const choice = currentNode.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Get the next node
    const nextNodeId = choice.nextNodeId;
    const nextNode = state.narrativeNodes.find((n) => n.id === nextNodeId);

    if (!nextNode) return;

    // Handle outcomes
    if (choice.outcomes) {
      if (choice.outcomes.accomplishments) {
        choice.outcomes.accomplishments.forEach((id) => {
          get().unlockAccomplishment(id);
        });
      }
      if (choice.outcomes.techBadges) {
        choice.outcomes.techBadges.forEach((id) => {
          get().unlockBadge(id);
        });
      }
      if (choice.outcomes.projects) {
        choice.outcomes.projects.forEach((id) => {
          get().unlockProject(id);
        });
      }
    }

    // Update state
    set((s) => ({
      currentNodeId: nextNodeId,
      visitedNodes: [...s.visitedNodes, nextNodeId],
      narrativeEnded: nextNode.isEnding || false,
      endingType: nextNode.endingType,
    }));
  },

  getCurrentNode: () => {
    const state = get();
    return state.narrativeNodes.find((n) => n.id === state.currentNodeId);
  },

  unlockAccomplishment: (id: string) => {
    set((state) => {
      const accomplishment = state.allAccomplishments.find((a) => a.id === id);
      if (!accomplishment) return state;

      const alreadyUnlocked = state.unlockedAccomplishments.find((a) => a.id === id);
      if (alreadyUnlocked) return state;

      return {
        unlockedAccomplishments: [
          ...state.unlockedAccomplishments,
          {
            ...accomplishment,
            isUnlocked: true,
            unlockedAt: new Date(),
          },
        ],
      };
    });
  },

  unlockBadge: (id: string) => {
    set((state) => {
      const badge = state.allBadges.find((b) => b.id === id);
      if (!badge) return state;

      const alreadyUnlocked = state.unlockedBadges.find((b) => b.id === id);
      if (alreadyUnlocked) return state;

      return {
        unlockedBadges: [
          ...state.unlockedBadges,
          {
            ...badge,
            isUnlocked: true,
            unlockedAt: new Date(),
          },
        ],
      };
    });
  },

  unlockProject: (id: string) => {
    set((state) => {
      const project = state.allProjects.find((p) => p.id === id);
      if (!project) return state;

      const alreadyUnlocked = state.unlockedProjects.find((p) => p.id === id);
      if (alreadyUnlocked) return state;

      return {
        unlockedProjects: [
          ...state.unlockedProjects,
          {
            ...project,
            isUnlocked: true,
            unlockedAt: new Date(),
          },
        ],
      };
    });
  },

  getUnlockedAccomplishments: () => {
    return get().unlockedAccomplishments;
  },

  getUnlockedBadges: () => {
    return get().unlockedBadges;
  },

  getUnlockedProjects: () => {
    return get().unlockedProjects;
  },

  resetNarrative: () => {
    set(initialState);
  },
}));
