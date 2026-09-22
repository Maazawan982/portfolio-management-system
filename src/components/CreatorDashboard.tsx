import React, { useState, useEffect } from 'react';
import { 
  User, 
  Code2, 
  Briefcase, 
  Layers, 
  MessageSquare, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  Heart, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Mail, 
  MapPin, 
  X,
  RefreshCw
} from 'lucide-react';
import { UserProfile, Project, Experience, SkillCategory, ContactMessage, AuthSession } from '../types';
import { api } from '../lib/api';

interface CreatorDashboardProps {
  sessionUser: AuthSession['user'];
  onNavigate: (route: string) => void;
  onOpenAuth: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  sessionUser,
  onNavigate,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experience' | 'skills' | 'messages'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Loaded data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Project Modal / Edit state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Experience Modal / Edit state
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  // Fetch all creator data
  const loadDashboardData = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const publicData = await api.getPublicPortfolio(sessionUser.username);
      setProfile(publicData.profile);
      setProjects(publicData.projects);
      setExperiences(publicData.experiences);
      setSkills(publicData.skills || []);

      // Fetch private messages
      try {
        const msgs = await api.getMessages(sessionUser.username);
        setMessages(msgs);
      } catch (err) {
        console.warn('Could not fetch private messages:', err);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load creator data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [sessionUser.username]);

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setFeedback(null);

    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setFeedback({ type: 'success', message: 'Profile changes saved to database.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  // Projects CRUD
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);
    setFeedback(null);

    try {
      if (isNewProject) {
        const created = await api.addProject(editingProject);
        setProjects([...projects, created]);
        setFeedback({ type: 'success', message: 'Project published successfully.' });
      } else if (editingProject.id) {
        const updated = await api.updateProject(editingProject.id, editingProject);
        setProjects(projects.map(p => p.id === updated.id ? updated : p));
        setFeedback({ type: 'success', message: 'Project updated.' });
      }
      setEditingProject(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save project.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      setFeedback({ type: 'success', message: 'Project deleted.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete project.' });
    }
  };

  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    try {
      const ids = newProjects.map(p => p.id);
      await api.reorderProjects(ids);
      setFeedback({ type: 'success', message: 'Project order updated.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to persist order.' });
      loadDashboardData();
    }
  };

