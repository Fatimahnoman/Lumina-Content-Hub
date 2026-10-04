import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lumina-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarks((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  }, []);

  const isBookmarked = useCallback(
    (articleId: string) => bookmarks.includes(articleId),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}

const PREFS_KEY = 'lumina-reader-prefs';

export interface ReaderPrefs {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
}

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      return stored ? (JSON.parse(stored) as ReaderPrefs) : { fontSize: 'medium', highContrast: false };
    } catch {
      return { fontSize: 'medium', highContrast: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  const setFontSize = useCallback((fontSize: ReaderPrefs['fontSize']) => {
    setPrefs((prev) => ({ ...prev, fontSize }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setPrefs((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  return { prefs, setFontSize, toggleHighContrast };
}
