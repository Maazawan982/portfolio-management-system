import React, { useState, useEffect } from 'react';
import { Search, Users, ExternalLink, Code2, Heart, Eye, ArrowRight, Sparkles, Filter, Terminal } from 'lucide-react';
import { api } from '../lib/api';

interface DirectoryViewProps {
  onNavigate: (route: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  onNavigate,
  onOpenAuth
}) => {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const popularTags = ['TypeScript', 'React', 'Go', 'Kubernetes', 'Node.js', 'Python', 'Tailwind CSS'];

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const data = await api.getPortfolios(search, selectedTag);
      setPortfolios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPortfolios();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedTag]);

  return (
    <div className="min-h-screen pb-20 text-zinc-200">
      {/* Hero / System Overview */}
      <section className="relative border-b border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 px-4 sm:px-6 py-12 sm:py-16 developer-grid">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Portfolio Management System Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight font-mono">
            Full-Stack Developer <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Portfolio Ecosystem
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Dynamic username-based routing, RESTful APIs, creator dashboard, and lightweight public profile showcases designed with developer craftsmanship.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-create-btn"
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-medium text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <span>Build & Claim Your Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="hero-explore-demo-btn"
              onClick={() => onNavigate('/portfolio/alexdev')}
              className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono transition-colors flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Explore @alexdev Showcase</span>
            </button>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              id="directory-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, handle, role, or stack..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          {/* Quick Tag Filters */}
          <div className="flex flex-wrap gap-1.5 items-center font-mono text-xs">
            <span className="text-[11px] text-zinc-500 hidden sm:inline mr-1">Filter tag:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedTag === '' 
                  ? 'bg-emerald-500 text-zinc-950 font-semibold' 
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedTag === tag
                    ? 'bg-emerald-500 text-zinc-950 font-semibold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolios Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-mono text-xs text-zinc-500">Querying developer database...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-12 text-center">
            <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold font-mono text-zinc-200 mb-1">No developer portfolios found</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Try adjusting your search criteria or register a new developer handle.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedTag(''); }}
              className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-200 text-xs font-mono hover:bg-zinc-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolios.map((item) => (
              <div
                key={item.username}
                className="rounded-xl bg-zinc-900/70 border border-zinc-800/90 hover:border-zinc-700 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatarUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </h3>
                        <div className="text-xs font-mono text-emerald-400">
                          @{item.username}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-zinc-300 mb-2 line-clamp-1">
                    {item.headline}
                  </p>

                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                    {item.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.topSkills.map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Featured project highlight */}
                  {item.featuredProject && (
                    <div className="rounded-lg bg-zinc-950 p-2.5 border border-zinc-800/80 mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mb-1">
                        <Code2 className="w-3 h-3 text-emerald-400" />
                        <span>Featured: {item.featuredProject.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {item.featuredProject.tagline}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {item.stats?.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500/80" />
                      {item.stats?.likes || 0}
                    </span>
                  </div>

                  <button
                    id={`view-portfolio-${item.username}-btn`}
                    onClick={() => onNavigate(`/portfolio/${item.username}`)}
                    className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 transition-colors flex items-center gap-1 font-mono text-xs"
                  >
                    <span>View Portfolio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
