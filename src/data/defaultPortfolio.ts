import { UserProfile, Project, Experience, SkillCategory } from '../types';

export const MAAZ_PROFILE: UserProfile = {
  id: 'prof-maaz-001',
  username: 'Maazawan982',
  name: 'Maaz Nadeem',
  email: 'maazawan2468@gmail.com',
  headline: 'Full-Stack Developer & AI Enthusiast',
  bio: 'Full-stack enthusiast with 1 year of hands-on experience building modern, responsive web applications and AI-integrated systems. Final-year BS Computer Science student at University of Wah, certified by Google (Full Stack), Saylor Academy (98% in ML), and Anthropic (MCP & Cloud AI).',
  avatarUrl: '/avatar.png',
  location: 'Rawalpindi, Pakistan',
  status: 'Available for hire',
  socials: {
    github: 'https://github.com/Maazawan982',
    linkedin: 'https://www.linkedin.com/in/maaz-nadeem-56428030a',
    email: 'maazawan2468@gmail.com'
  },
  accentColor: '#10b981',
  theme: 'dark',
  stats: {
    views: 380,
    likes: 24,
    endorsements: 11
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2026-09-22T00:00:00.000Z'
};

export const MAAZ_PROJECTS: Project[] = [
  {
    id: 'proj-realtime-analytics',
    username: 'Maazawan982',
    title: 'Realtime E-commerce Analytics',
    slug: 'realtime-ecommerce-analytics',
    tagline: 'Live analytics dashboard with event streaming and revenue metrics.',
    description: 'High-performance analytics platform for e-commerce metrics, featuring real-time visitor activity monitoring, sales conversion funnels, and dynamic visual charts.',
    githubUrl: 'https://github.com/Maazawan982/realtime-ecommerce-analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Node.js', 'WebSockets', 'Analytics', 'Tailwind CSS'],
    category: 'Full Stack',
    featured: true,
    order: 1,
    starsCount: 18,
    createdAt: '2025-04-10T00:00:00.000Z',
    updatedAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'proj-secure-vision',
    username: 'Maazawan982',
    title: 'Secure-Vision',
    slug: 'Secure-Vision',
    tagline: 'Intelligent computer vision and security surveillance system.',
    description: 'Computer vision security application utilizing AI models for automated anomaly detection, object recognition, and stream monitoring.',
    githubUrl: 'https://github.com/Maazawan982/Secure-Vision',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    tags: ['Python', 'Computer Vision', 'AI / ML', 'OpenCV', 'Security'],
    category: 'AI / ML',
    featured: true,
    order: 2,
    starsCount: 15,
    createdAt: '2025-05-12T00:00:00.000Z',
    updatedAt: '2026-07-20T00:00:00.000Z'
  },
  {
    id: 'proj-femora-ai',
    username: 'Maazawan982',
    title: 'Femora-ai',
    slug: 'Femora-ai',
    tagline: 'AI-driven health and wellness intelligent assistant.',
    description: 'Personalized AI assistant designed for health insights, wellness tracking, and intelligent conversational support using modern LLM APIs.',
    githubUrl: 'https://github.com/Maazawan982/Femora-ai',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    tags: ['OpenAI API', 'React', 'Node.js', 'AI / ML', 'Healthcare'],
    category: 'AI / ML',
    featured: true,
    order: 3,
    starsCount: 22,
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z'
  },
  {
    id: 'proj-serverless-portfolio',
    username: 'Maazawan982',
    title: 'Serverless Portfolio',
    slug: 'serverless-portfolio',
    tagline: 'Scalable developer portfolio built with serverless deployment pipeline.',
    description: 'Ultra-fast, responsive web application showcasing developer profile, dynamic project cards, and modern serverless execution.',
    githubUrl: 'https://github.com/Maazawan982/serverless-portfolio',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Serverless', 'React', 'TypeScript', 'Tailwind CSS'],
    category: 'Full Stack',
    featured: true,
    order: 4,
    starsCount: 14,
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'proj-namaz-timing',
    username: 'Maazawan982',
    title: 'Namaz Timing App',
    slug: 'namaz-timing-app',
    tagline: 'Accurate prayer times calculator with geolocation and reminders.',
    description: 'Utility application providing precise Islamic prayer times based on astronomical coordinates, Qibla direction, and adhan reminders.',
    githubUrl: 'https://github.com/Maazawan982/namaz-timing-app',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    tags: ['JavaScript', 'Geolocation API', 'CSS3', 'PWA'],
    category: 'Frontend',
    featured: false,
    order: 5,
    starsCount: 12,
    createdAt: '2025-03-20T00:00:00.000Z',
    updatedAt: '2026-05-18T00:00:00.000Z'
  },
  {
    id: 'proj-smart-recipe',
    username: 'Maazawan982',
    title: 'Smart-Recipe-Finder',
    slug: 'Smart-Recipe-Finder',
    tagline: 'Intelligent recipe discovery based on available pantry ingredients.',
    description: 'Smart kitchen assistant that suggests delicious recipes, nutritional facts, and step-by-step guides using available home ingredients.',
    githubUrl: 'https://github.com/Maazawan982/Smart-Recipe-Finder',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Recipe API', 'Tailwind CSS', 'State Management'],
    category: 'Full Stack',
    featured: false,
    order: 6,
    starsCount: 11,
    createdAt: '2025-04-05T00:00:00.000Z',
    updatedAt: '2026-06-25T00:00:00.000Z'
  },
  {
    id: 'proj-little-ecommerce',
    username: 'Maazawan982',
    title: 'Little E-commerce Store',
    slug: 'little-ecommerce-store',
    tagline: 'E-commerce platform with product catalogs and checkout experience.',
    description: 'Full-stack storefront application featuring responsive product grid, multi-item cart management, price filtering, and checkout handling.',
    githubUrl: 'https://github.com/Maazawan982/little-ecommerce-store',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'JavaScript', 'E-commerce', 'Cart State'],
    category: 'Frontend',
    featured: false,
    order: 7,
    starsCount: 9,
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2025-08-14T00:00:00.000Z'
  },
  {
    id: 'proj-task-management',
    username: 'Maazawan982',
    title: 'Task Management',
    slug: 'task_management',
    tagline: 'Organized productivity suite for daily workflow tracking.',
    description: 'Clean task organizer supporting board columns, deadline alerts, priority tags, and persistent browser storage.',
    githubUrl: 'https://github.com/Maazawan982/task_management',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'TypeScript', 'Productivity', 'LocalStorage'],
    category: 'Frontend',
    featured: false,
    order: 8,
    starsCount: 10,
    createdAt: '2025-03-10T00:00:00.000Z',
    updatedAt: '2025-09-02T00:00:00.000Z'
  },
  {
    id: 'proj-devspace',
    username: 'Maazawan982',
    title: 'DevSpace',
    slug: 'DevSpace',
    tagline: 'Collaborative community space and code sharing platform for developers.',
    description: 'Community platform where developers can publish technical articles, discuss project architectures, and share snippets.',
    githubUrl: 'https://github.com/Maazawan982/DevSpace',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tags: ['Node.js', 'Express', 'React', 'MongoDB', 'REST API'],
    category: 'Full Stack',
    featured: false,
    order: 9,
    starsCount: 16,
    createdAt: '2025-05-20T00:00:00.000Z',
    updatedAt: '2026-04-12T00:00:00.000Z'
  },
  {
    id: 'proj-cineverse',
    username: 'Maazawan982',
    title: 'Cineverse 3D',
    slug: 'cineverse-3d-',
    tagline: '3D cinema and movie exploration experience.',
    description: 'Interactive entertainment web application with 3D elements, movie showcases, ratings, and genre filtering.',
    githubUrl: 'https://github.com/Maazawan982/cineverse-3d-',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    tags: ['Three.js', 'JavaScript', 'Movie API', '3D Graphics'],
    category: 'Frontend',
    featured: false,
    order: 10,
    starsCount: 14,
    createdAt: '2025-07-02T00:00:00.000Z',
    updatedAt: '2026-02-18T00:00:00.000Z'
  },
  {
    id: 'proj-guess-name',
    username: 'Maazawan982',
    title: 'Guess the Name Game',
    slug: 'Guess-the-Name-Game',
    tagline: 'Engaging interactive trivia game with real-time scoring.',
    description: 'Responsive web game testing player intuition with randomized name quizzes, difficulty levels, and streak scoreboards.',
    githubUrl: 'https://github.com/Maazawan982/Guess-the-Name-Game',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    tags: ['JavaScript', 'HTML5 Canvas', 'CSS Animations'],
    category: 'Frontend',
    featured: false,
    order: 11,
    starsCount: 8,
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2025-06-10T00:00:00.000Z'
  }
];

