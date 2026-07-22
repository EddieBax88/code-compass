-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Articles table for NEC content with vector embeddings
CREATE TABLE public.articles (
  id BIGSERIAL PRIMARY KEY,
  article_reference TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for vector similarity search
CREATE INDEX ON public.articles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.articles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO service_role;

CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
