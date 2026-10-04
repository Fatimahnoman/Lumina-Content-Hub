import { GraduationCap, ArrowRight, Clock, BookOpen } from 'lucide-react';
import type { ArticleWithAuthor } from '@/lib/supabase';

interface LearningTracksProps {
  articles: ArticleWithAuthor[];
  onReadArticle: (id: string) => void;
}

interface Track {
  title: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    title: 'AI Engineering Fundamentals',
    description: 'Master the core concepts of building AI-powered systems — from model training to production deployment.',
    category: 'AI & ML',
    tags: ['AI & ML'],
    icon: 'brain',
    color: 'from-indigo-500/20 to-purple-500/10',
  },
  {
    title: 'Modern Web Architecture',
    description: 'Learn how to design scalable, edge-first web applications with real-time capabilities.',
    category: 'Architecture',
    tags: ['Architecture', 'Full-Stack'],
    icon: 'layers',
    color: 'from-purple-500/20 to-indigo-500/10',
  },
  {
    title: 'Design Systems & UI Engineering',
    description: 'Build accessible, beautiful interfaces with systematic design thinking.',
    category: 'UI/UX Design',
    tags: ['UI/UX Design'],
    icon: 'palette',
    color: 'from-indigo-500/20 to-purple-500/10',
  },
];

export function LearningTracks({ articles, onReadArticle }: LearningTracksProps) {
  return (
    <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 text-indigo-300" />
          <h1 className="text-2xl font-bold text-white">Learning Tracks</h1>
        </div>
        <p className="text-sm text-gray-400 mb-8">
          Structured learning paths that guide you from fundamentals to mastery.
        </p>

        <div className="space-y-6">
          {TRACKS.map((track, trackIdx) => {
            const trackArticles = articles.filter((a) =>
              track.tags.some((t) => a.tags.includes(t))
            );
            const totalMinutes = trackArticles.reduce((sum, a) => sum + a.reading_time_minutes, 0);

            return (
              <div
                key={track.title}
                className={`relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br ${track.color} p-6`}
              >
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-300 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                        Track {trackIdx + 1}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {trackArticles.length} lessons
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalMinutes} min total
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">{track.title}</h2>
                    <p className="text-sm text-gray-400 max-w-2xl">{track.description}</p>
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  {trackArticles.map((art, idx) => (
                    <button
                      key={art.id}
                      onClick={() => onReadArticle(art.id)}
                      className="w-full text-left group flex items-center gap-4 px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/[0.04] hover:border-white/[0.12] hover:bg-black/30 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate group-hover:text-indigo-200 transition-colors">
                          {art.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{art.author.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {art.reading_time_minutes} min
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