export const MAAZ_EXPERIENCES: Experience[] = [
  {
    id: 'exp-fullstack-dev',
    username: 'Maazawan982',
    company: 'Full-Stack Web Development',
    role: 'Full-Stack Developer',
    location: 'Rawalpindi, Pakistan',
    startDate: '2025',
    endDate: 'Present',
    isCurrent: true,
    description: '1 year of dedicated experience building, designing, and deploying full-stack web applications, real-time analytics dashboards, computer vision integrations, and AI-enabled tools using React, Node.js, and modern cloud deployment pipelines.',
    technologies: ['React', 'JavaScript', 'Node.js', 'Express', 'Tailwind CSS', 'Git & GitHub', 'REST APIs'],
    order: 1
  },
  {
    id: 'exp-university-wah',
    username: 'Maazawan982',
    company: 'University of Wah',
    role: 'BS in Computer Science (Final Year)',
    location: 'Wah Cantt / Rawalpindi',
    startDate: '2023',
    endDate: 'Present',
    isCurrent: true,
    description: 'Final year undergraduate student in BS Computer Science. Focusing on Software Engineering, Web Systems, Database Design, Algorithm Analysis, and Artificial Intelligence.',
    technologies: ['Computer Science', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
    order: 2
  }
];

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: 'Full Stack' | 'AI & LLMs' | 'Machine Learning' | 'Cloud & Agents';
  issueDate: string;
  credentialId?: string;
  grade?: string;
  badgeColor: string;
  description: string;
  skills: string[];
  image: string;
  featured?: boolean;
}

