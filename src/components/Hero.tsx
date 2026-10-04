import { useRef, useState } from 'react';
import { Clock, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';

interface HeroProps {
  featuredArticle: ArticleWithAuthor;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onReadArticle: (id: string) => void;
}

export function Hero({ featuredArticle, isBookmarked, onToggleBookmark, onReadArticle }: HeroProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ rx: -dy * 6, ry: dx * 6 });
  };

  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              CONTENT ENGINE & DYNAMIC LEARNING HUB
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
            Insights on{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              AI Engineering
            </span>
            ,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Autonomous Systems
            </span>{' '}
            & Web Architecture
          </h1>
          <p className="mt-6 text-base text-gray-400 leading-relaxed">
            Deep technical articles, curated learning tracks, and real-world engineering insights
            from practitioners building the next generation of software systems.
          </p>
        </div>

        {/* Featured Spotlight */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
            Featured Article of the Week
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d',
          }}
          className="relative group cursor-pointer transition-transform duration-300 ease-out"
          onClick={() => onReadArticle(featuredArticle.id)}
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl shadow-2xl shadow-black/40">
            {/* Cover image */}
            <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
              {featuredArticle.cover_url && (
                <img
                  src={featuredArticle.cover_url}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/60 to-transparent" />

              {/* Reading time badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.08]">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-xs font-medium text-white">
                  {featuredArticle.reading_time_minutes} min read
                </span>
              </div>

              {/* Bookmark */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(featuredArticle.id);
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.08] text-white hover:bg-black/60 transition-all duration-200"
                aria-label="Toggle bookmark"
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  style={{ color: isBookmarked ? '#a78bfa' : 'white' }}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                {featuredArticle.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2">
                {featuredArticle.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredArticle.author.avatar_url}
                    alt={featuredArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/[0.08]"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {featuredArticle.author.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(featuredArticle.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-300 group-hover:gap-3 transition-all duration-200">
                  <span className="text-sm font-medium">Read now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Glow border on hover */}
            <div className="absolute inset-0 rounded-3xl border border-indigo-400/0 group-hover:border-indigo-400/20 transition-colors duration-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