  // Experiences CRUD
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);

    try {
      if (isNewExp) {
        const created = await api.addExperience(editingExp);
        setExperiences([...experiences, created]);
        setFeedback({ type: 'success', message: 'Experience item added.' });
      } else if (editingExp.id) {
        const updated = await api.updateExperience(editingExp.id, editingExp);
        setExperiences(experiences.map(e => e.id === updated.id ? updated : e));
        setFeedback({ type: 'success', message: 'Experience item updated.' });
      }
      setEditingExp(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save experience.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Delete this career milestone?')) return;
    try {
      await api.deleteExperience(id);
      setExperiences(experiences.filter(e => e.id !== id));
      setFeedback({ type: 'success', message: 'Experience deleted.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete experience.' });
    }
  };

  // Skills update
  const handleSaveSkills = async () => {
    setSaving(true);
    try {
      await api.updateSkills(skills);
      setFeedback({ type: 'success', message: 'Skills matrix updated.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update skills.' });
    } finally {
      setSaving(false);
    }
  };

  // Message read
  const handleMarkMessageRead = async (id: string) => {
    try {
      await api.markMessageRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs text-zinc-400">Loading creator workspace for @{sessionUser.username}...</p>
      </div>
    );
  }

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen pb-24 text-zinc-200">
      {/* Top Creator Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-sm py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Protected Creator Dashboard
              </span>
            </div>
            <h1 className="text-xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <span>{profile?.name || sessionUser.name}</span>
              <span className="text-sm font-normal text-zinc-500 font-mono">(@{sessionUser.username})</span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="dash-refresh-btn"
              onClick={loadDashboardData}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Refresh database data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              id="dash-view-public-btn"
              onClick={() => onNavigate(`/portfolio/${sessionUser.username}`)}
              className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-emerald-400 border border-zinc-700 hover:border-emerald-500/50 transition-colors flex items-center gap-1.5"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
              <span>Total Views</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {profile?.stats.views || 0}
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
              <span>Endorsements</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {profile?.stats.likes || 0}
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
              <span>Projects Live</span>
              <Code2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {projects.length}
            </div>
          </div>

          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-4">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
              <span>Inquiries</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
              <span>{messages.length}</span>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {unreadMessagesCount} unread
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300' 
              : 'bg-red-950/40 border border-red-800/60 text-red-300'
          }`}>
            {feedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto pb-1 font-mono text-xs">
          <button
            id="tab-profile-btn"
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Branding</span>
          </button>

          <button
            id="tab-projects-btn"
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            id="tab-experience-btn"
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Experience ({experiences.length})</span>
          </button>

          <button
            id="tab-skills-btn"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skills Matrix</span>
          </button>

          <button
            id="tab-messages-btn"
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'messages'
                ? 'border-emerald-500 text-emerald-400 bg-zinc-900/80'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inquiries ({messages.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>

        {/* Tab 1: Profile & Branding */}
        {activeTab === 'profile' && profile && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-semibold font-mono text-zinc-200 uppercase tracking-wider mb-2">
                Core Identity & Profile Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Display Name</label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Professional Headline</label>
                  <input
                    id="profile-headline-input"
                    type="text"
                    required
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Avatar Image URL</label>
                  <input
                    id="profile-avatar-input"
                    type="url"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
                  <input
                    id="profile-location-input"
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Current Availability Status</label>
                  <select
                    id="profile-status-select"
                    value={profile.status}
                    onChange={(e: any) => setProfile({ ...profile, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Available for hire">Available for hire</option>
                    <option value="Open to collaborate">Open to collaborate</option>
                    <option value="Building in public">Building in public</option>
                    <option value="Focused on deep work">Focused on deep work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Brand Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="profile-accent-color"
                      type="color"
                      value={profile.accentColor || '#10b981'}
                      onChange={(e) => setProfile({ ...profile, accentColor: e.target.value })}
                      className="w-8 h-8 rounded bg-transparent cursor-pointer border border-zinc-700"
                    />
                    <input
                      type="text"
                      value={profile.accentColor || '#10b981'}
                      onChange={(e) => setProfile({ ...profile, accentColor: e.target.value })}
                      className="w-28 px-2 py-1 text-xs font-mono rounded bg-zinc-950 border border-zinc-800 text-zinc-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Biography / Professional Summary</label>
                <textarea
                  id="profile-bio-input"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
              <h2 className="text-sm font-semibold font-mono text-zinc-200 uppercase tracking-wider mb-2">
                Social Accounts & External Profiles
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub URL</label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      id="profile-github-input"
                      type="url"
                      value={profile.socials?.github || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        socials: { ...profile.socials, github: e.target.value }
                      })}
                      placeholder="https://github.com/username"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">LinkedIn URL</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      id="profile-linkedin-input"
                      type="url"
                      value={profile.socials?.linkedin || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        socials: { ...profile.socials, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Twitter / X</label>
                  <div className="relative">
                    <Twitter className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      id="profile-twitter-input"
                      type="url"
                      value={profile.socials?.twitter || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        socials: { ...profile.socials, twitter: e.target.value }
                      })}
                      placeholder="https://x.com/username"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Website or Blog</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      id="profile-website-input"
                      type="url"
                      value={profile.socials?.website || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        socials: { ...profile.socials, website: e.target.value }
                      })}
                      placeholder="https://mywebsite.dev"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                id="save-profile-btn"
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating Database...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Projects Manager */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold font-mono text-zinc-200">
                  Portfolio Projects Showcase
                </h2>
                <p className="text-xs text-zinc-400">
                  Add, edit, reorder, or delete projects displayed on your public profile.
                </p>
              </div>

              <button
                id="add-project-btn"
                onClick={() => {
                  setEditingProject({
                    title: '',
                    tagline: '',
                    description: '',
                    category: 'Full Stack',
                    tags: ['React', 'TypeScript'],
                    liveUrl: '',
                    githubUrl: '',
                    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                    featured: false,
                    metrics: ''
                  });
                  setIsNewProject(true);
                }}
                className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              {projects.map((p, idx) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Order controls */}
                    <div className="flex flex-col gap-1 text-zinc-500">
                      <button
                        onClick={() => handleMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        className="hover:text-emerald-400 disabled:opacity-20 transition-colors p-0.5"
                        title="Move project up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveProject(idx, 'down')}
                        disabled={idx === projects.length - 1}
                        className="hover:text-emerald-400 disabled:opacity-20 transition-colors p-0.5"
                        title="Move project down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-16 h-12 rounded object-cover border border-zinc-800 flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-100 truncate">{p.title}</span>
                        {p.featured && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate max-w-md">{p.tagline}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono text-emerald-400">{p.category}</span>
                        <span className="text-zinc-600 text-xs">•</span>
                        <span className="text-[10px] font-mono text-zinc-500">{p.tags.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setEditingProject({ ...p });
                        setIsNewProject(false);
                      }}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="px-2.5 py-1.5 rounded bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/40 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Experience Manager */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold font-mono text-zinc-200">
                  Career Milestones & Roles
                </h2>
                <p className="text-xs text-zinc-400">
                  Highlight your engineering leadership, employment timeline, and notable achievements.
                </p>
              </div>

              <button
                id="add-experience-btn"
                onClick={() => {
                  setEditingExp({
                    company: '',
                    role: '',
                    location: 'Remote',
                    startDate: '2024-01',
                    endDate: '',
                    isCurrent: true,
                    description: '',
                    technologies: ['TypeScript', 'Node.js']
                  });
                  setIsNewExp(true);
                }}
                className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{exp.role}</h3>
                    <div className="text-xs font-mono text-emerald-400">
                      {exp.company} • <span className="text-zinc-500">{exp.location}</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 max-w-2xl">{exp.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.map(t => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setEditingExp({ ...exp });
                        setIsNewExp(false);
                      }}
                      className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="px-2.5 py-1.5 rounded bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/40 text-xs font-mono flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold font-mono text-zinc-200">
                  Skills Matrix & Competency Categories
                </h2>
                <p className="text-xs text-zinc-400">
                  Organize your tech stack by categories (e.g. Languages, Frontend, Backend, Cloud).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const categoryName = prompt('Enter new skill category (e.g. "DevOps & Tools"):');
                    if (categoryName && categoryName.trim()) {
                      setSkills([...skills, { category: categoryName.trim(), skills: [] }]);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Category</span>
                </button>
                <button
                  onClick={handleSaveSkills}
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Matrix</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((group, groupIdx) => (
                <div key={groupIdx} className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{group.category}</span>
                    <button
                      onClick={() => {
                        const newSkills = [...skills];
                        newSkills.splice(groupIdx, 1);
                        setSkills(newSkills);
                      }}
                      className="text-zinc-500 hover:text-red-400 text-xs"
                      title="Remove category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {group.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-xs bg-zinc-950 p-2 rounded border border-zinc-800/80">
                        <span className="text-zinc-200">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-400">{skill.level}</span>
                          <button
                            onClick={() => {
                              const newSkills = [...skills];
                              newSkills[groupIdx].skills.splice(sIdx, 1);
                              setSkills(newSkills);
                            }}
                            className="text-zinc-600 hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const name = prompt('Skill name (e.g. "Rust" or "Docker"):');
                      if (name && name.trim()) {
                        const newSkills = [...skills];
                        newSkills[groupIdx].skills.push({
                          name: name.trim(),
                          level: 'Advanced',
                          years: 3
                        });
                        setSkills(newSkills);
                      }
                    }}
                    className="w-full py-1.5 rounded border border-dashed border-zinc-800 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                  >
                    + Add skill to {group.category}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Messages / Inquiries Inbox */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold font-mono text-zinc-200">
                Visitor Contact Inquiries
              </h2>
              <p className="text-xs text-zinc-400">
                Messages submitted through your public portfolio contact form.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-8 text-center text-zinc-500 text-xs font-mono">
                No inquiries received yet. Visitors can message you from your public profile.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      m.read 
                        ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400' 
                        : 'bg-zinc-900 border-emerald-500/40 text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-100">{m.senderName}</span>
                        <span className="text-[11px] font-mono text-emerald-400">({m.senderEmail})</span>
                        {!m.read && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-zinc-950 font-bold uppercase">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                        {!m.read && (
                          <button
                            onClick={() => handleMarkMessageRead(m.id)}
                            className="text-[10px] font-mono text-zinc-400 hover:text-emerald-400 underline"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-zinc-300 mb-1">
                      Subject: {m.subject}
                    </div>

                    <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit/Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-zinc-100">
                {isNewProject ? 'Publish New Project' : 'Update Project Details'}
              </h3>
              <button onClick={() => setEditingProject(null)} className="text-zinc-500 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Project Title *</label>
                <input
                  id="proj-title-input"
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. CloudMesh Engine"
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Tagline / Short Pitch *</label>
                <input
                  id="proj-tagline-input"
                  type="text"
                  required
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  placeholder="e.g. High-throughput distributed telemetry proxy"
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Category</label>
                  <select
                    id="proj-category-select"
                    value={editingProject.category || 'Full Stack'}
                    onChange={(e: any) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Systems">Systems</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI / ML">AI / ML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Performance Metric / Badge</label>
                  <input
                    id="proj-metrics-input"
                    type="text"
                    value={editingProject.metrics || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                    placeholder="e.g. 50k RPS • 1.2ms p99"
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Description</label>
                <textarea
                  id="proj-desc-input"
                  rows={4}
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Architectural overview, problems solved, technical stack..."
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Live Demo URL</label>
                  <input
                    id="proj-live-url"
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">GitHub Repo URL</label>
                  <input
                    id="proj-github-url"
                    type="url"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Cover Image URL</label>
                <input
                  id="proj-image-url"
                  type="url"
                  value={editingProject.imageUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Tech Tags (comma separated)</label>
                <input
                  id="proj-tags-input"
                  type="text"
                  value={(editingProject.tags || []).join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="React, TypeScript, Go, PostgreSQL"
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="proj-featured-check"
                  type="checkbox"
                  checked={Boolean(editingProject.featured)}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded bg-zinc-950 border-zinc-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="proj-featured-check" className="text-xs font-mono text-zinc-300">
                  Feature this project prominently on profile hero
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-3 py-2 rounded-md bg-zinc-800 text-zinc-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-emerald-500 text-zinc-950 font-mono font-medium text-xs hover:bg-emerald-400"
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit/Create Experience Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-zinc-100">
                {isNewExp ? 'Add Experience' : 'Edit Experience'}
              </h3>
              <button onClick={() => setEditingExp(null)} className="text-zinc-500 hover:text-zinc-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Job Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Start Date *</label>
                  <input
                    type="text"
                    placeholder="2023-01"
                    required
                    value={editingExp.startDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">End Date</label>
                  <input
                    type="text"
                    placeholder="2024-05"
                    disabled={editingExp.isCurrent}
                    value={editingExp.endDate || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="exp-current-check"
                  type="checkbox"
                  checked={Boolean(editingExp.isCurrent)}
                  onChange={(e) => setEditingExp({ ...editingExp, isCurrent: e.target.checked })}
                  className="rounded bg-zinc-950 border-zinc-800 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="exp-current-check" className="text-xs font-mono text-zinc-300">
                  Currently working here (Present)
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Key Responsibilities / Impact</label>
                <textarea
                  rows={3}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={(editingExp.technologies || []).join(', ')}
                  onChange={(e) => setEditingExp({
                    ...editingExp,
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="px-3 py-2 rounded-md bg-zinc-800 text-zinc-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-emerald-500 text-zinc-950 font-mono font-medium text-xs hover:bg-emerald-400"
                >
                  {saving ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