export const MAAZ_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-google-fullstack',
    title: 'Full Stack Developer',
    issuer: 'Google',
    category: 'Full Stack',
    issueDate: 'August 4, 2026',
    credentialId: 'GGO-2026-804-FT9876',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    description: 'Comprehensive program covering the fundamentals of front-end and back-end web development, database architecture, RESTful APIs, and cloud deployment.',
    skills: ['Front-End', 'Back-End', 'Databases', 'APIs', 'Cloud Deployment'],
    image: '/certs/google-fullstack.svg',
    featured: true
  },
  {
    id: 'cert-saylor-ml',
    title: 'CS207: Fundamentals of Machine Learning',
    issuer: 'Saylor Academy',
    category: 'Machine Learning',
    issueDate: 'July 24, 2026',
    credentialId: '0561328759MN',
    grade: '98.00% (IACET Accredited)',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    description: '19-hour university-level curriculum in machine learning theory, supervised & unsupervised algorithms, statistical modeling, and predictive evaluation. Completed with a 98.00% score.',
    skills: ['Machine Learning', 'Statistical Modeling', 'Supervised Learning', 'Model Evaluation'],
    image: '/certs/saylor-ml.svg',
    featured: true
  },
  {
    id: 'cert-anthropic-mcp-adv',
    title: 'Model Context Protocol: Advanced Topics',
    issuer: 'Anthropic',
    category: 'AI & LLMs',
    issueDate: 'July 2026',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Advanced architecture with Anthropic open-standard Model Context Protocol (MCP) to seamlessly connect LLMs to live data sources, tool ecosystems, and context servers.',
    skills: ['Model Context Protocol (MCP)', 'Agent Architectures', 'Tool Integration', 'Claude'],
    image: '/certs/anthropic-mcp-adv.svg',
    featured: true
  },
  {
    id: 'cert-anthropic-vertex',
    title: 'Claude with Google Vertex AI',
    issuer: 'Anthropic',
    category: 'Cloud & Agents',
    issueDate: 'July 2026',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Deploying and managing enterprise Anthropic Claude models on Google Cloud Vertex AI infrastructure for scalable, reliable AI solutions.',
    skills: ['Google Vertex AI', 'Claude Models', 'Cloud Infrastructure', 'Enterprise AI'],
    image: '/certs/anthropic-vertex.svg',
    featured: true
  },
  {
    id: 'cert-greatlearning-agents',
    title: 'Building Intelligent AI Agents',
    issuer: 'Great Learning',
    category: 'Cloud & Agents',
    issueDate: 'July 22, 2026',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    description: 'Practical implementation of autonomous AI agents, multi-step reasoning loops, prompt chaining, external tool utilization, and memory management.',
    skills: ['Autonomous Agents', 'Reasoning Loops', 'Memory Systems', 'Agentic Workflows'],
    image: '/certs/great-learning-agents.svg',
    featured: true
  },
  {
    id: 'cert-anthropic-bedrock',
    title: 'Claude with Amazon Bedrock',
    issuer: 'Anthropic',
    category: 'Cloud & Agents',
    issueDate: 'July 2026',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    description: 'Cloud integration and secure enterprise orchestration connecting Claude foundation models with Amazon Web Services (AWS) Bedrock platform.',
    skills: ['AWS Amazon Bedrock', 'Cloud Integration', 'LLM Deployment', 'API Security'],
    image: '/certs/anthropic-bedrock.svg',
    featured: true
  },
  {
    id: 'cert-anthropic-claude-code',
    title: 'Claude Code in Action & 101',
    issuer: 'Anthropic',
    category: 'AI & LLMs',
    issueDate: 'July 2026',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    description: 'Mastery of agentic command-line software development using Claude Code for automated refactoring, code generation, and terminal workflows.',
    skills: ['Claude Code CLI', 'Agentic Coding', 'Automated Refactoring', 'Dev Productivity'],
    image: '/certs/anthropic-claude-code.svg',
    featured: false
  },
  {
    id: 'cert-simplilearn-genai',
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud / Simplilearn',
    category: 'AI & LLMs',
    issueDate: 'July 30, 2026',
    credentialId: '10534240',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    description: 'Powered by Google Cloud. Foundations of Generative AI, transformer architectures, LLM prompting techniques, and responsible AI implementation.',
    skills: ['Generative AI', 'Transformers', 'Google Cloud AI', 'Responsible AI'],
    image: '/certs/simplilearn-genai.svg',
    featured: false
  },
  {
    id: 'cert-anthropic-api',
    title: 'Claude with the Anthropic API',
    issuer: 'Anthropic',
    category: 'AI & LLMs',
    issueDate: 'July 2026',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Programmatic development with Claude REST APIs, token optimization, streaming completions, system prompts, and structured JSON output generation.',
    skills: ['Anthropic API', 'Streaming Responses', 'Structured Output', 'Prompt Engineering'],
    image: '/certs/anthropic-api.svg',
    featured: false
  },
  {
    id: 'cert-tata-genai-analytics',
    title: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata / Forage',
    category: 'Full Stack',
    issueDate: 'July 31, 2026',
    credentialId: '6a6cdf171ebe2d46f8ad54be',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    description: 'Completed enterprise simulations in exploratory data analysis, risk profiling, predictive delinquency modeling with AI, and data storytelling.',
    skills: ['Data Analytics', 'Predictive Modeling', 'Risk Profiling', 'Data Storytelling'],
    image: '/certs/tata-genai-analytics.svg',
    featured: false
  },
  {
    id: 'cert-hp-ai-beginners',
    title: 'AI for Beginners & Business Professionals',
    issuer: 'HP LIFE / HP Foundation',
    category: 'AI & LLMs',
    issueDate: 'July 22, 2026',
    credentialId: 'b8b670cd-7bc2-40df-b4bd-f04751aacedf',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    description: 'Completed HP Foundation certification in AI concepts, business integration, ethical guidelines, and effective prompting.',
    skills: ['AI Foundations', 'Prompt Crafting', 'Business AI', 'Ethics in AI'],
    image: '/certs/hp-ai-beginners.svg',
    featured: false
  }
];

