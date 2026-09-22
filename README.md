# Portfolio Management System

A high-performance, full-stack Developer Portfolio & Management Engine built with React 19, TypeScript, Tailwind CSS, Express, and Vite. Features verified credential showcase, repository explorer, live profile customization studio, and a dedicated **Admin Mode** for managing and responding to recruiter inquiries.

---

## 🌟 Key Features

### 1. Interactive Developer Showcase
- **Terminal-Inspired Aesthetics**: High-contrast dark theme (`zinc-950`) paired with glowing neon emerald accents (`#10b981`), monospace code typography, and subtle micro-interactions.
- **Hero Identity Unit**: Custom developer brand logo, avatar with fallback handling, live "Available for hire" status indicator, social links (GitHub, LinkedIn, Email), and profile endorsement counters.
- **Highlights Metric Grid**: Quick-scan career summary cards highlighting full-stack experience, repository counts, degree status at University of Wah, and verified certifications.

### 2. Verified Industry Credentials Viewer
- **Credential Showcase**: Displays verified certifications from industry leaders including **Google Cloud**, **Anthropic (Model Context Protocol - MCP)**, **DeepLearning.AI**, and **Saylor Academy**.
- **Interactive High-Resolution Modal**: Click any certificate card to inspect high-resolution vectors, view grades, check verification details, and download certificate SVGs directly.
- **Category Filter Pills**: Filter certificates instantly by domain: *All*, *AI & Cloud*, *Full-Stack*, and *Core CS*.

### 3. Repository & Projects Explorer
- **GitHub Repositories**: Filterable showcase of real-world projects featuring tech stacks, live metrics, and GitHub source links.
- **Interactive Stars Counter**: Users can star repositories directly with real-time feedback and state persistence.
- **Categories**: *All*, *Full Stack*, *Systems*, *Frontend*, *Backend*, and *Open Source*.

### 4. Experience & Education Timeline
- **Milestone Cards**: Detailed history covering software engineering roles, academic coursework at the University of Wah (BS Computer Science), and hands-on full-stack development.
- **Technology Badges**: Granular tech tagging for every professional and academic position.

### 5. Technical Skills Matrix
- **Categorized Proficiency**: Structured multi-column breakdown spanning:
  - *Languages*: TypeScript, JavaScript (ES6+), Python, Go, SQL.
  - *Frontend & UI*: React 19, Tailwind CSS, Next.js, Web Performance, Motion.
  - *Backend & APIs*: Node.js, Express, RESTful API Design, GraphQL, Microservices.
  - *DevOps & Cloud*: Docker, PostgreSQL, Redis, CI/CD GitHub Actions, Cloud Deployment.

### 6. Admin Mode (Inquiries & Response Studio)
- **Recruiter Message Inbox**: View incoming contact inquiries submitted through the portfolio contact form.
- **Real-Time Unread Counters**: Live unread inquiry counter badges displayed across both desktop and mobile navigation bars.
- **Master-Detail Workspace**:
  - Split-pane interface on desktop for efficient multi-message triaging.
  - Responsive mobile master-detail flow with back navigation.
- **Quick-Response Canned Templates**: One-click replies tailored for:
  - *Introductory Call Request*: Schedule a 15–20 minute technical discussion.
  - *Project Collaboration*: Coordinate architecture and scope discussions.
  - *Thank You Acknowledgment*: Confirm inquiry receipt and follow up.
- **Message Management**: Mark messages as read/unread, compose and submit custom replies, and delete resolved inquiries.

### 7. Live Profile Customization Studio
- **Edit Profile Modal**: Modify personal details, bio, headline, location, and social links in real time without touching source code.
- **Project Showcase Management**: Add new projects, update existing ones, reorder showcase items, or remove stale entries.
- **Instant Persistence**: Updates sync to both client-side storage and the Express backend database.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS v4, Custom Fonts (`Plus Jakarta Sans`, `Fira Code`) |
| **Icons & Visuals** | Lucide React, Custom SVG Vector Certificates, Custom Developer Logo |
| **Animations** | Motion (`motion/react`), CSS Keyframes |
| **Backend Runtime** | Node.js, Express 4.x, TypeScript (`tsx`) |
| **Build Tools** | Vite, esbuild (CommonJS node bundle output), TypeScript Compiler |
| **Data Persistence** | File-based structured JSON database (`data/database.json`), `localStorage` sync |

---

## 📁 Project Directory Structure

