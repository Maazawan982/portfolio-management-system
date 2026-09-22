import { UserProfile, Project, Experience, SkillCategory, ContactMessage, PublicPortfolioData, AuthSession } from '../types';

const TOKEN_KEY = 'pms_auth_token';
const USER_KEY = 'pms_auth_user';

export const api = {
  // Session management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setSession(token: string, user: AuthSession['user']) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getCurrentUser(): AuthSession['user'] | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Helper fetch with Auth header
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  },

  // Auth
  async login(usernameOrEmail: string, password: string): Promise<AuthSession> {
    const res = await this.request<{ success: boolean; token: string; user: AuthSession['user'] }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password })
    });
    this.setSession(res.token, res.user);
    return { token: res.token, user: res.user };
  },

  async register(username: string, name: string, email: string, password: string): Promise<AuthSession> {
    const res = await this.request<{ success: boolean; token: string; user: AuthSession['user'] }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, name, email, password })
    });
    this.setSession(res.token, res.user);
    return { token: res.token, user: res.user };
  },

  async verifyMe(): Promise<AuthSession['user']> {
    const res = await this.request<{ success: boolean; user: AuthSession['user'] }>('/api/auth/me');
    return res.user;
  },

  // Portfolios
  async getPublicPortfolio(username: string): Promise<PublicPortfolioData> {
    const res = await this.request<{ success: boolean; data: PublicPortfolioData }>(`/api/portfolio/${encodeURIComponent(username)}`);
    return res.data;
  },

  async getPortfolios(search?: string, tag?: string) {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (tag) params.set('tag', tag);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ success: boolean; count: number; data: any[] }>(`/api/portfolios${qs}`);
    return res.data;
  },

  // Profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await this.request<{ success: boolean; data: UserProfile }>('/api/portfolio/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  // Projects
  async addProject(project: Partial<Project>): Promise<Project> {
    const res = await this.request<{ success: boolean; data: Project }>('/api/portfolio/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
    return res.data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await this.request<{ success: boolean; data: Project }>(`/api/portfolio/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  async deleteProject(id: string): Promise<void> {
    await this.request(`/api/portfolio/projects/${id}`, {
      method: 'DELETE'
    });
  },

  async reorderProjects(projectIds: string[]): Promise<Project[]> {
    const res = await this.request<{ success: boolean; data: Project[] }>('/api/portfolio/projects/reorder', {
      method: 'PUT',
      body: JSON.stringify({ projectIds })
    });
    return res.data;
  },

  // Experiences
  async addExperience(exp: Partial<Experience>): Promise<Experience> {
    const res = await this.request<{ success: boolean; data: Experience }>('/api/portfolio/experiences', {
      method: 'POST',
      body: JSON.stringify(exp)
    });
    return res.data;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    const res = await this.request<{ success: boolean; data: Experience }>(`/api/portfolio/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return res.data;
  },

  async deleteExperience(id: string): Promise<void> {
    await this.request(`/api/portfolio/experiences/${id}`, {
      method: 'DELETE'
    });
  },

  // Skills
  async updateSkills(skills: SkillCategory[]): Promise<SkillCategory[]> {
    const res = await this.request<{ success: boolean; data: SkillCategory[] }>('/api/portfolio/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills })
    });
    return res.data;
  },

  // Like
  async like(username: string, projectId?: string): Promise<{ likes: number; projectStars?: number }> {
    const res = await this.request<{ success: boolean; data: { likes: number; projectStars?: number } }>(`/api/portfolio/${username}/like`, {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
    return res.data;
  },

  // Contact
  async sendContactMessage(username: string, data: { senderName: string; senderEmail: string; subject?: string; message: string }) {
    const res = await this.request<{ success: boolean; message: string; data: any }>(`/api/portfolio/contact/${username}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res;
  },

  // Creator Messages
  async getAdminSession(): Promise<AuthSession> {
    const res = await this.request<{ success: boolean; token: string; user: AuthSession['user'] }>('/api/auth/admin-session', {
      method: 'POST'
    });
    this.setSession(res.token, res.user);
    return { token: res.token, user: res.user };
  },

  async getMessages(username: string): Promise<ContactMessage[]> {
    const res = await this.request<{ success: boolean; data: ContactMessage[] }>(`/api/portfolio/${username}/messages`);
    return res.data;
  },

  async markMessageRead(id: string): Promise<void> {
    await this.request(`/api/portfolio/messages/${id}/read`, {
      method: 'PUT'
    });
  },

  async toggleMessageRead(id: string, read?: boolean): Promise<void> {
    await this.request(`/api/portfolio/messages/${id}/toggle-read`, {
      method: 'PUT',
      body: JSON.stringify({ read })
    });
  },

  async replyToMessage(id: string, replyMessage: string, senderName?: string, senderEmail?: string): Promise<ContactMessage> {
    const res = await this.request<{ success: boolean; data: ContactMessage }>(`/api/portfolio/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage, senderName, senderEmail })
    });
    return res.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await this.request(`/api/portfolio/messages/${id}`, {
      method: 'DELETE'
    });
  }
};