export const MAAZ_SKILLS: SkillCategory[] = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'React', level: 'Advanced', years: 1 },
      { name: 'JavaScript (ES6+)', level: 'Advanced', years: 1 },
      { name: 'TypeScript', level: 'Intermediate', years: 1 },
      { name: 'Tailwind CSS', level: 'Advanced', years: 1 },
      { name: 'HTML5 & Responsive CSS', level: 'Expert', years: 1 }
    ]
  },
  {
    category: 'Backend & APIs',
    skills: [
      { name: 'Node.js', level: 'Advanced', years: 1 },
      { name: 'Express.js', level: 'Advanced', years: 1 },
      { name: 'RESTful API Design', level: 'Advanced', years: 1 },
      { name: 'Serverless Architecture', level: 'Intermediate', years: 1 },
      { name: 'WebSockets', level: 'Intermediate', years: 1 }
    ]
  },
  {
    category: 'AI & Generative Tools',
    skills: [
      { name: 'OpenAI API', level: 'Advanced', years: 1 },
      { name: 'Claude / Anthropic API', level: 'Advanced', years: 1 },
      { name: 'Google AI Tools', level: 'Advanced', years: 1 },
      { name: 'Prompt Engineering', level: 'Advanced', years: 1 },
      { name: 'Computer Vision Basics', level: 'Intermediate', years: 1 }
    ]
  },
  {
    category: 'Databases & Developer Tools',
    skills: [
      { name: 'MongoDB', level: 'Intermediate', years: 1 },
      { name: 'Git & GitHub', level: 'Advanced', years: 1 },
      { name: 'Postman', level: 'Advanced', years: 1 },
      { name: 'VS Code & Dev Tools', level: 'Expert', years: 1 }
    ]
  }
];
