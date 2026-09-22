import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Play, 
  Copy, 
  Check, 
  Server, 
  Laptop, 
  Cloud, 
  Layers, 
  Code2,
  CheckCircle2
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeDocSection, setActiveDocSection] = useState<'architecture' | 'database' | 'apis' | 'security' | 'setup' | 'deployment'>('apis');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live API tester state
  const [testEndpoint, setTestEndpoint] = useState('/api/portfolio/alexdev');
  const [testMethod, setTestMethod] = useState('GET');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<number | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const runApiTest = async () => {
    setTestLoading(true);
    setTestResponse(null);
    setTestStatus(null);
    try {
      const res = await fetch(testEndpoint, {
        method: testMethod,
        headers: { 'Content-Type': 'application/json' }
      });
      setTestStatus(res.status);
      const json = await res.json();
      setTestResponse(json);
    } catch (err: any) {
      setTestStatus(500);
      setTestResponse({ error: err.message || 'Network request failed' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-zinc-200">
      {/* Top Banner */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Technical Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
            System Architecture & RESTful API Specifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Complete technical reference covering system design patterns, database schemas, REST endpoints with live query execution, and deployment instructions.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-zinc-800 font-mono text-xs">
          {[
            { id: 'apis', label: 'REST API & Live Tester', icon: Terminal },
            { id: 'architecture', label: 'System Architecture', icon: Server },
            { id: 'database', label: 'Database & Schemas', icon: Database },
            { id: 'security', label: 'Auth & Route Protection', icon: ShieldCheck },
            { id: 'setup', label: 'Local Development', icon: Laptop },
            { id: 'deployment', label: 'Deployment Guide', icon: Cloud }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDocSection(tab.id as any)}
                className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                  activeDocSection === tab.id
                    ? 'border-emerald-500 text-emerald-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION: REST APIs & Live Playground */}
        {activeDocSection === 'apis' && (
          <div className="space-y-6">
            {/* Live Interactive API Tester */}
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold font-mono text-zinc-100">
                    Live Interactive API Explorer
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Execute
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex gap-2 flex-1">
                  <select
                    value={testMethod}
                    onChange={(e) => setTestMethod(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 font-mono text-xs text-emerald-400 font-bold"
                  >
                    <option value="GET">GET</option>
                  </select>

                  <select
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 font-mono text-xs text-zinc-100"
                  >
                    <option value="/api/portfolio/alexdev">GET /api/portfolio/alexdev (Fetch Alex's portfolio)</option>
                    <option value="/api/portfolio/sarahcodes">GET /api/portfolio/sarahcodes (Fetch Sarah's portfolio)</option>
                    <option value="/api/portfolio/johndoe">GET /api/portfolio/johndoe (Fetch John's portfolio)</option>
                    <option value="/api/portfolios">GET /api/portfolios (Search public directory)</option>
                    <option value="/api/health">GET /api/health (System status)</option>
                    <option value="/api/docs/spec">GET /api/docs/spec (API specification spec)</option>
                  </select>
                </div>

                <button
                  id="run-api-test-btn"
                  onClick={runApiTest}
                  disabled={testLoading}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{testLoading ? 'Requesting...' : 'Send Request'}</span>
                </button>
              </div>

              {testStatus !== null && (
                <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Response Status:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      testStatus >= 200 && testStatus < 300 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {testStatus} OK
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-64 p-3 bg-zinc-900 rounded border border-zinc-800/80">
                    {JSON.stringify(testResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* REST Endpoint Specification Table */}
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-sm font-semibold font-mono text-zinc-100">
                Core RESTful API Endpoints
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {/* GET /api/portfolio/:username */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20 text-[10px]">
                        GET
                      </span>
                      <span className="text-zinc-200 font-semibold">/api/portfolio/:username</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Public Access</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Retrieves public portfolio records (profile, projects, career experience, and skills matrix). Automatically records profile visit counters.
                  </p>
                </div>

                {/* PUT /api/portfolio/profile */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px]">
                        PUT
                      </span>
                      <span className="text-zinc-200 font-semibold">/api/portfolio/profile</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      Bearer Auth Required
                    </span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Updates creator profile information (name, headline, bio, location, status, theme accent, social media links).
                  </p>
                </div>

                {/* POST /api/portfolio/projects */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                        POST
                      </span>
                      <span className="text-zinc-200 font-semibold">/api/portfolio/projects</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      Bearer Auth Required
                    </span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Adds a new project item to the creator's portfolio. Generates a unique slug and appends to ordered list.
                  </p>
                </div>

                {/* PUT /api/portfolio/projects/reorder */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 text-[10px]">
                        PUT
                      </span>
                      <span className="text-zinc-200 font-semibold">/api/portfolio/projects/reorder</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      Bearer Auth Required
                    </span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Re-sequences projects by updating order indexes using an array of project IDs.
                  </p>
                </div>

                {/* POST /api/portfolio/contact/:username */}
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                        POST
                      </span>
                      <span className="text-zinc-200 font-semibold">/api/portfolio/contact/:username</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Public Form</span>
                  </div>
                  <p className="text-zinc-400 font-sans text-xs">
                    Allows prospective clients or employers to send a direct message into the creator's private dashboard inbox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: System Architecture */}
        {activeDocSection === 'architecture' && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold font-mono text-zinc-100 mb-2">
                System Architecture & Design Patterns
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The Portfolio Management System is structured as a full-stack, modular architecture designed around fast compilation, dynamic username routing, and robust state persistence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs font-mono text-emerald-400 mb-1">Presentation Layer</div>
                <div className="text-sm font-semibold text-zinc-200 mb-2">React 19 + Tailwind CSS</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Responsive UI designed with developer aesthetics: clean monospaced accents, subtle dot grid background, accessible contrast, and zero layout shift.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs font-mono text-emerald-400 mb-1">Application Layer</div>
                <div className="text-sm font-semibold text-zinc-200 mb-2">Express.js API Engine</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  RESTful controllers handling input sanitization, dynamic routing parameter resolution, token authentication, and error propagation.
                </p>
              </div>

              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs font-mono text-emerald-400 mb-1">Persistence Layer</div>
                <div className="text-sm font-semibold text-zinc-200 mb-2">Persistent Document Store</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Atomic file-backed JSON database engine maintaining collections for users, profiles, projects, career timelines, and private contact messages.
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4">
              <h3 className="text-xs font-mono text-zinc-300 font-semibold mb-2">Data Flow Diagram</h3>
              <pre className="text-[11px] font-mono text-emerald-400 bg-zinc-900 p-3 rounded border border-zinc-800/80 overflow-x-auto">
{`Client Browser (/portfolio/:username) 
   │
   ├─► GET /api/portfolio/:username
   │      │
   │      ▼
   │   Express Router -> db.getPublicPortfolio(username)
   │      │ (sanitizes private credentials, increments view counter)
   │      ▼
   │   JSON Response { profile, projects, experiences, skills }
   │
   └─► POST /api/portfolio/contact/:username
          │ (validates email & message payload)
          ▼
       Stored securely in Creator's private database message queue`}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION: Database & Schema */}
        {activeDocSection === 'database' && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold font-mono text-zinc-100 mb-2">
                Database Schema & Entity Relationships
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The database manages relational entities keyed by username with 1-to-many associations for projects, work milestones, skills, and messages.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2">// UserProfile Entity</div>
                <pre className="text-zinc-300 text-[11px]">
{`interface UserProfile {
  id: string;
  username: string;       // Primary unique handle (e.g. "alexdev")
  name: string;           // Display Name
  email: string;          // Contact email
  headline: string;       // Professional title
  bio: string;            // Summary / narrative
  avatarUrl: string;      // Image link
  location: string;       // City / Country / Remote
  status: 'Available for hire' | 'Open to collaborate' | 'Building in public';
  socials: { github?, linkedin?, twitter?, website? };
  accentColor: string;    // Custom hex color
  stats: { views: number; likes: number; endorsements: number; };
}`}
                </pre>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs">
                <div className="text-emerald-400 font-bold mb-2">// Project Entity (1-to-Many with User)</div>
                <pre className="text-zinc-300 text-[11px]">
{`interface Project {
  id: string;
  username: string;       // Foreign key -> UserProfile.username
  title: string;
  slug: string;
  tagline: string;
  description: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  tags: string[];         // e.g. ['React', 'TypeScript', 'Node.js']
  category: 'Full Stack' | 'Frontend' | 'Backend' | 'Systems';
  featured: boolean;
  order: number;          // Custom user sequencing
  starsCount?: number;
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Security & Route Protection */}
        {activeDocSection === 'security' && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-base font-bold font-mono text-zinc-100 mb-2">
              Authentication & Security Approach
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Step 4 compliance: Protecting creator dashboard routes and preventing unauthorized updates.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-emerald-400 font-bold mb-1">1. Bearer Token Verification Middleware</div>
                <p className="font-sans text-xs text-zinc-400">
                  Protected endpoints (<code className="text-zinc-300">PUT /api/portfolio/profile</code>, <code className="text-zinc-300">POST /api/portfolio/projects</code>, etc.) require an <code className="text-zinc-300">Authorization: Bearer &lt;token&gt;</code> header. Unauthenticated attempts return <code className="text-red-400">401 Unauthorized</code>.
                </p>
              </div>

              <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-emerald-400 font-bold mb-1">2. Scope & Ownership Isolation</div>
                <p className="font-sans text-xs text-zinc-400">
                  Mutation operations automatically bind mutations strictly to the token owner's handle. Creators cannot edit, reorder, or delete another user's projects or read their private messages.
                </p>
              </div>

              <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800">
                <div className="text-emerald-400 font-bold mb-1">3. Public Data Sanitization</div>
                <p className="font-sans text-xs text-zinc-400">
                  The <code className="text-zinc-300">GET /api/portfolio/:username</code> endpoint strips all password hashes, session tokens, and inbox messages prior to sending responses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: Setup & Run Locally */}
        {activeDocSection === 'setup' && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-base font-bold font-mono text-zinc-100 mb-2">
              Local Setup & Execution Guide
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Follow these commands to clone, install dependencies, and run the full-stack development server.
            </p>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-xs">
              <div className="text-zinc-500"># 1. Clone repository & enter workspace</div>
              <div className="text-zinc-200">git clone https://github.com/example/portfolio-management-system.git</div>
              <div className="text-zinc-200">cd portfolio-management-system</div>
              <br />
              <div className="text-zinc-500"># 2. Install dependencies</div>
              <div className="text-zinc-200">npm install</div>
              <br />
              <div className="text-zinc-500"># 3. Launch full stack dev server (Express + Vite)</div>
              <div className="text-emerald-400">npm run dev</div>
              <br />
              <div className="text-zinc-500"># Server boots at http://localhost:3000</div>
            </div>
          </div>
        )}

        {/* SECTION: Deployment Guide */}
        {activeDocSection === 'deployment' && (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
            <h2 className="text-base font-bold font-mono text-zinc-100 mb-2">
              Deployment & Self-Hosting Guide
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deployable directly to Cloud Run, Docker containers, or Node.js hosting providers.
            </p>

            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-xs">
              <div className="text-zinc-500"># Build production assets and bundle server</div>
              <div className="text-zinc-200">npm run build</div>
              <br />
              <div className="text-zinc-500"># Starts the bundled production server</div>
              <div className="text-emerald-400">npm start</div>
            </div>

            <div className="text-xs text-zinc-400 leading-relaxed">
              <strong>Environment Requirements:</strong> Node.js 18+, Port 3000, and Write permissions to the <code className="text-zinc-300 font-mono">/data</code> directory for database persistence.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
