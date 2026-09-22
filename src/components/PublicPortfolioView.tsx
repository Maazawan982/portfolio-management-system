import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Heart, 
  Share2, 
  Check, 
  Briefcase, 
  Code2, 
  Layers, 
  MessageSquare, 
  Send, 
  Star, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  Download,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { PublicPortfolioData, Project } from '../types';
import { api } from '../lib/api';

interface PublicPortfolioViewProps {
  username: string;
  onNavigate: (route: string) => void;
  onOpenDashboard?: () => void;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({
  username,
  onNavigate,
  onOpenDashboard
}) => {
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.getPublicPortfolio(username)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLikesCount(res.profile.stats.likes || 0);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Portfolio not found.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [username]);

  const handleLike = async (projectId?: string) => {
    if (hasLiked && !projectId) return;
    try {
      const res = await api.like(username, projectId);
      setLikesCount(res.likes);
      if (!projectId) setHasLiked(true);
      if (projectId && data) {
        setData({
          ...data,
          projects: data.projects.map(p => 
            p.id === projectId ? { ...p, starsCount: res.projectStars || (p.starsCount || 0) + 1 } : p
          )
        });
      }
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + `/#/portfolio/${username}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    setContactStatus(null);

    try {
      await api.sendContactMessage(username, {
        senderName: contactName,
        senderEmail: contactEmail,
        subject: contactSubject,
        message: contactMessage
      });
      setContactStatus({
        type: 'success',
        message: `Message dispatched successfully to @${username}'s dashboard inbox!`
      });
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err: any) {
      setContactStatus({
        type: 'error',
        message: err.message || 'Failed to deliver message. Please retry.'
      });
    } finally {
      setContactSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-mono text-xs text-zinc-400">Loading public portfolio for @{username}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-zinc-100 font-mono mb-2">Portfolio Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          The requested portfolio <span className="text-emerald-400 font-mono">@{username}</span> does not exist or has been removed.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            ← Explore Directory
          </button>
          <button
            onClick={() => onNavigate('/portfolio/alexdev')}
            className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-xs font-mono text-zinc-950 font-medium transition-colors"
          >
            View Demo (@alexdev)
          </button>
        </div>
      </div>
    );
  }

  const { profile, projects, experiences, skills } = data;

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen pb-24 text-zinc-200">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm py-2 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400 truncate">
            <button onClick={() => onNavigate('/')} className="hover:text-emerald-400 transition-colors">
              directory
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-emerald-400 font-semibold truncate">@{profile.username}</span>
            <span className="hidden sm:inline-block text-[10px] text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5">
              Public Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-portfolio-link-btn"
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1.5 text-[11px]"
              title="Copy shareable link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              id="endorse-portfolio-btn"
              onClick={() => handleLike()}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors flex items-center gap-1.5 ${
                hasLiked
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              <Heart className={`w-3 h-3 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>{likesCount}</span>
            </button>

            {onOpenDashboard && (
              <button
                id="creator-edit-btn"
                onClick={onOpenDashboard}
                className="hidden sm:flex px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-[11px] items-center gap-1"
              >
                <span>Edit Portfolio</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {/* Profile Header / Bio Section */}
        <section className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: profile.accentColor || '#10b981' }}
          ></div>

          <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-zinc-700/80 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-900" title="Online & Active"></span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
                  {profile.name}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-400 border border-zinc-700">
                  @{profile.username}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {profile.status}
                </span>
              </div>

              <p className="text-sm sm:text-base font-medium text-zinc-300 mb-3">
                {profile.headline}
              </p>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl mb-5">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                {profile.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{projects.length} Projects Published</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{profile.stats.views} Views</span>
                </div>
              </div>

              {/* Social Links & Contact Action */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  {profile.socials?.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socials?.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socials?.twitter && (
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Twitter / X"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socials?.website && (
                    <a
                      href={profile.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                      title="Personal Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <a
                  href="#contact-section"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects Grid */}
        <section id="projects-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-lg font-semibold text-zinc-100 font-mono">
                  Engineered Projects
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Production applications, systems architectures, and open source contributions
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-zinc-950 font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden"
              >
                {project.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}

                <div>
                  <div className="mb-3 overflow-hidden rounded-lg border border-zinc-800 aspect-video relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.metrics && (
                      <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-emerald-400 border border-zinc-700">
                        {project.metrics}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-1">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-300 mb-2 font-medium">
                    {project.tagline}
                  </p>

                  <p className="text-xs text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Links & Stars */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        <span>Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => handleLike(project.id)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
                    title="Star this project"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{project.starsCount || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Career Timeline */}
        {experiences.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100 font-mono">
                Work Experience & Engineering Timeline
              </h2>
            </div>

            <div className="relative pl-6 border-l border-zinc-800 space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform"></div>

                  <div className="rounded-xl bg-zinc-900/50 border border-zinc-800/70 p-5 hover:border-zinc-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-100">
                          {exp.role}
                        </h3>
                        <div className="text-xs font-mono text-emerald-400">
                          {exp.company} • <span className="text-zinc-400">{exp.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 self-start sm:self-auto">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Matrix */}
        {skills.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100 font-mono">
                Technical Skills & Competencies
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((group, idx) => (
                <div key={idx} className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-5">
                  <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>{group.category}</span>
                    <span className="text-zinc-600 text-[10px]">{group.skills.length} skills</span>
                  </h3>

                  <div className="space-y-2.5">
                    {group.skills.map((s, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-200 font-medium">{s.name}</span>
                        <div className="flex items-center gap-2">
                          {s.years && (
                            <span className="text-[10px] font-mono text-zinc-500">
                              {s.years} yrs
                            </span>
                          )}
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            s.level === 'Expert' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : s.level === 'Advanced'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}>
                            {s.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Contact Form (Connects with backend database) */}
        <section id="contact-section" className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 backdrop-blur-sm">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-zinc-100 font-mono">
                Contact & Hire Inquiry
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              Send a direct message to @{profile.username}. Inquiries are saved directly to the creator's dashboard inbox.
            </p>

            {contactStatus && (
              <div className={`mb-5 p-3 rounded-lg text-xs font-mono flex items-start gap-2 ${
                contactStatus.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/40 border border-red-800/60 text-red-300'
              }`}>
                <span className="font-bold">[{contactStatus.type.toUpperCase()}]</span>
                <span>{contactStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Your Name</label>
                  <input
                    id="contact-sender-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Your Email</label>
                  <input
                    id="contact-sender-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Project Collaboration / Full Stack Contract"
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Describe your project, timeline, or inquiry..."
                  className="w-full px-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={contactSending}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {contactSending ? (
                  <span className="animate-pulse">Dispatching...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to @{profile.username}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
