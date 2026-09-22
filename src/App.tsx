import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DeveloperPortfolio } from './components/DeveloperPortfolio';
import { EditProfileModal } from './components/EditProfileModal';
import { AdminInquiriesModal } from './components/AdminInquiriesModal';
import { UserProfile, Project, Experience, SkillCategory } from './types';
import { 
  MAAZ_PROFILE, 
  MAAZ_PROJECTS, 
  MAAZ_EXPERIENCES, 
  MAAZ_SKILLS 
} from './data/defaultPortfolio';
import { api } from './lib/api';
import { ArrowUp, Github, Linkedin, Mail, MapPin, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'maaz_nadeem_portfolio_v3';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(MAAZ_PROFILE);
  const [projects, setProjects] = useState<Project[]>(MAAZ_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(MAAZ_EXPERIENCES);
  const [skills, setSkills] = useState<SkillCategory[]>(MAAZ_SKILLS);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);
  const [activeSection, setActiveSection] = useState('about');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load from local storage or server on mount
  useEffect(() => {
    // Clear any obsolete legacy keys that may contain placeholder data
    localStorage.removeItem('simple_dev_portfolio_data');
    localStorage.removeItem('pms_demo_initialized');

    // Check initial inquiries count for Admin Mode badge
    api.getAdminSession().then(() => {
      api.getMessages('Maazawan982').then((msgs) => {
        if (msgs) {
          setUnreadInquiriesCount(msgs.filter(m => !m.read).length);
        }
      }).catch(() => {});
    }).catch(() => {});

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.profile.name === 'Maaz Nadeem') {
          setProfile(parsed.profile);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.experiences) setExperiences(parsed.experiences);
          if (parsed.skills) setSkills(parsed.skills);
        } else {
          // Reset to Maaz default
          handleResetToDefault();
        }
      } catch {
        handleResetToDefault();
      }
    } else {
      // Set to Maaz default
      handleResetToDefault();

      // Also try to query server for any saved updates
      api.getPublicPortfolio('Maazawan982')
        .then((data) => {
          if (data && data.profile && data.profile.name === 'Maaz Nadeem') {
            setProfile(data.profile);
            if (data.projects?.length) setProjects(data.projects);
            if (data.experiences?.length) setExperiences(data.experiences);
            if (data.skills?.length) setSkills(data.skills);
          }
        })
        .catch(() => {
          // Defaults are already set
        });
    }

    // Scroll listener for active section & back to top
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400);

      const sections = ['about', 'certifications', 'projects', 'experience', 'skills', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleResetToDefault = () => {
    const maazData = {
      profile: MAAZ_PROFILE,
      projects: MAAZ_PROJECTS,
      experiences: MAAZ_EXPERIENCES,
      skills: MAAZ_SKILLS
    };
    setProfile(maazData.profile);
    setProjects(maazData.projects);
    setExperiences(maazData.experiences);
    setSkills(maazData.skills);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(maazData));
  };

  const handleSaveData = (data: {
    profile: UserProfile;
    projects: Project[];
    experiences: Experience[];
    skills: SkillCategory[];
  }) => {
    setProfile(data.profile);
    setProjects(data.projects);
    setExperiences(data.experiences);
    setSkills(data.skills);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Also attempt saving to backend API
    api.updateProfile(data.profile).catch(() => {});
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Header / Navigation */}
      <Navbar
        profile={profile}
        activeSection={activeSection}
        onOpenEdit={() => setIsEditModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        unreadInquiriesCount={unreadInquiriesCount}
      />

      {/* 2. Main Portfolio Body */}
      <main className="flex-1">
        <DeveloperPortfolio
          profile={profile}
          projects={projects}
          experiences={experiences}
          skills={skills}
          onOpenEdit={() => setIsEditModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          unreadInquiriesCount={unreadInquiriesCount}
        />
      </main>

      {/* 3. Clean Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4 text-xs font-mono text-zinc-500">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <img 
                src="/logo.jpg" 
                alt="Maaz Nadeem Logo" 
                className="w-5 h-5 rounded-md object-cover border border-emerald-500/30 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-zinc-200 font-bold">{profile.name}</span>
              <span className="text-zinc-400">• Full-Stack Developer</span>
            </div>
            <div className="text-zinc-500 text-[11px] flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-3 h-3 text-emerald-500" />
              <span>{profile.location}</span>
              <span>• University of Wah (BS CS)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Mode</span>
              {unreadInquiriesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                  {unreadInquiriesCount}
                </span>
              )}
            </button>
            <span>•</span>
            <a 
              href="https://github.com/Maazawan982" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/maaz-nadeem-56428030a" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a 
              href="mailto:maazawan2468@gmail.com" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>

          <div className="text-zinc-600 text-[11px]">
            © {new Date().getFullYear()} Maaz Nadeem. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 shadow-xl transition-all duration-200 z-40"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        projects={projects}
        experiences={experiences}
        skills={skills}
        onSave={handleSaveData}
        onResetDefault={handleResetToDefault}
      />

      {/* Admin Mode: Inquiries & Responses Modal */}
      <AdminInquiriesModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        username="Maazawan982"
        onInquiryCountChange={setUnreadInquiriesCount}
      />
    </div>
  );
}
