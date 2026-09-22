import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserProfile, Project, Experience, SkillCategory, ContactMessage, InquiryReply, PublicPortfolioData } from '../src/types';

export interface StoredUser {
  id: string;
  username: string;
  name: string;
  email: string;
  passwordHash: string;
  token: string;
  profile: UserProfile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  messages: ContactMessage[];
}

interface DatabaseSchema {
  users: Record<string, StoredUser>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_salt_pm_system').digest('hex');
}

function generateToken(username: string): string {
  return `pms_${username}_${crypto.randomBytes(16).toString('hex')}`;
}

const INITIAL_USERS: Record<string, StoredUser> = {
  alexdev: {
    id: 'u-alexdev-001',
    username: 'alexdev',
    name: 'Alex Rivers',
    email: 'alex@rivers.dev',
    passwordHash: hashPassword('alex123'),
    token: 'pms_alexdev_token_demo_mode_secure',
    profile: {
      id: 'prof-alex-001',
      username: 'alexdev',
      name: 'Alex Rivers',
      email: 'alex@rivers.dev',
      headline: 'Senior Full-Stack Engineer & Distributed Systems Enthusiast',
      bio: 'Crafting resilient web applications, developer platforms, and high-throughput microservices. Over 7 years of building full-stack applications with TypeScript, Node.js, Go, and React. Passionate about craftsmanship, accessible UI, and sub-100ms API latencies.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      location: 'San Francisco, CA / Remote',
      status: 'Available for hire',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        website: 'https://alexrivers.dev',
        email: 'alex@rivers.dev'
      },
      resumeUrl: 'https://example.com/resume.pdf',
      accentColor: '#10b981', // emerald
      theme: 'dark',
      stats: {
        views: 1420,
        likes: 184,
        endorsements: 42
      },
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2026-03-10T14:30:00Z'
    },
    projects: [
      {
        id: 'p-001',
        username: 'alexdev',
        title: 'CloudMesh Telemetry Engine',
        slug: 'cloudmesh-telemetry',
        tagline: 'High-throughput distributed tracing & log analytics proxy with sub-millisecond overhead',
        description: 'Engineered a low-latency telemetry gateway in Go and TypeScript that ingests 50,000 req/sec OpenTelemetry spans. Features real-time anomaly detection, flamegraph generation, and websocket-streamed metrics dashboards.',
        liveUrl: 'https://cloudmesh-demo.example.com',
        githubUrl: 'https://github.com/alexrivers/cloudmesh-telemetry',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        tags: ['Go', 'TypeScript', 'OpenTelemetry', 'WebSockets', 'Tailwind CSS'],
        category: 'Systems',
        featured: true,
        order: 1,
        starsCount: 342,
        metrics: '50k RPS • 1.2ms p99',
        createdAt: '2025-06-12T10:00:00Z',
        updatedAt: '2026-01-20T12:00:00Z'
      },
      {
        id: 'p-002',
        username: 'alexdev',
        title: 'Nexus Data Platform',
        slug: 'nexus-data-platform',
        tagline: 'Collaborative query workbench and data catalog for distributed analytics teams',
        description: 'Built a collaborative SQL workspace supporting duckdb in-browser wasm execution, shared query version control, automated schema documentation, and visual execution plans.',
        liveUrl: 'https://nexus-query.example.com',
        githubUrl: 'https://github.com/alexrivers/nexus-query',
        imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
        tags: ['React', 'TypeScript', 'DuckDB WASM', 'Tailwind CSS', 'Node.js'],
        category: 'Full Stack',
        featured: true,
        order: 2,
        starsCount: 512,
        metrics: '12k active queries weekly',
        createdAt: '2025-02-18T10:00:00Z',
        updatedAt: '2026-02-01T09:30:00Z'
      },
      {
        id: 'p-003',
        username: 'alexdev',
        title: 'HyperDraft Markdown CMS',
        slug: 'hyperdraft-cms',
        tagline: 'Git-backed headless content engine with live split-screen preview and AST parsing',
        description: 'A headless developer-first documentation and blogging platform powered by markdown/MDX with custom component embeds, automated table of contents, and semantic search.',
        liveUrl: 'https://hyperdraft.example.com',
        githubUrl: 'https://github.com/alexrivers/hyperdraft',
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        tags: ['Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
        category: 'Open Source',
        featured: false,
        order: 3,
        starsCount: 189,
        metrics: '3.4k GitHub Stars',
        createdAt: '2024-11-05T15:20:00Z',
        updatedAt: '2025-10-14T11:00:00Z'
      },
      {
        id: 'p-004',
        username: 'alexdev',
        title: 'Vanguard API Gateway',
        slug: 'vanguard-gateway',
        tagline: 'Edge rate-limiting, JWT authentication, and request deduplication middleware',
        description: 'Zero-allocation reverse proxy with sliding window rate limiting, token revocation checking via Redis, and automatic mock endpoint synthesizers for integration test suites.',
        liveUrl: 'https://vanguard-proxy.example.com',
        githubUrl: 'https://github.com/alexrivers/vanguard-gateway',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        tags: ['Express', 'TypeScript', 'Redis', 'Docker'],
        category: 'Backend',
        featured: false,
        order: 4,
        starsCount: 95,
        metrics: 'Zero config rate limiter',
        createdAt: '2024-08-10T12:00:00Z',
        updatedAt: '2025-05-18T10:00:00Z'
      }
    ],
    experiences: [
      {
        id: 'exp-001',
        username: 'alexdev',
        company: 'Veloce Cloud Systems',
        role: 'Staff Infrastructure Engineer',
        location: 'San Francisco, CA (Hybrid)',
        startDate: '2023-04',
        endDate: '',
        isCurrent: true,
        description: 'Lead developer experience and backend microservices architecture. Spearheaded migration from monolithic services to event-driven pipelines, reducing API response times by 38% and lowering cloud expenditure by $120k annually.',
        technologies: ['TypeScript', 'Node.js', 'Go', 'Kubernetes', 'PostgreSQL', 'Kafka'],
        order: 1
      },
      {
        id: 'exp-002',
        username: 'alexdev',
        company: 'Synthetix Lab',
        role: 'Senior Full Stack Developer',
        location: 'New York, NY (Remote)',
        startDate: '2020-08',
        endDate: '2023-03',
        isCurrent: false,
        description: 'Architected and built real-time analytics dashboards, customer billing portals, and external developer APIs. Mentored 6 junior/mid engineers and established engineering standards.',
        technologies: ['React', 'Express', 'TypeScript', 'Redis', 'Docker', 'AWS'],
        order: 2
      },
      {
        id: 'exp-003',
        username: 'alexdev',
        company: 'Aether Software',
        role: 'Software Engineer',
        location: 'Austin, TX',
        startDate: '2018-06',
        endDate: '2020-07',
        isCurrent: false,
        description: 'Developed responsive client interfaces and RESTful web services. Built automated CI/CD test pipelines and reduced build cycle times by 45%.',
        technologies: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Jest'],
        order: 3
      }
    ],
    skills: [
      {
        category: 'Languages',
        skills: [
          { name: 'TypeScript', level: 'Expert', years: 6 },
          { name: 'JavaScript (ES6+)', level: 'Expert', years: 8 },
          { name: 'Go', level: 'Advanced', years: 4 },
          { name: 'SQL (PostgreSQL)', level: 'Advanced', years: 7 },
          { name: 'Python', level: 'Intermediate', years: 3 }
        ]
      },
      {
        category: 'Frontend & UI',
        skills: [
          { name: 'React 19 / Next.js', level: 'Expert', years: 7 },
          { name: 'Tailwind CSS', level: 'Expert', years: 5 },
          { name: 'State Management (Zustand, Redux)', level: 'Advanced', years: 6 },
          { name: 'Web Performance & Web Vitals', level: 'Advanced', years: 5 },
          { name: 'Motion / Animations', level: 'Intermediate', years: 3 }
        ]
      },
      {
        category: 'Backend & APIs',
        skills: [
          { name: 'Node.js / Express', level: 'Expert', years: 7 },
          { name: 'RESTful API Design', level: 'Expert', years: 7 },
          { name: 'GraphQL', level: 'Advanced', years: 4 },
          { name: 'Microservices & Event Streams', level: 'Advanced', years: 4 },
          { name: 'gRPC & Protocol Buffers', level: 'Intermediate', years: 2 }
        ]
      },
      {
        category: 'DevOps & Storage',
        skills: [
          { name: 'Docker & Containers', level: 'Advanced', years: 5 },
          { name: 'PostgreSQL & Drizzle/Prisma', level: 'Advanced', years: 6 },
          { name: 'Redis Cache & Pub/Sub', level: 'Advanced', years: 5 },
          { name: 'CI/CD (GitHub Actions)', level: 'Advanced', years: 5 },
          { name: 'AWS & Cloud Deployment', level: 'Intermediate', years: 4 }
        ]
      }
    ],
    messages: [
      {
        id: 'msg-001',
        recipientUsername: 'alexdev',
        senderName: 'Elena Rostova',
        senderEmail: 'elena@techrecruiting.io',
        subject: 'Staff Engineer Opportunity at ApexScale',
        message: 'Hi Alex, I came across your CloudMesh project and was very impressed with your distributed systems work. Would you have 15 minutes this week for a brief introductory chat?',
        createdAt: '2026-03-08T10:15:00Z',
        read: true
      },
      {
        id: 'msg-002',
        recipientUsername: 'alexdev',
        senderName: 'Marcus Vance',
        senderEmail: 'marcus@hypergrowth.vc',
        subject: 'Consulting regarding API Architecture',
        message: 'Loved your writeup on zero-allocation rate limiters. We have a portfolio company looking for architectural review on their edge routing layer. Let me know if you do advisory work!',
        createdAt: '2026-03-15T16:40:00Z',
        read: false
      }
    ]
  },
  sarahcodes: {
    id: 'u-sarah-002',
    username: 'sarahcodes',
    name: 'Sarah Chen',
    email: 'sarah@chen.tech',
    passwordHash: hashPassword('sarah123'),
    token: 'pms_sarahcodes_token_demo_mode_secure',
    profile: {
      id: 'prof-sarah-002',
      username: 'sarahcodes',
      name: 'Sarah Chen',
      email: 'sarah@chen.tech',
      headline: 'Cloud Architect & Platform Engineer',
      bio: 'Designing fault-tolerant infrastructure, Kubernetes native platforms, and high-security cloud services. Speaker at KubeCon and maintainer of open source developer tools.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      location: 'Seattle, WA',
      status: 'Open to collaborate',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://x.com',
        website: 'https://sarahchen.tech'
      },
      resumeUrl: '',
      accentColor: '#3b82f6', // blue
      theme: 'dark',
      stats: {
        views: 980,
        likes: 126,
        endorsements: 38
      },
      createdAt: '2024-03-10T09:00:00Z',
      updatedAt: '2026-02-28T18:00:00Z'
    },
    projects: [
      {
        id: 'p-sarah-001',
        username: 'sarahcodes',
        title: 'KubeSentry Policy Guard',
        slug: 'kubesentry-policy-guard',
        tagline: 'Real-time admission controller and compliance validator for Kubernetes clusters',
        description: 'Enforces security policies, non-root container constraints, and ephemeral storage limits across multi-tenant clusters with zero latency penalties.',
        liveUrl: 'https://kubesentry.io',
        githubUrl: 'https://github.com/sarahchen/kubesentry',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
        tags: ['Go', 'Kubernetes', 'Helm', 'Terraform', 'Prometheus'],
        category: 'Systems',
        featured: true,
        order: 1,
        starsCount: 840,
        metrics: 'Deployed in 140+ clusters',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2026-01-15T12:00:00Z'
      },
      {
        id: 'p-sarah-002',
        username: 'sarahcodes',
        title: 'TerraState Visualizer',
        slug: 'terrastate-visualizer',
        tagline: 'Interactive dependency graph explorer for multi-tier Terraform plans',
        description: 'Parses terraform plan json to produce interactive visual DAG charts, estimating blast radius and cloud billing differentials prior to apply.',
        liveUrl: 'https://terrastate.dev',
        githubUrl: 'https://github.com/sarahchen/terrastate',
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        tags: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS'],
        category: 'Frontend',
        featured: true,
        order: 2,
        starsCount: 410,
        metrics: '20k monthly users',
        createdAt: '2024-09-12T14:00:00Z',
        updatedAt: '2025-11-20T10:00:00Z'
      }
    ],
    experiences: [
      {
        id: 'exp-s-001',
        username: 'sarahcodes',
        company: 'Nordic Cloud Dynamics',
        role: 'Lead Cloud Infrastructure Architect',
        location: 'Seattle, WA',
        startDate: '2022-01',
        endDate: '',
        isCurrent: true,
        description: 'Orchestrated migration of 400+ services across AWS and GCP. Implemented GitOps using ArgoCD and automated zero-downtime canary deployments.',
        technologies: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'ArgoCD', 'Go'],
        order: 1
      }
    ],
    skills: [
      {
        category: 'Cloud & Infrastructure',
        skills: [
          { name: 'Kubernetes & Helm', level: 'Expert', years: 6 },
          { name: 'Terraform & OpenTofu', level: 'Expert', years: 5 },
          { name: 'AWS & Google Cloud', level: 'Expert', years: 6 },
          { name: 'Go / Golang', level: 'Advanced', years: 5 }
        ]
      }
    ],
    messages: []
  },
  johndoe: {
    id: 'u-john-003',
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@doe.design',
    passwordHash: hashPassword('john123'),
    token: 'pms_johndoe_token_demo_mode_secure',
    profile: {
      id: 'prof-john-003',
      username: 'johndoe',
      name: 'John Doe',
      email: 'john@doe.design',
      headline: 'Creative Technologist & UI Design Engineer',
      bio: 'Blending mathematical precision with interactive graphics. Specializing in design systems, micro-interactions, responsive web performance, and developer tools.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      location: 'London, UK / Remote',
      status: 'Building in public',
      socials: {
        github: 'https://github.com',
        twitter: 'https://x.com',
        website: 'https://johndoe.design',
        email: 'john@doe.design'
      },
      resumeUrl: '',
      accentColor: '#f59e0b', // amber
      theme: 'dark',
      stats: {
        views: 750,
        likes: 92,
        endorsements: 24
      },
      createdAt: '2024-05-01T12:00:00Z',
      updatedAt: '2026-03-01T11:00:00Z'
    },
    projects: [
      {
        id: 'p-john-001',
        username: 'johndoe',
        title: 'Prism Design Token Studio',
        slug: 'prism-tokens',
        tagline: 'Generate, test and export multi-brand design tokens to Tailwind, CSS vars, and iOS/Android',
        description: 'Engineered an accessible token manager with WCAG 2.2 APCA contrast calculation, fluid font scale generators, and live preview components.',
        liveUrl: 'https://prismtokens.dev',
        githubUrl: 'https://github.com/johndoe/prism-tokens',
        imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Figma API'],
        category: 'Frontend',
        featured: true,
        order: 1,
        starsCount: 620,
        metrics: '15k monthly installs',
        createdAt: '2025-03-01T10:00:00Z',
        updatedAt: '2026-02-14T10:00:00Z'
      }
    ],
    experiences: [
      {
        id: 'exp-j-001',
        username: 'johndoe',
        company: 'Linear Studio',
        role: 'Senior Design Engineer',
        location: 'London / Remote',
        startDate: '2023-03',
        endDate: '',
        isCurrent: true,
        description: 'Creating high-fidelity UI component systems, animations, and design primitives for high-growth tech startups.',
        technologies: ['React', 'TypeScript', 'CSS/Tailwind', 'Motion', 'WebGL'],
        order: 1
      }
    ],
    skills: [
      {
        category: 'Design Engineering',
        skills: [
          { name: 'React & TypeScript', level: 'Expert', years: 6 },
          { name: 'Tailwind CSS', level: 'Expert', years: 5 },
          { name: 'Design Systems', level: 'Expert', years: 6 },
          { name: 'Interaction Design', level: 'Advanced', years: 5 }
        ]
      }
    ],
    messages: []
  }
};

