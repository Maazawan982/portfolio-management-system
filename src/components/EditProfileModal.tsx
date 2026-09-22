import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  User, 
  FolderGit2, 
  Sparkles,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import { UserProfile, Project, SkillCategory, Experience } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  onSave: (data: {
    profile: UserProfile;
    projects: Project[];
    experiences: Experience[];
    skills: SkillCategory[];
  }) => void;
  onResetDefault: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  projects,
  experiences,
  skills,
  onSave,
  onResetDefault
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'socials'>('profile');

  // Form states
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [projectList, setProjectList] = useState<Project[]>([...projects]);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Sync if props update
  React.useEffect(() => {
    setFormData({ ...profile });
    setProjectList([...projects]);
  }, [profile, projects]);

  if (!isOpen) return null;

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (field: keyof UserProfile['socials'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [field]: value
      }
    }));
  };

  const handleProjectChange = (index: number, field: keyof Project, value: any) => {
    const updated = [...projectList];
    updated[index] = { ...updated[index], [field]: value };
    setProjectList(updated);
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      username: formData.username,
      title: 'New Featured Project',
      slug: `project-${Date.now()}`,
      tagline: 'High-performance application built with modern architecture.',
      description: 'Describe the problem solved, architecture choices, and metrics achieved.',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      tags: ['TypeScript', 'React', 'Node.js'],
      category: 'Full Stack',
      featured: true,
      order: projectList.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjectList([newProj, ...projectList]);
  };

  const handleDeleteProject = (index: number) => {
    setProjectList(projectList.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      profile: formData,
      projects: projectList,
      experiences,
      skills
    });
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div>
            <h2 className="text-base font-bold font-mono text-zinc-100 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Customize Developer Portfolio</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              Update your personal details, project showcase, and links.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reset to Default Bar */}
        <div className="px-6 py-2.5 bg-zinc-950/70 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-zinc-400">Default Data:</span>
          <button
            onClick={onResetDefault}
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
          >
            Reset to Maaz Nadeem Profile
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/30 px-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors ${
              activeTab === 'projects'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Projects ({projectList.length})
          </button>
          <button
            onClick={() => setActiveTab('socials')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors ${
              activeTab === 'socials'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Socials & Links
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Professional Title / Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => handleProfileChange('headline', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bio / Summary</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Work Availability Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleProfileChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Available for hire">Available for hire</option>
                    <option value="Open to collaborate">Open to collaborate</option>
                    <option value="Building in public">Building in public</option>
                    <option value="Focused on deep work">Focused on deep work</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => handleProfileChange('avatarUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Featured Showcase Projects</span>
                <button
                  onClick={handleAddProject}
                  className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {projectList.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                        placeholder="Project Title"
                        className="font-bold text-zinc-100 bg-transparent border-b border-zinc-800 focus:border-emerald-500 outline-none pb-1 flex-1"
                      />
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.tagline}
                      onChange={(e) => handleProjectChange(idx, 'tagline', e.target.value)}
                      placeholder="One-line summary"
                      className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                    />

                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-sans text-xs"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => handleProjectChange(idx, 'liveUrl', e.target.value)}
                        placeholder="Live Demo URL (https://...)"
                        className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) => handleProjectChange(idx, 'githubUrl', e.target.value)}
                        placeholder="GitHub Repository (https://...)"
                        className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>

                    <div>
                      <label className="text-zinc-500 text-[10px]">Tech Tags (comma separated)</label>
                      <input
                        type="text"
                        value={proj.tags.join(', ')}
                        onChange={(e) => handleProjectChange(idx, 'tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'socials' && (
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formData.socials?.github || ''}
                  onChange={(e) => handleSocialChange('github', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>LinkedIn Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formData.socials?.linkedin || ''}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Twitter / X Profile URL</span>
                </label>
                <input
                  type="text"
                  value={formData.socials?.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Personal Website / Blog</span>
                </label>
                <input
                  type="text"
                  value={formData.socials?.website || ''}
                  onChange={(e) => handleSocialChange('website', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
          >
            Cancel
          </button>

          <button
            id="save-profile-changes-btn"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs flex items-center gap-2 transition-colors"
          >
            {saveFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
