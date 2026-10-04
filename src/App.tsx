import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ArticleWithAuthor, Author } from '@/lib/supabase';
import { useBookmarks, useReaderPrefs } from '@/lib/hooks';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ArticleGrid } from '@/components/ArticleGrid';
import { ArticleReader } from '@/components/ArticleReader';
import { PreferencesModal } from '@/components/PreferencesModal';
import { NewsletterWidget } from '@/components/NewsletterWidget';
import { AuthorsView } from '@/components/AuthorsView';
import { TopicsView } from '@/components/TopicsView';
import { LearningTracks } from '@/components/LearningTracks';

function App() {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showPrefs, setShowPrefs] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { prefs, setFontSize, toggleHighContrast } = useReaderPrefs();

  const fetchData = useCallback(async () => {
    const [articlesRes, authorsRes] = await Promise.all([
      supabase
        .from('articles')
        .select('*, author:authors(*)')
        .order('published_at', { ascending: false }),
      supabase.from('authors').select('*'),
    ]);

    if (articlesRes.data) setArticles(articlesRes.data as ArticleWithAuthor[]);
    if (authorsRes.data) setAuthors(authorsRes.data as Author[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNavigate = (view: string) => {
    if (view.startsWith('article:')) {
      setCurrentView(view);
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReadArticle = (id: string) => {
    setCurrentView(`article:${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentView('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse" />
          <p className="text-sm text-gray-500">Loading LUMINA...</p>
        </div>
      </div>
    );
  }

  const featuredArticle = articles.find((a) => a.featured) ?? articles[0];
  const isArticleView = currentView.startsWith('article:');
  const articleId = isArticleView ? currentView.split(':')[1] : null;
  const currentArticle = articleId ? articles.find((a) => a.id === articleId) : null;

  // When search is active and we're on home, show filtered grid
  const showSearchResults = searchQuery.trim() && currentView === 'home';

  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      <Navbar
        articles={articles}
        onNavigate={handleNavigate}
        onOpenPrefs={() => setShowPrefs(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        currentView={isArticleView ? 'articles' : currentView}
      />

      {isArticleView && currentArticle ? (
        <ArticleReader
          article={currentArticle}
          isBookmarked={isBookmarked(currentArticle.id)}
          onToggleBookmark={toggleBookmark}
          onBack={handleBack}
          onReadArticle={handleReadArticle}
          allArticles={articles}
          prefs={prefs}
        />
      ) : (
        <>
          {currentView === 'home' && (
            <>
              {showSearchResults ? (
                <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-20">
                  <div className="max-w-7xl mx-auto">
                    <p className="text-sm text-gray-400 mb-6">
                      Search results for "{searchQuery}"
                    </p>
                    <ArticleGrid
                      articles={articles}
                      isBookmarked={isBookmarked}
                      onToggleBookmark={toggleBookmark}
                      onReadArticle={handleReadArticle}
                      searchQuery={searchQuery}
                      activeTag={activeTag}
                      onTagChange={setActiveTag}
                    />
                  </div>
                </section>
              ) : (
                <>
                  <Hero
                    featuredArticle={featuredArticle}
                    isBookmarked={isBookmarked(featuredArticle.id)}
                    onToggleBookmark={toggleBookmark}
                    onReadArticle={handleReadArticle}
                  />
                  <ArticleGrid
                    articles={articles}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={toggleBookmark}
                    onReadArticle={handleReadArticle}
                    searchQuery={searchQuery}
                    activeTag={activeTag}
                    onTagChange={setActiveTag}
                  />
                  <NewsletterWidget />
                </>
              )}
            </>
          )}

          {currentView === 'articles' && (
            <section className="pt-28 px-4 sm:px-6 lg:px-8 pb-20">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-2">All Articles</h1>
                <p className="text-sm text-gray-400 mb-8">
                  Browse our complete library of engineering articles.
                </p>
                <ArticleGrid
                  articles={articles}
                  isBookmarked={isBookmarked}
                  onToggleBookmark={toggleBookmark}
                  onReadArticle={handleReadArticle}
                  searchQuery={searchQuery}
                  activeTag={activeTag}
                  onTagChange={setActiveTag}
                />
                <NewsletterWidget />
              </div>
            </section>
          )}

          {currentView === 'tracks' && (
            <LearningTracks articles={articles} onReadArticle={handleReadArticle} />
          )}

          {currentView === 'authors' && (
            <AuthorsView
              authors={authors}
              articles={articles}
              onReadArticle={handleReadArticle}
            />
          )}

          {currentView === 'topics' && (
            <TopicsView articles={articles} onReadArticle={handleReadArticle} />
          )}
        </>
      )}

      {showPrefs && (
        <PreferencesModal
          prefs={prefs}
          onSetFontSize={setFontSize}
          onToggleContrast={toggleHighContrast}
          onClose={() => setShowPrefs(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">L</span>
            </div>
            <span className="text-sm font-bold text-white tracking-wider">LUMINA</span>
          </div>
          <p className="text-xs text-gray-600">
            Content Engine & Dynamic Learning Hub · Built for engineers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
