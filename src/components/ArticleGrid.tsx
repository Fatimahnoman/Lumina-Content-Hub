import { useMemo } from 'react';
import { Clock, Bookmark, ArrowRight } from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';

interface ArticleGridProps {
  articles: ArticleWithAuthor[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onReadArticle: (id: string) => void;
  searchQuery: string;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

const TAGS = ['AI & ML', 'Full-Stack', 'Architecture', 'UI/UX Design'];

export function ArticleGrid({
  articles,
  isBookmarked,
  onToggleBookmark,
  onReadArticle,
  searchQuery,
  activeTag,
  onTagChange,
}: ArticleGridProps) {
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (activeTag && !a.tags.includes(activeTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.summary.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [articles, activeTag, searchQuery]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Latest Articles</h2>
          <span className="text-sm text-gray-500">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => onTagChange(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTag === null
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            All
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Article cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isBookmarked={isBookmarked(article.id)}
                onToggleBookmark={onToggleBookmark}
                onReadArticle={onReadArticle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface ArticleCardProps {
  article: ArticleWithAuthor;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onReadArticle: (id: string) => void;
}

function ArticleCard({ article, isBookmarked, onToggleBookmark, onReadArticle }: ArticleCardProps) {
  return (
    <article
      className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
      onClick={() => onReadArticle(article.id)}
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        {article.cover_url && (
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1220] via-[#0D1220]/30 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06]">
          <Clock className="w-3 h-3 text-indigo-300" />
          <span className="text-xs font-medium text-white">{article.reading_time_minutes} min</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/[0.06] text-white hover:bg-black/60 transition-all duration-200"
          aria-label="Toggle bookmark"
        >
          <Bookmark
            className="w-3.5 h-3.5"
            fill={isBookmarked ? 'currentColor' : 'none'}
            style={{ color: isBookmarked ? '#a78bfa' : 'white' }}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/15"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-base font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-indigo-200 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar_url}
              alt={article.author.name}
              className="w-7 h-7 rounded-full object-cover border border-white/[0.06]"
            />
            <span className="text-xs text-gray-400">{article.author.name}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </article>
  );
}