class Database {
  private data: DatabaseSchema = { users: {} };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
        // Ensure default seeded users exist if empty
        if (!this.data.users || Object.keys(this.data.users).length === 0) {
          this.data.users = JSON.parse(JSON.stringify(INITIAL_USERS));
          this.persist();
        }
      } else {
        this.data = { users: JSON.parse(JSON.stringify(INITIAL_USERS)) };
        this.persist();
      }
    } catch (err) {
      console.error('Error initializing database, using in-memory fallback:', err);
      this.data = { users: JSON.parse(JSON.stringify(INITIAL_USERS)) };
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // User & Auth
  public getUserByUsername(username: string): StoredUser | null {
    const key = username.toLowerCase().trim();
    return this.data.users[key] || null;
  }

  public getUserByToken(token: string): StoredUser | null {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    for (const u of Object.values(this.data.users)) {
      if (u.token === cleanToken) return u;
    }
    return null;
  }

  public authenticate(usernameOrEmail: string, password: string):StoredUser | null {
    const query = usernameOrEmail.toLowerCase().trim();
    const hash = hashPassword(password);

    for (const u of Object.values(this.data.users)) {
      if ((u.username.toLowerCase() === query || u.email.toLowerCase() === query) && u.passwordHash === hash) {
        // Refresh token if needed
        if (!u.token) {
          u.token = generateToken(u.username);
          this.persist();
        }
        return u;
      }
    }
    return null;
  }

  public register(username: string, name: string, email: string, password: string): StoredUser {
    const key = username.toLowerCase().trim();
    if (this.data.users[key]) {
      throw new Error(`Username @${username} is already taken.`);
    }

    // Check email uniqueness
    for (const u of Object.values(this.data.users)) {
      if (u.email.toLowerCase() === email.toLowerCase().trim()) {
        throw new Error('An account with this email already exists.');
      }
    }

    const token = generateToken(key);
    const now = new Date().toISOString();
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      username: key,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      token,
      profile: {
        id: `prof-${Date.now()}`,
        username: key,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        headline: 'Software Developer',
        bio: `Hello, I'm ${name}! Full-stack developer passionate about building remarkable web applications and user experiences.`,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(key)}`,
        location: 'Earth / Remote',
        status: 'Available for hire',
        socials: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          email: email.trim()
        },
        resumeUrl: '',
        accentColor: '#10b981',
        theme: 'dark',
        stats: {
          views: 1,
          likes: 0,
          endorsements: 0
        },
        createdAt: now,
        updatedAt: now
      },
      projects: [
        {
          id: `p-${Date.now()}-1`,
          username: key,
          title: 'My Flagship Web Project',
          slug: 'my-flagship-project',
          tagline: 'An intuitive full-stack web application with responsive UI and real-time APIs',
          description: 'Designed and implemented end-to-end full stack solution showcasing robust data validation, REST APIs, and clean UX.',
          liveUrl: 'https://example.com',
          githubUrl: 'https://github.com',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
          category: 'Full Stack',
          featured: true,
          order: 1,
          starsCount: 12,
          metrics: 'First Release Live',
          createdAt: now,
          updatedAt: now
        }
      ],
      experiences: [
        {
          id: `exp-${Date.now()}-1`,
          username: key,
          company: 'Tech Solutions Inc',
          role: 'Full Stack Developer',
          location: 'Remote',
          startDate: '2024-01',
          endDate: '',
          isCurrent: true,
          description: 'Building modern web applications and scalable APIs.',
          technologies: ['TypeScript', 'React', 'Node.js'],
          order: 1
        }
      ],
      skills: [
        {
          category: 'Core Technologies',
          skills: [
            { name: 'TypeScript', level: 'Advanced', years: 2 },
            { name: 'React', level: 'Advanced', years: 3 },
            { name: 'Node.js', level: 'Intermediate', years: 2 },
            { name: 'REST APIs', level: 'Advanced', years: 3 }
          ]
        }
      ],
      messages: []
    };

    this.data.users[key] = newUser;
    this.persist();
    return newUser;
  }

  // Public Portfolio View data (censors private fields like passwords, internal messages, tokens)
  public getPublicPortfolio(username: string): PublicPortfolioData | null {
    const user = this.getUserByUsername(username);
    if (!user) return null;

    // Increment view count
    user.profile.stats.views += 1;
    this.persist();

    return {
      profile: {
        ...user.profile,
        // sanitize: don't leak token or passwordHash
      },
      projects: [...user.projects].sort((a, b) => a.order - b.order),
      experiences: [...user.experiences].sort((a, b) => a.order - b.order),
      skills: user.skills || [],
      totalProjects: user.projects.length
    };
  }

  public getAllPortfolios(search?: string, tag?: string) {
    let list = Object.values(this.data.users).map(u => ({
      username: u.username,
      name: u.name,
      headline: u.profile.headline,
      bio: u.profile.bio,
      avatarUrl: u.profile.avatarUrl,
      location: u.profile.location,
      status: u.profile.status,
      accentColor: u.profile.accentColor,
      stats: u.profile.stats,
      topSkills: (u.skills || []).flatMap(g => g.skills.map(s => s.name)).slice(0, 5),
      projectCount: u.projects.length,
      featuredProject: u.projects.find(p => p.featured) || u.projects[0] || null
    }));

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.topSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (tag) {
      const t = tag.toLowerCase().trim();
      list = list.filter(p => p.topSkills.some(s => s.toLowerCase() === t));
    }

    return list;
  }

  // Profile Updates
  public updateProfile(username: string, updates: Partial<UserProfile>): UserProfile {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    user.profile = {
      ...user.profile,
      ...updates,
      username: user.username, // keep username immutable here
      updatedAt: new Date().toISOString()
    };
    if (updates.name) {
      user.name = updates.name;
    }
    this.persist();
    return user.profile;
  }

  // Projects CRUD
  public addProject(username: string, projectData: Omit<Project, 'id' | 'username' | 'createdAt' | 'updatedAt' | 'order'>): Project {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: user.username,
      order: user.projects.length + 1,
      createdAt: now,
      updatedAt: now
    };

    user.projects.push(newProject);
    this.persist();
    return newProject;
  }

  public updateProject(username: string, projectId: string, updates: Partial<Project>): Project {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const index = user.projects.findIndex(p => p.id === projectId);
    if (index === -1) throw new Error('Project not found');

    user.projects[index] = {
      ...user.projects[index],
      ...updates,
      id: projectId,
      username: user.username,
      updatedAt: new Date().toISOString()
    };

    this.persist();
    return user.projects[index];
  }

  public deleteProject(username: string, projectId: string): boolean {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const beforeLen = user.projects.length;
    user.projects = user.projects.filter(p => p.id !== projectId);
    if (user.projects.length !== beforeLen) {
      // Re-order remaining projects
      user.projects.forEach((p, idx) => {
        p.order = idx + 1;
      });
      this.persist();
      return true;
    }
    return false;
  }

  public reorderProjects(username: string, orderedIds: string[]): Project[] {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const idToProject = new Map(user.projects.map(p => [p.id, p]));
    const newProjects: Project[] = [];

    orderedIds.forEach((id, idx) => {
      const proj = idToProject.get(id);
      if (proj) {
        proj.order = idx + 1;
        newProjects.push(proj);
        idToProject.delete(id);
      }
    });

    // Append any not explicitly in orderedIds
    for (const remaining of idToProject.values()) {
      remaining.order = newProjects.length + 1;
      newProjects.push(remaining);
    }

    user.projects = newProjects;
    this.persist();
    return user.projects;
  }

  // Experiences CRUD
  public addExperience(username: string, expData: Omit<Experience, 'id' | 'username' | 'order'>): Experience {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const newExp: Experience = {
      ...expData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      username: user.username,
      order: user.experiences.length + 1
    };

    user.experiences.push(newExp);
    this.persist();
    return newExp;
  }

  public updateExperience(username: string, expId: string, updates: Partial<Experience>): Experience {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const index = user.experiences.findIndex(e => e.id === expId);
    if (index === -1) throw new Error('Experience not found');

    user.experiences[index] = {
      ...user.experiences[index],
      ...updates,
      id: expId,
      username: user.username
    };

    this.persist();
    return user.experiences[index];
  }

  public deleteExperience(username: string, expId: string): boolean {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const beforeLen = user.experiences.length;
    user.experiences = user.experiences.filter(e => e.id !== expId);
    if (user.experiences.length !== beforeLen) {
      user.experiences.forEach((e, idx) => {
        e.order = idx + 1;
      });
      this.persist();
      return true;
    }
    return false;
  }

  // Skills
  public updateSkills(username: string, skills: SkillCategory[]): SkillCategory[] {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    user.skills = skills;
    this.persist();
    return user.skills;
  }

  // Likes & Endorsements
  public likePortfolio(username: string, projectId?: string): { likes: number; projectStars?: number } {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    user.profile.stats.likes += 1;
    let projectStars: number | undefined;

    if (projectId) {
      const proj = user.projects.find(p => p.id === projectId);
      if (proj) {
        proj.starsCount = (proj.starsCount || 0) + 1;
        projectStars = proj.starsCount;
      }
    }

    this.persist();
    return {
      likes: user.profile.stats.likes,
      projectStars
    };
  }

  // Contact Messages
  public addContactMessage(username: string, msg: Omit<ContactMessage, 'id' | 'recipientUsername' | 'createdAt' | 'read'>): ContactMessage {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipientUsername: user.username,
      createdAt: new Date().toISOString(),
      read: false
    };

    if (!user.messages) user.messages = [];
    user.messages.unshift(newMsg);
    this.persist();
    return newMsg;
  }

  public getMessages(username: string): ContactMessage[] {
    const user = this.getUserByUsername(username);
    if (!user) throw new Error('User not found');
    return user.messages || [];
  }

  public markMessageRead(username: string, messageId: string): boolean {
    const user = this.getUserByUsername(username);
    if (!user || !user.messages) return false;

    const msg = user.messages.find(m => m.id === messageId);
    if (msg) {
      msg.read = true;
      this.persist();
      return true;
    }
    return false;
  }

  public toggleMessageRead(username: string, messageId: string, forceRead?: boolean): boolean {
    const user = this.getUserByUsername(username);
    if (!user || !user.messages) return false;

    const msg = user.messages.find(m => m.id === messageId);
    if (msg) {
      msg.read = forceRead !== undefined ? forceRead : !msg.read;
      this.persist();
      return true;
    }
    return false;
  }

  public addReplyToMessage(
    username: string, 
    messageId: string, 
    reply: { replyMessage: string; senderName?: string; senderEmail?: string }
  ): ContactMessage {
    const user = this.getUserByUsername(username);
    if (!user || !user.messages) throw new Error('User or inquiries not found');

    const msg = user.messages.find(m => m.id === messageId);
    if (!msg) throw new Error('Inquiry message not found');

    const newReply: InquiryReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: reply.senderName || user.name || 'Maaz Nadeem',
      senderEmail: reply.senderEmail || user.email || 'maazawan2468@gmail.com',
      replyMessage: reply.replyMessage.trim(),
      createdAt: new Date().toISOString()
    };

    if (!msg.replies) msg.replies = [];
    msg.replies.push(newReply);
    msg.replied = true;
    msg.repliedAt = newReply.createdAt;
    msg.read = true; // Replying automatically marks inquiry as read

    this.persist();
    return msg;
  }

  public deleteMessage(username: string, messageId: string): boolean {
    const user = this.getUserByUsername(username);
    if (!user || !user.messages) return false;

    const initialLen = user.messages.length;
    user.messages = user.messages.filter(m => m.id !== messageId);
    if (user.messages.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }
}

export const db = new Database();
