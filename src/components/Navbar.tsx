import React, { useState } from 'react';
import { 
  Code2, 
  Menu, 
  X, 
  Sparkles, 
  SlidersHorizontal,
  Mail,
  ExternalLink,
  ShieldCheck,
  Inbox
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  onOpenEdit: () => void;
  onOpenAdmin: () => void;
  unreadInquiriesCount?: number;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenEdit,
  onOpenAdmin,
  unreadInquiriesCount = 0,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#certifications', label: 'Certifications' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleScroll = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 1. Left: Logo / Name */}
          <div className="flex items-center flex-shrink-0">
            <a 
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleScroll('#about');
              }}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-emerald-500/40 group-hover:border-emerald-400 transition-all duration-300 shadow-sm shadow-emerald-500/10 group-hover:shadow-emerald-500/20 group-hover:scale-105 flex-shrink-0 bg-zinc-900">
                <img 
                  src="/logo.jpg" 
                  alt="Maaz Nadeem Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-sm font-bold font-mono text-zinc-100 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  {profile.name || 'Maaz Nadeem'}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate max-w-[150px] sm:max-w-none">{profile.status || 'Available for hire'}</span>
                </div>
              </div>
            </a>
          </div>

          {/* 2. Center: Desktop Nav Links (Evenly Spaced & Centered) */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-xs font-mono flex-1 px-4">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll(link.href);
                  }}
                  className={`transition-colors py-1.5 px-1 relative whitespace-nowrap font-medium ${
                    isActive 
                      ? 'text-emerald-400 font-bold' 
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* 3. Right: Desktop / Tablet Action Buttons */}
          <div className="hidden md:flex items-center gap-2 xl:gap-2.5 flex-shrink-0">
            <button
              id="admin-mode-nav-btn"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap relative group shadow-sm"
              title="Admin Mode: Manage and respond to inquiries"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap font-medium">Admin Mode</span>
              {unreadInquiriesCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] font-mono leading-none flex items-center justify-center">
                  {unreadInquiriesCount}
                </span>
              ) : null}
            </button>

            <button
              id="edit-portfolio-nav-btn"
              onClick={onOpenEdit}
              className="px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 text-xs font-mono transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
              title="Customize profile and projects"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="whitespace-nowrap font-medium">Edit Profile</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScroll('#contact');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm shadow-emerald-500/10 active:scale-95"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Get in Touch</span>
            </a>
          </div>

          {/* 4. Mobile & Tablet Menu Controls (< 1024px) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Admin notification icon for mobile */}
            <button
              onClick={onOpenAdmin}
              className="md:hidden p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-emerald-400 border border-zinc-800 relative transition-colors"
              title="Admin Inquiries"
              aria-label="Admin Inquiries"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {unreadInquiriesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-bold font-mono flex items-center justify-center">
                  {unreadInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl px-4 sm:px-6 py-4 space-y-4 font-mono text-xs animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold px-2 pb-1">
              Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll(link.href);
                  }}
                  className={`py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors min-h-[44px] ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' 
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </a>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-center flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Admin Mode (Inquiries & Responses)</span>
              {unreadInquiriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px]">
                  {unreadInquiriesCount} new
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEdit();
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-center flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Edit Profile & Customize</span>
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleScroll('#contact');
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-center font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
