/*
  # Create moments table

  ## Summary
  Creates the core data table for the Life Moments Visualizer app.

  ## New Tables

  ### `moments`
  Stores each AI-generated life moment with its metadata.

  | Column           | Type        | Description                                    |
  |------------------|-------------|------------------------------------------------|
  | id               | uuid        | Primary key, auto-generated                    |
  | user_description | text        | The user's original description of the moment  |
  | moment_type      | text        | One of: Memory, Future Goal, Alternate Life    |
  | cinematic_style  | text        | One of: Dramatic, Dreamy, Nostalgic, Epic, Intimate |
  | image_url        | text        | URL of the DALL-E 3 generated image            |
  | created_at       | timestamptz | Timestamp of when the moment was created       |

  ## Security
  - RLS is enabled on the `moments` table
  - Public SELECT policy: anyone can read moments
  - Public INSERT policy: anyone can create moments
  - No UPDATE or DELETE policies (moments are immutable once created)

  ## Notes
  1. This is a public-facing app with no user authentication required for v1
  2. Moments are read-only after creation — no edit/delete policies added
  3. The image_url stores the DALL-E 3 CDN URL returned by the OpenAI API
*/

CREATE TABLE IF NOT EXISTS moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_description text NOT NULL,
  moment_type text NOT NULL,
  cinematic_style text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read moments"
  ON moments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert moments"
  ON moments
  FOR INSERT
  TO anon
  WITH CHECK (true);
