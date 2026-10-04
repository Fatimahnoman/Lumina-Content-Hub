import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Settings, BookOpen, GraduationCap, Users, Hash, X, Sparkles } from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';

interface NavbarProps {
  articles: ArticleWithAuthor[];
  onNavigate: (view: string) => void;
  onOpenPrefs: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  currentView: string;
}

export function Navbar({ articles, onNavigate, onOpenPrefs, onSearch, searchQuery, currentView }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.summary.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, articles]);

  const navLinks = [
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'tracks', label: 'Learning Tracks', icon: GraduationCap },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'topics', label: 'Topics', icon: Hash },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#090D16]/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="text-lg font-bold tracking-wider text-white">
              LUMINA
            </span>
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-white/[0.08]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Search + Settings */}
          <div className="flex items-center gap-3">
            <div ref={searchRef} className="relative">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
                  searchFocused
                    ? 'border-indigo-400/40 bg-white/[0.06] w-56 sm:w-72'
                    : 'border-white/[0.06] bg-white/[0.03] w-44 sm:w-56'
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search articles..."
                  className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      onSearch('');
                      setShowSuggestions(false);
                    }}
                    className="text-gray-400 hover:text-white flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#0D1220]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                  {suggestions.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => {
                        onNavigate(`article:${article.id}`);
                        setShowSuggestions(false);
                        onSearch('');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/[0.04] transition-colors flex items-start gap-3 border-b border-white/[0.04] last:border-0"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {article.author.name} · {article.reading_time_minutes} min read
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenPrefs}
              className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              aria-label="Reader preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
