import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  Bookmark,
  Share2,
  ListOrdered,
  ChevronRight,
} from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';
import type { ReaderPrefs } from '@/lib/hooks';

interface ArticleReaderProps {
  article: ArticleWithAuthor;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onBack: () => void;
  onReadArticle: (id: string) => void;
  allArticles: ArticleWithAuthor[];
  prefs: ReaderPrefs;
}

export function ArticleReader({
  article,
  isBookmarked,
  onToggleBookmark,
  onBack,
  onReadArticle,
  allArticles,
  prefs,
}: ArticleReaderProps) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [shareToast, setShareToast] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [article.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    article.content.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [article]);

  const relatedArticles = useMemo(() => {
    return allArticles
      .filter((a) => a.id !== article.id && a.tags.some((t) => article.tags.includes(t)))
      .slice(0, 4);
  }, [allArticles, article]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(article.title).catch(() => {});
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const fontClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[prefs.fontSize];

  const contrastClass = prefs.highContrast
    ? 'bg-[#000000] text-gray-100'
    : 'bg-[#0D1220] text-gray-300';

  return (
    <article className="min-h-screen pt-20">
      {/* Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-0.5 bg-white/[0.04] z-40">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hero cover */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        {article.cover_url && (
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/40 via-[#090D16]/60 to-[#090D16]" />
      </div>

      {/* Content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </button>

        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-3xl">
            {/* Title block */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                {article.title}
              </h1>
              <p className="text-base text-gray-400 leading-relaxed mb-6">
                {article.summary}
              </p>

              {/* Author + meta */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <img
                    src={article.author.avatar_url}
                    alt={article.author.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/[0.08]"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{article.author.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(article.published_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <Clock className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="text-xs text-gray-400">{article.reading_time_minutes} min read</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    aria-label="Share article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleBookmark(article.id)}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] transition-all duration-200"
                    style={{
                      color: isBookmarked ? '#a78bfa' : '#9ca3af',
                      borderColor: isBookmarked ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.06)',
                    }}
                    aria-label="Toggle bookmark"
                  >
                    <Bookmark
                      className="w-4 h-4"
                      fill={isBookmarked ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Article body */}
            <div className={`rounded-2xl border border-white/[0.06] p-6 sm:p-10 ${contrastClass}`}>
              {article.content.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className="mb-10 last:mb-0 scroll-mt-24"
                >
                  <h2 className={`font-bold text-white mb-4 ${
                    prefs.fontSize === 'large' ? 'text-2xl' : prefs.fontSize === 'small' ? 'text-lg' : 'text-xl'
                  }`}>
                    {section.heading}
                  </h2>
                  <p className={`leading-[1.8] ${fontClass} ${prefs.highContrast ? 'text-gray-100' : 'text-gray-300'}`}>
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            {/* Author bio card */}
            <div className="mt-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6">
              <div className="flex items-start gap-4">
                <img
                  src={article.author.avatar_url}
                  alt={article.author.name}
                  className="w-16 h-16 rounded-full object-cover border border-white/[0.08] flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {article.author.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">
                    {article.author.bio}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">
                      {allArticles.filter((a) => a.author_id === article.author_id).length} articles published
                    </span>
                    {article.author.social_twitter && (
                      <span className="text-indigo-300">@{article.author.social_twitter}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TOC sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-500 tracking-widest uppercase">
                <ListOrdered className="w-4 h-4" />
                Table of Contents
              </div>
              <nav className="space-y-1">
                {article.content.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-start gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeSection === section.id
                        ? 'text-indigo-300 bg-indigo-500/10 border-l-2 border-indigo-400'
                        : 'text-gray-500 hover:text-gray-300 border-l-2 border-transparent'
                    }`}
                  >
                    <span className="text-xs text-gray-600 mt-0.5">{idx + 1}</span>
                    <span className="leading-snug">{section.heading}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="text-xs text-gray-500 mb-2">Reading progress</div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">{Math.round(progress)}% complete</div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pb-20">
            <h2 className="text-xl font-bold text-white mb-6">Related Articles</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
              {relatedArticles.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onReadArticle(rel.id)}
                  className="group flex-shrink-0 w-72 text-left rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="relative h-36 overflow-hidden">
                    {rel.cover_url && (
                      <img
                        src={rel.cover_url}
                        alt={rel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {rel.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                      {rel.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{rel.author.name}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {rel.reading_time_minutes} min
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share toast */}
      {shareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl bg-indigo-500/20 backdrop-blur-xl border border-indigo-500/30 text-sm text-white z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          Article title copied to clipboard
        </div>
      )}
    </article>
  );
}