```text
├── data/
│   └── database.json              # File-based JSON database for persistence
├── public/
│   ├── assets/                    # Public static assets
│   ├── certs/                     # Verified certificate vector images (.svg)
│   ├── avatar.png                 # Developer profile avatar
│   └── logo.jpg                   # Developer brand mark & favicon
├── server/
│   └── db.ts                      # Backend data store, authentication & schema
├── src/
│   ├── assets/                    # Generated assets and visual tokens
│   ├── components/
│   │   ├── AdminInquiriesModal.tsx # Recruiter inquiry inbox & response composer
│   │   ├── DeveloperPortfolio.tsx  # Main single-page developer portfolio
│   │   ├── EditProfileModal.tsx   # Live portfolio customization studio
│   │   └── Navbar.tsx             # Responsive header with evenly spaced desktop nav
│   ├── data/
│   │   └── maazData.ts            # Default portfolio content, projects & credentials
│   ├── lib/
│   │   └── api.ts                 # Typed client API layer & session manager
│   ├── App.tsx                    # Top-level application container & modal router
│   ├── index.css                  # Tailwind CSS root entrypoint
│   ├── main.tsx                   # React DOM root bootstrapping
│   └── types.ts                   # TypeScript interfaces, types & data schemas
├── index.html                     # HTML5 entrypoint with SEO & social share meta
├── metadata.json                  # Application metadata and runtime capabilities
├── package.json                   # Dependencies, scripts and project config
├── server.ts                      # Express API server & Vite development middleware
└── tsconfig.json                  # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the repository directory:
   ```bash
   git clone <repository-url>
   cd portfolio-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000` with active API routes and Vite middleware.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Boots the full-stack Express server with Vite middleware using `tsx` on port `3000`. |
| `npm run build` | Compiles the client SPA into `/dist` and bundles `server.ts` into a self-contained `dist/server.cjs` file using `esbuild`. |
| `npm start` | Runs the compiled CommonJS production server from `dist/server.cjs`. |
| `npm run lint` | Executes TypeScript type checking (`tsc --noEmit`) to ensure zero type errors. |
| `npm run clean` | Cleans previous build artifacts (`dist` folder). |

---

## 📡 REST API Reference

The backend provides a comprehensive RESTful API under the `/api` namespace:

### System & Health
- `GET /api/health` — Returns server health status, uptime, and system metadata.
- `GET /api/docs/spec` — Returns the OpenAPI-compliant JSON specification.

### Authentication & Sessions
- `POST /api/auth/register` — Register a new portfolio owner account.
- `POST /api/auth/login` — Authenticate and receive a Bearer token.
- `GET /api/auth/me` — Retrieve the current authenticated user session.
- `POST /api/auth/admin-session` — Auto-provision or verify an admin session for managing inquiries.

### Portfolio Management
- `GET /api/portfolios` — List all published portfolios.
- `GET /api/portfolio/:username` — Fetch public portfolio profile, projects, experience, and skills.
- `PUT /api/portfolio/profile` — Update developer bio, status, location, and social links *(Auth required)*.
- `POST /api/portfolio/projects` — Create a new project showcase card *(Auth required)*.
- `PUT /api/portfolio/projects/:id` — Update an existing project *(Auth required)*.
- `DELETE /api/portfolio/projects/:id` — Delete a project *(Auth required)*.
- `PUT /api/portfolio/projects/reorder` — Update display ordering of projects *(Auth required)*.
- `PUT /api/portfolio/skills` — Update skills categories and proficiencies *(Auth required)*.
- `POST /api/portfolio/:username/like` — Increment endorsements/likes for a portfolio profile.

### Inquiries & Admin Inbox
- `POST /api/portfolio/contact/:username` — Submit a recruiter message or inquiry through the contact form.
- `GET /api/portfolio/:username/messages` — Retrieve all received inquiries *(Auth required)*.
- `PUT /api/portfolio/messages/:id/read` — Mark an inquiry as read *(Auth required)*.
- `PUT /api/portfolio/messages/:id/toggle-read` — Toggle between read and unread status *(Auth required)*.
- `POST /api/portfolio/messages/:id/reply` — Send and record a response to an inquiry *(Auth required)*.
- `DELETE /api/portfolio/messages/:id` — Delete an inquiry from the inbox *(Auth required)*.

---

## 🎨 Responsive Design Guidelines

- **Container Constraints**: Standardized to `w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` across all sections.
- **Desktop Layout (≥ 1024px)**: 3-column header with left brand, mathematically centered navigation links, and uncompressed action buttons.
- **Tablet Layout (768px – 1023px)**: Action controls remain easily accessible while navigation transitions smoothly into an expandable drawer.
- **Mobile Layout (< 768px)**: Compact header with unread badge indicators and slide-down drawer with touch targets exceeding 44px.

---

## 👤 Author & Attribution

**Maaz Nadeem**
- **Role**: Full-Stack Web Developer & AI Solutions Engineer
- **Education**: BS Computer Science, University of Wah, Rawalpindi / Wah Cantt, Pakistan
- **GitHub**: [github.com/Maazawan982](https://github.com/Maazawan982)
- **LinkedIn**: [linkedin.com/in/maaz-nadeem-56428030a](https://www.linkedin.com/in/maaz-nadeem-56428030a)
- **Email**: [maazawan2468@gmail.com](mailto:maazawan2468@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
