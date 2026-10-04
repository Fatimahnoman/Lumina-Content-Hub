import { useMemo } from 'react';
import { Hash, ArrowRight, Clock } from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';

interface TopicsViewProps {
  articles: ArticleWithAuthor[];
  onReadArticle: (id: string) => void;
}

export function TopicsView({ articles, onReadArticle }: TopicsViewProps) {
  const topics = useMemo(() => {
    const map = new Map<string, ArticleWithAuthor[]>();
    articles.forEach((a) => {
      a.tags.forEach((tag) => {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push(a);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [articles]);

  return (
    <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Topics</h1>
        <p className="text-sm text-gray-400 mb-8">
          Browse articles by topic tag.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {topics.map(([tag, tagArticles]) => (
            <div
              key={tag}
              className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{tag}</h2>
                </div>
                <span className="text-xs text-gray-500">{tagArticles.length} articles</span>
              </div>

              <div className="space-y-2">
                {tagArticles.slice(0, 4).map((art) => (
                  <button
                    key={art.id}
                    onClick={() => onReadArticle(art.id)}
                    className="w-full text-left group flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300 group-hover:text-white truncate">
                        {art.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{art.author.name}</span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.reading_time_minutes} min
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
