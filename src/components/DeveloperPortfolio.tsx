import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  Code2, 
  Layers, 
  Send, 
  Star, 
  Check, 
  Copy,
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  Award,
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { UserProfile, Project, Experience, SkillCategory } from '../types';
import { MAAZ_CERTIFICATIONS, Certification } from '../data/defaultPortfolio';
import { api } from '../lib/api';

interface DeveloperPortfolioProps {
  profile: UserProfile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillCategory[];
  onOpenEdit: () => void;
  onOpenAdmin?: () => void;
  unreadInquiriesCount?: number;
}

export const DeveloperPortfolio: React.FC<DeveloperPortfolioProps> = ({
  profile,
  projects,
  experiences,
  skills,
  onOpenEdit,
  onOpenAdmin,
  unreadInquiriesCount = 0
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [certCategory, setCertCategory] = useState<string>('All');
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(profile.stats?.likes || 38);
  const [hasLiked, setHasLiked] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  // Project star tracking
  const [projectStars, setProjectStars] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    projects.forEach(p => {
      map[p.id] = p.starsCount || 10;
    });
    return map;
  });

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const certCategories = ['All', 'Full Stack', 'AI & LLMs', 'Cloud & Agents', 'Machine Learning'];
  const filteredCerts = certCategory === 'All'
    ? MAAZ_CERTIFICATIONS
    : MAAZ_CERTIFICATIONS.filter(c => c.category === certCategory);

  const currentCertIndex = previewCert 
    ? filteredCerts.findIndex(c => c.id === previewCert.id)
    : -1;

  const handlePrevCert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredCerts.length <= 1) return;
    const prevIdx = (currentCertIndex - 1 + filteredCerts.length) % filteredCerts.length;
    setPreviewCert(filteredCerts[prevIdx]);
  };

  const handleNextCert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (filteredCerts.length <= 1) return;
    const nextIdx = (currentCertIndex + 1) % filteredCerts.length;
    setPreviewCert(filteredCerts[nextIdx]);
  };

  const handleCopyCertId = (certId: string, idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy).then(() => {
      setCopiedCertId(certId);
      setTimeout(() => setCopiedCertId(null), 2000);
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email || 'maazawan2468@gmail.com').then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  const handleLikeProfile = () => {
    if (hasLiked) return;
    setLikesCount(prev => prev + 1);
    setHasLiked(true);
    api.like(profile.username).catch(() => {});
  };

  const handleStarProject = (projId: string) => {
    setProjectStars(prev => ({
      ...prev,
      [projId]: (prev[projId] || 0) + 1
    }));
    api.like(profile.username, projId).catch(() => {});
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    try {
      await api.sendContactMessage(profile.username || 'Maazawan982', {
        senderName: name,
        senderEmail: email,
        subject: subject || 'Portfolio Inquiry',
        message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-20 pb-20 text-zinc-200">
      {/* 1. HERO SECTION */}
      <section id="about" className="relative pt-10 sm:pt-16 pb-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-12">
            {/* Avatar & Availability */}
            <div className="relative flex-shrink-0">
              <div className="relative group">
                <img
                  src={profile.avatarUrl || '/avatar.png'}
                  alt={profile.name}
                  onError={(e) => {
                    // Fallback to GitHub image if local isn't loaded
                    (e.currentTarget as HTMLImageElement).src = 'https://github.com/Maazawan982.png';
                  }}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-2 border-zinc-800 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-zinc-300 whitespace-nowrap">
                    {profile.status}
                  </span>
                </div>
              </div>

              {/* Endorse Button */}
              <button
                id="hero-endorse-btn"
                onClick={handleLikeProfile}
                className={`mt-5 w-full py-1.5 px-3 rounded-lg text-xs font-mono border transition-all flex items-center justify-center gap-2 ${
                  hasLiked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{likesCount} Endorsements</span>
              </button>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.location}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>BS Computer Science (Final Year)</span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono text-zinc-100 tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg text-emerald-400 font-mono mt-1">
                  {profile.headline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl">
                {profile.bio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10"
                >
                  <span>Explore Repositories</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Get in Touch</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-2"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Email Copied!' : profile.email}</span>
                </button>
              </div>

              {/* Social Links Row */}
              <div className="flex items-center gap-3 pt-2 text-zinc-400">
                {profile.socials?.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 border border-zinc-800 transition-colors flex items-center gap-2 text-xs font-mono"
                    title="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                    <span>github.com/Maazawan982</span>
                  </a>
                )}
                {profile.socials?.linkedin && (
                  <a
                    href={profile.socials.linkedin.startsWith('http') ? profile.socials.linkedin : `https://${profile.socials.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 border border-zinc-800 transition-colors flex items-center gap-2 text-xs font-mono"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-zinc-800/80 font-mono">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="text-2xl font-bold text-emerald-400">1 Year</div>
              <div className="text-xs text-zinc-400 mt-1">Full-Stack Experience</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="text-2xl font-bold text-zinc-100">{projects.length}+</div>
              <div className="text-xs text-zinc-400 mt-1">GitHub Repositories</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="text-2xl font-bold text-emerald-400">Final Year</div>
              <div className="text-xs text-zinc-400 mt-1">BS CS @ Univ. of Wah</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="text-2xl font-bold text-emerald-400">{MAAZ_CERTIFICATIONS.length} Verified</div>
              <div className="text-xs text-zinc-400 mt-1">Google • Anthropic • Saylor</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CERTIFICATIONS SECTION */}
      <section id="certifications" className="scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Credentials</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                Impactful Industry Certifications
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Curated technical credentials in Full-Stack Web Development, Model Context Protocol (MCP), Machine Learning (98% grade), Cloud AI, and Agentic Systems.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {certCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCertCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    certCategory === cat
                      ? 'bg-emerald-500 text-zinc-950 font-semibold'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:shadow-emerald-950/20"
              >
                {/* 1. Certificate Picture Frame (Front & Center) */}
                <div 
                  onClick={() => setPreviewCert(cert)}
                  className="relative cursor-pointer overflow-hidden bg-zinc-950 border-b border-zinc-800/80 aspect-[16/11] flex items-center justify-center p-2.5 group/pic"
                >
                  <img
                    src={cert.image}
                    alt={`${cert.title} Certificate`}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover/pic:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-zinc-950/50 opacity-0 group-hover/pic:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-zinc-950 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-lg transform -translate-y-1 group-hover/pic:translate-y-0 transition-transform">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>View Full Certificate</span>
                    </span>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border backdrop-blur-md bg-zinc-900/90 shadow-sm ${cert.badgeColor}`}>
                      {cert.issuer}
                    </span>
                  </div>
                  {cert.grade && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/90 text-zinc-950 shadow-sm">
                        {cert.grade}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Compact Details & Actions */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{cert.category}</span>
                      <span>{cert.issueDate}</span>
                    </div>
                    
                    <h3 
                      onClick={() => setPreviewCert(cert)}
                      className="text-sm font-bold font-mono text-zinc-100 group-hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer"
                      title={cert.title}
                    >
                      {cert.title}
                    </h3>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skills.slice(0, 3).map((skill) => (
                        <span 
                          key={skill}
                          className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 text-[10px] font-mono border border-zinc-700/40"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500 text-[10px] font-mono">
                          +{cert.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer with Credential ID & Enlarge Button */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {cert.credentialId ? (
                        <span className="truncate" title={cert.credentialId}>
                          ID: <span className="text-zinc-300">{cert.credentialId}</span>
                        </span>
                      ) : (
                        <span>Verified</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {cert.credentialId && (
                        <button
                          onClick={() => handleCopyCertId(cert.id, cert.credentialId!)}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px]"
                          title="Copy Credential ID"
                        >
                          {copiedCertId === cert.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => setPreviewCert(cert)}
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1 text-[10px]"
                        title="Enlarge Certificate"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REPOSITORIES & PROJECTS SHOWCASE */}
      <section id="projects" className="scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Repositories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                Projects & Work
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-zinc-950 font-semibold'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      {project.category}
                    </div>

                    <button
                      onClick={() => handleStarProject(project.id)}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 hover:border-zinc-600 text-[11px] font-mono text-zinc-300 hover:text-amber-400 flex items-center gap-1 transition-colors"
                      title="Star this repository"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400/80 text-amber-400" />
                      <span>{projectStars[project.id] || 10}</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base font-bold font-mono text-zinc-100 group-hover:text-emerald-400 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity flex-shrink-0" />
                    </a>

                    <p className="text-[11px] font-mono text-emerald-400/90 font-medium line-clamp-1">
                      {project.tagline}
                    </p>

                    <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3">
                      {project.description}
                    </p>

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between font-mono text-xs">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-300 hover:text-emerald-400 flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository</span>
                  </a>

                  <span className="text-[10px] text-zinc-500 font-mono">
                    Maazawan982
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE & EDUCATION */}
      <section id="experience" className="scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Background & Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
              Experience & Education
            </h2>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div
                key={exp.id || idx}
                className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-base font-bold font-mono text-zinc-100">
                      {exp.role}
                    </h3>
                    <div className="text-xs font-mono text-emerald-400">
                      {exp.company} • {exp.location}
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-950 text-zinc-400 border border-zinc-800 w-fit">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {exp.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SKILLS MATRIX */}
      <section id="skills" className="scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Technical Arsenal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
              Skills & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {skills.map((category) => (
              <div
                key={category.category}
                className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3"
              >
                <h3 className="text-sm font-bold font-mono text-zinc-100 flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span>{category.category}</span>
                  <span className="text-[10px] font-normal text-emerald-400">
                    {category.skills.length} items
                  </span>
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {category.skills.map((sk) => (
                    <span
                      key={sk.name}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{sk.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="scroll-mt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Direct Info */}
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 mb-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Direct Inquiries</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-mono text-zinc-100">
                    Get in Touch
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  Looking for a dedicated full-stack developer with hands-on project experience, AI integration skills, and strong computer science fundamentals? Reach out directly.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 text-[10px]">EMAIL ADDRESS</div>
                      <div className="text-zinc-200 font-medium">{profile.email}</div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 text-[10px]">LOCATION</div>
                      <div className="text-zinc-200 font-medium">{profile.location}</div>
                    </div>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 text-[10px]">EDUCATION</div>
                      <div className="text-zinc-200 font-medium">University of Wah (BS CS)</div>
                    </div>
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                  </div>

                  {onOpenAdmin && (
                    <div className="pt-2">
                      <button
                        onClick={onOpenAdmin}
                        className="w-full p-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white transition-all flex items-center justify-between group font-mono text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <div className="text-zinc-200 font-bold group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              <span>Admin Mode</span>
                              <span className="text-[10px] text-zinc-500 font-normal">• Inquiries & Responses</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                              View incoming recruiter messages & reply
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {unreadInquiriesCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-zinc-950 font-mono animate-pulse">
                              {unreadInquiriesCount} new
                            </span>
                          ) : null}
                          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Contact Form */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6">
                {submitted ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold font-mono text-zinc-100">Message Delivered!</h3>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Thank you for reaching out, Maaz has received your inquiry and will follow up soon.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono hover:bg-zinc-800"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi Maaz, I saw your portfolio and repositories..."
                        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors font-sans text-xs leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sending ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CERTIFICATE IMAGE LIGHTBOX MODAL */}
      {previewCert && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setPreviewCert(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95 gap-4">
              <div className="flex items-center gap-2.5 truncate">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${previewCert.badgeColor}`}>
                  {previewCert.issuer}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-mono text-zinc-100 truncate">
                  {previewCert.title}
                </h3>
                {previewCert.grade && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                    {previewCert.grade}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={previewCert.image}
                  target="_blank"
                  rel="noreferrer"
                  download={`${previewCert.id}.svg`}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Open / Download original image"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Close certificate viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Image Body with Prev/Next buttons */}
            <div className="relative flex-1 min-h-[350px] max-h-[68vh] bg-zinc-950 flex items-center justify-center p-4 sm:p-6 overflow-auto">
              <img
                src={previewCert.image}
                alt={previewCert.title}
                className="max-h-[62vh] max-w-full object-contain rounded-lg shadow-2xl border border-zinc-800/80"
              />

              {filteredCerts.length > 1 && (
                <>
                  <button
                    onClick={handlePrevCert}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 shadow-xl transition-all"
                    title="Previous certificate"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextCert}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 shadow-xl transition-all"
                    title="Next certificate"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer with details */}
            <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/95 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Issued: <span className="text-zinc-200">{previewCert.issueDate}</span></span>
                {previewCert.credentialId && (
                  <>
                    <span className="text-zinc-600 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">ID: <span className="text-zinc-200">{previewCert.credentialId}</span></span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {previewCert.credentialId && (
                  <button
                    onClick={() => handleCopyCertId(previewCert.id, previewCert.credentialId!)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    {copiedCertId === previewCert.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied ID</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Credential ID</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
