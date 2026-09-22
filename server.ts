import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Request logger for development / auditing
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Auth Middleware for protected endpoints
  const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Authentication token is missing.'
      });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const user = db.getUserByToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired authentication token.'
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    };
    next();
  };

  // --- RESTful API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'Portfolio Management System API',
      timestamp: new Date().toISOString()
    });
  });

  // Authentication: Register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { username, name, email, password } = req.body;

      if (!username || !name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'All fields (username, name, email, password) are required.'
        });
      }

      // Username formatting validation (alphanumeric and hyphens only, min 3 chars)
      const cleanUsername = username.toLowerCase().trim();
      if (!/^[a-z0-9_-]{3,24}$/.test(cleanUsername)) {
        return res.status(400).json({
          success: false,
          error: 'Username must be 3-24 characters long and contain only lowercase letters, numbers, underscores or hyphens.'
        });
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid email address.'
        });
      }

      if (password.length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 5 characters long.'
        });
      }

      const newUser = db.register(cleanUsername, name, email, password);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token: newUser.token,
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Registration failed.'
      });
    }
  });

  // Authentication: Login
  app.post('/api/auth/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username/email and password are required.'
      });
    }

    const user = db.authenticate(usernameOrEmail, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username/email or password.'
      });
    }

    res.json({
      success: true,
      message: 'Login successful.',
      token: user.token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  });

  // Authentication: Verify Me
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      user: req.user
    });
  });

  // Admin Mode: Instant Admin Session for Maaz
  app.post('/api/auth/admin-session', (req, res) => {
    const user = db.getUserByUsername('maazawan982');
    if (!user) {
      return res.status(404).json({ success: false, error: 'Admin portfolio profile not found.' });
    }
    res.json({
      success: true,
      message: 'Admin session verified.',
      token: user.token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  });

  // Portfolios: Public Directory Search
  app.get('/api/portfolios', (req, res) => {
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
    const portfolios = db.getAllPortfolios(search, tag);
    res.json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  });

  // Step 2 Requirement: GET /api/portfolio/:username – Fetch public portfolio data
  app.get('/api/portfolio/:username', (req, res) => {
    const { username } = req.params;
    const portfolio = db.getPublicPortfolio(username);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: `Portfolio for user '@${username}' was not found.`
      });
    }

    res.json({
      success: true,
      data: portfolio
    });
  });

  // Step 2 Requirement: PUT /api/portfolio/profile – Update profile information
  app.put('/api/portfolio/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const updates = req.body;

      // Basic validation
      if (updates.name && updates.name.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Name cannot be empty.' });
      }

      const updatedProfile = db.updateProfile(username, updates);

      res.json({
        success: true,
        message: 'Profile updated successfully.',
        data: updatedProfile
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to update profile.' });
    }
  });

  // Step 2 Requirement: POST /api/portfolio/projects – Add a new project
  app.post('/api/portfolio/projects', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { title, tagline, description, liveUrl, githubUrl, imageUrl, tags, category, featured, metrics } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: 'Project title and description are required.'
        });
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `project-${Date.now()}`;

      const newProject = db.addProject(username, {
        title: title.trim(),
        slug,
        tagline: (tagline || '').trim(),
        description: description.trim(),
        liveUrl: liveUrl ? liveUrl.trim() : undefined,
        githubUrl: githubUrl ? githubUrl.trim() : undefined,
        imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        tags: Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(Boolean) : [],
        category: category || 'Full Stack',
        featured: Boolean(featured),
        metrics: metrics ? metrics.trim() : undefined
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully.',
        data: newProject
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to create project.' });
    }
  });

  // Additional Endpoints: PUT /api/portfolio/projects/:id – Update project
  app.put('/api/portfolio/projects/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { id } = req.params;
      const updates = req.body;

      const updated = db.updateProject(username, id, updates);
      res.json({
        success: true,
        message: 'Project updated successfully.',
        data: updated
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update project.' });
    }
  });

  // Additional Endpoints: DELETE /api/portfolio/projects/:id – Delete project
  app.delete('/api/portfolio/projects/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { id } = req.params;

      const success = db.deleteProject(username, id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Project not found.' });
      }

      res.json({
        success: true,
        message: 'Project deleted successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to delete project.' });
    }
  });

  // Additional Endpoints: PUT /api/portfolio/projects/reorder – Reorder projects
  app.put('/api/portfolio/projects/reorder', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { projectIds } = req.body;

      if (!Array.isArray(projectIds)) {
        return res.status(400).json({ success: false, error: 'projectIds array is required.' });
      }

      const reordered = db.reorderProjects(username, projectIds);
      res.json({
        success: true,
        message: 'Projects reordered successfully.',
        data: reordered
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to reorder projects.' });
    }
  });

  // Experiences: POST /api/portfolio/experiences
  app.post('/api/portfolio/experiences', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { company, role, location, startDate, endDate, isCurrent, description, technologies } = req.body;

      if (!company || !role || !startDate) {
        return res.status(400).json({
          success: false,
          error: 'Company, role, and start date are required.'
        });
      }

      const newExp = db.addExperience(username, {
        company: company.trim(),
        role: role.trim(),
        location: location ? location.trim() : 'Remote',
        startDate,
        endDate: isCurrent ? '' : endDate,
        isCurrent: Boolean(isCurrent),
        description: description ? description.trim() : '',
        technologies: Array.isArray(technologies) ? technologies.map(t => String(t).trim()).filter(Boolean) : []
      });

      res.status(201).json({
        success: true,
        message: 'Experience added successfully.',
        data: newExp
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to add experience.' });
    }
  });

  // Experiences: PUT /api/portfolio/experiences/:id
  app.put('/api/portfolio/experiences/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { id } = req.params;
      const updates = req.body;

      const updated = db.updateExperience(username, id, updates);
      res.json({
        success: true,
        message: 'Experience updated successfully.',
        data: updated
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update experience.' });
    }
  });

  // Experiences: DELETE /api/portfolio/experiences/:id
  app.delete('/api/portfolio/experiences/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { id } = req.params;

      const success = db.deleteExperience(username, id);
      if (!success) {
        return res.status(404).json({ success: false, error: 'Experience not found.' });
      }

      res.json({
        success: true,
        message: 'Experience deleted successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to delete experience.' });
    }
  });

  // Skills: PUT /api/portfolio/skills
  app.put('/api/portfolio/skills', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const username = req.user!.username;
      const { skills } = req.body;

      if (!Array.isArray(skills)) {
        return res.status(400).json({ success: false, error: 'Skills array is required.' });
      }

      const updatedSkills = db.updateSkills(username, skills);
      res.json({
        success: true,
        message: 'Skills updated successfully.',
        data: updatedSkills
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to update skills.' });
    }
  });

  // Public Endorsement/Like: POST /api/portfolio/:username/like
  app.post('/api/portfolio/:username/like', (req, res) => {
    try {
      const { username } = req.params;
      const { projectId } = req.body || {};

      const result = db.likePortfolio(username, projectId);
      res.json({
        success: true,
        message: 'Appreciation recorded!',
        data: result
      });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message || 'Could not record like.' });
    }
  });

  // Public Contact Form: POST /api/portfolio/contact/:username
  app.post('/api/portfolio/contact/:username', (req, res) => {
    try {
      const { username } = req.params;
      const { senderName, senderEmail, subject, message } = req.body;

      if (!senderName || !senderEmail || !message) {
        return res.status(400).json({
          success: false,
          error: 'Your name, email, and message are required.'
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid sender email.'
        });
      }

      const savedMessage = db.addContactMessage(username, {
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim().toLowerCase(),
        subject: subject ? subject.trim() : 'Portfolio Contact Inquiry',
        message: message.trim()
      });

      res.status(201).json({
        success: true,
        message: 'Your message has been delivered to the creator.',
        data: { id: savedMessage.id, createdAt: savedMessage.createdAt }
      });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message || 'Failed to deliver message.' });
    }
  });

  // Creator Dashboard: GET /api/portfolio/:username/messages (Protected)
  app.get('/api/portfolio/:username/messages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authUsername = req.user!.username.toLowerCase();
    const requestedUsername = req.params.username.toLowerCase();

    // Prevent unauthorized access to other creators' private inboxes
    if (authUsername !== requestedUsername) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You cannot access another creator\'s private messages.'
      });
    }

    const messages = db.getMessages(authUsername);
    res.json({
      success: true,
      data: messages
    });
  });

  // Creator Dashboard: PUT /api/portfolio/messages/:id/read (Protected)
  app.put('/api/portfolio/messages/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authUsername = req.user!.username;
    const { id } = req.params;

    const success = db.markMessageRead(authUsername, id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message marked as read.' });
  });

  // Admin Mode: PUT /api/portfolio/messages/:id/toggle-read (Protected)
  app.put('/api/portfolio/messages/:id/toggle-read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authUsername = req.user!.username;
    const { id } = req.params;
    const { read } = req.body || {};

    const success = db.toggleMessageRead(authUsername, id, read);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message status updated.' });
  });

  // Admin Mode: POST /api/portfolio/messages/:id/reply (Protected)
  app.post('/api/portfolio/messages/:id/reply', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const authUsername = req.user!.username;
      const { id } = req.params;
      const { replyMessage, senderName, senderEmail } = req.body;

      if (!replyMessage || !replyMessage.trim()) {
        return res.status(400).json({ success: false, error: 'Reply message cannot be empty.' });
      }

      const updated = db.addReplyToMessage(authUsername, id, {
        replyMessage,
        senderName: senderName || req.user!.name,
        senderEmail: senderEmail || req.user!.email
      });

      res.json({
        success: true,
        message: 'Response sent and recorded successfully.',
        data: updated
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to send response.' });
    }
  });

  // Admin Mode: DELETE /api/portfolio/messages/:id (Protected)
  app.delete('/api/portfolio/messages/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const authUsername = req.user!.username;
    const { id } = req.params;

    const success = db.deleteMessage(authUsername, id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully.' });
  });

  // Step 5 Requirement: Complete System Documentation Spec Endpoint
  app.get('/api/docs/spec', (req, res) => {
    res.json({
      title: 'Portfolio Management System REST API',
      version: '1.0.0',
      description: 'Dynamic portfolio ecosystem with username-based routing, database persistence, and creator access control.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/portfolio/:username',
          description: 'Fetch public portfolio data (sanitized profile, projects, experiences, skills)',
          authRequired: false,
          sampleResponse: {
            success: true,
            data: {
              profile: { username: 'alexdev', name: 'Alex Rivers', headline: '...' },
              projects: [],
              experiences: [],
              skills: []
            }
          }
        },
        {
          method: 'PUT',
          path: '/api/portfolio/profile',
          description: 'Update creator profile information, bio, social links, theme',
          authRequired: true,
          headers: { Authorization: 'Bearer <token>' },
          sampleBody: {
            headline: 'Senior Full Stack Engineer',
            bio: 'Updated biography text...',
            status: 'Available for hire'
          }
        },
        {
          method: 'POST',
          path: '/api/portfolio/projects',
          description: 'Add a new project to creator portfolio',
          authRequired: true,
          headers: { Authorization: 'Bearer <token>' },
          sampleBody: {
            title: 'CloudMesh Engine',
            tagline: 'Distributed telemetry proxy',
            description: 'Full markdown or rich text project description',
            category: 'Full Stack',
            tags: ['React', 'TypeScript', 'Node.js']
          }
        },
        {
          method: 'PUT',
          path: '/api/portfolio/projects/:id',
          description: 'Edit existing project properties',
          authRequired: true
        },
        {
          method: 'DELETE',
          path: '/api/portfolio/projects/:id',
          description: 'Remove project from portfolio',
          authRequired: true
        },
        {
          method: 'PUT',
          path: '/api/portfolio/projects/reorder',
          description: 'Update display sequence of projects with an array of project IDs',
          authRequired: true,
          sampleBody: { projectIds: ['p-002', 'p-001'] }
        },
        {
          method: 'POST',
          path: '/api/portfolio/contact/:username',
          description: 'Submit an inquiry/message to creator inbox',
          authRequired: false,
          sampleBody: {
            senderName: 'Jane Smith',
            senderEmail: 'jane@example.com',
            message: 'Inquiry details...'
          }
        }
      ]
    });
  });

  // Serve public static assets directly (including /avatar.png, /certs/*, etc.)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // --- Vite & Client Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Management System running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
