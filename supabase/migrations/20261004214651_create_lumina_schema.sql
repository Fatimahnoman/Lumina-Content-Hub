/*
# LUMINA Blog Schema — Single-tenant (no auth)

1. New Tables
- `authors` — author profiles with avatar, bio, and social handles
- `articles` — blog posts with title, summary, content, tags, reading time, author reference
- `subscriptions` — newsletter email sign-ups

2. Security
- RLS enabled on all tables.
- anon + authenticated CRUD on all tables (intentionally public content, no sign-in).
- Subscriptions table allows public INSERT (anyone can subscribe) and public SELECT.

3. Notes
- Articles store content as structured JSON (array of section objects with heading + body) for flexible rendering and TOC generation.
- Tags are stored as a text[] array for efficient filtering.
*/

CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text NOT NULL,
  bio text NOT NULL,
  social_twitter text,
  social_github text,
  social_linkedin text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_authors" ON authors;
CREATE POLICY "anon_read_authors" ON authors FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_authors" ON authors;
CREATE POLICY "anon_insert_authors" ON authors FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_authors" ON authors;
CREATE POLICY "anon_update_authors" ON authors FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_authors" ON authors;
CREATE POLICY "anon_delete_authors" ON authors FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content jsonb NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  reading_time_minutes int NOT NULL DEFAULT 5,
  cover_url text,
  author_id uuid NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  featured boolean NOT NULL DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_articles" ON articles;
CREATE POLICY "anon_read_articles" ON articles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_articles" ON articles;
CREATE POLICY "anon_insert_articles" ON articles FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_articles" ON articles;
CREATE POLICY "anon_update_articles" ON articles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_articles" ON articles;
CREATE POLICY "anon_delete_articles" ON articles FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_subscriptions" ON subscriptions;
CREATE POLICY "anon_read_subscriptions" ON subscriptions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_subscriptions" ON subscriptions;
CREATE POLICY "anon_insert_subscriptions" ON subscriptions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_subscriptions" ON subscriptions;
CREATE POLICY "anon_update_subscriptions" ON articles FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_subscriptions" ON subscriptions;
CREATE POLICY "anon_delete_subscriptions" ON subscriptions FOR DELETE
TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);