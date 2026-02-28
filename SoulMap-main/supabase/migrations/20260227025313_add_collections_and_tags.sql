/*
  # Add Collections and Tags Features
  
  ## Summary
  Adds the ability to organize moments into collections and tag them for better organization.
  
  ## New Tables
  
  ### `collections`
  Stores user-created collections/albums for organizing moments.
  
  | Column      | Type        | Description                           |
  |-------------|-------------|---------------------------------------|
  | id          | uuid        | Primary key, auto-generated           |
  | name        | text        | Collection name                       |
  | description | text        | Optional description                  |
  | created_at  | timestamptz | When the collection was created       |
  
  ### `moment_collections`
  Junction table linking moments to collections (many-to-many).
  
  | Column        | Type        | Description                           |
  |---------------|-------------|---------------------------------------|
  | moment_id     | uuid        | Foreign key to moments table          |
  | collection_id | uuid        | Foreign key to collections table      |
  | added_at      | timestamptz | When the moment was added             |
  
  ## Changes to Existing Tables
  
  ### `moments`
  - Add `tags` column (text array) for quick filtering
  
  ## Security
  - RLS enabled on all tables
  - Public access for reading and creating (no auth in v1)
  
  ## Notes
  1. Collections allow users to group related moments (e.g., "Summer 2023", "Career Goals")
  2. Tags provide lightweight categorization without formal collections
  3. A moment can belong to multiple collections
*/

-- Add tags column to moments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moments' AND column_name = 'tags'
  ) THEN
    ALTER TABLE moments ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create moment_collections junction table
CREATE TABLE IF NOT EXISTS moment_collections (
  moment_id uuid NOT NULL REFERENCES moments(id) ON DELETE CASCADE,
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (moment_id, collection_id)
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE moment_collections ENABLE ROW LEVEL SECURITY;

-- RLS policies for collections
CREATE POLICY "Anyone can read collections"
  ON collections
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create collections"
  ON collections
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update collections"
  ON collections
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete collections"
  ON collections
  FOR DELETE
  TO anon
  USING (true);

-- RLS policies for moment_collections
CREATE POLICY "Anyone can read moment_collections"
  ON moment_collections
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create moment_collections"
  ON moment_collections
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can delete moment_collections"
  ON moment_collections
  FOR DELETE
  TO anon
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_moment_collections_moment_id ON moment_collections(moment_id);
CREATE INDEX IF NOT EXISTS idx_moment_collections_collection_id ON moment_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_moments_tags ON moments USING gin(tags);
