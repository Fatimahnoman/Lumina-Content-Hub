import { Twitter, Github, Linkedin, BookOpen } from 'lucide-react';
import type { Author, ArticleWithAuthor } from '@/lib/supabase';

interface AuthorsViewProps {
  authors: Author[];
  articles: ArticleWithAuthor[];
  onReadArticle: (id: string) => void;
}

export function AuthorsView({ authors, articles, onReadArticle }: AuthorsViewProps) {
  return (
    <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Authors</h1>
        <p className="text-sm text-gray-400 mb-8">
          Meet the engineers and designers behind the articles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {authors.map((author) => {
            const authorArticles = articles.filter((a) => a.author_id === author.id);
            return (
              <div
                key={author.id}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={author.avatar_url}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover border border-white/[0.08] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-white">{author.name}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed mt-1">{author.bio}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <BookOpen className="w-3.5 h-3.5" />
                      {authorArticles.length} articles
                    </div>
                    <div className="flex items-center gap-2">
                      {author.social_twitter && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Twitter className="w-3.5 h-3.5" />
                          @{author.social_twitter}
                        </span>
                      )}
                      {author.social_github && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Github className="w-3.5 h-3.5" />
                          {author.social_github}
                        </span>
                      )}
                      {author.social_linkedin && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Linkedin className="w-3.5 h-3.5" />
                          {author.social_linkedin}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Author's articles */}
                {authorArticles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {authorArticles.slice(0, 3).map((art) => (
                      <button
                        key={art.id}
                        onClick={() => onReadArticle(art.id)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm text-gray-400 hover:text-white truncate"
                      >
                        {art.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
