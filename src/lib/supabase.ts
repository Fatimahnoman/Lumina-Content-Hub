import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Author {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
  social_twitter: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  created_at: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  body: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: ArticleSection[];
  tags: string[];
  category: string;
  reading_time_minutes: number;
  cover_url: string | null;
  author_id: string;
  featured: boolean;
  published_at: string;
  created_at: string;
}

export interface ArticleWithAuthor extends Article {
  author: Author;
}

export interface Subscription {
  id: string;
  email: string;
  created_at: string;
}
