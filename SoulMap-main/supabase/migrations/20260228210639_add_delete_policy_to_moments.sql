/*
  # Add Delete Policy to Moments Table

  ## Summary
  Allows anyone to delete moments from the moments table.

  ## Changes
  - Adds a DELETE policy for anonymous users to delete moments

  ## Security
  - Policy allows public deletion access (matching the public nature of the app)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'moments' 
    AND policyname = 'Anyone can delete moments'
  ) THEN
    CREATE POLICY "Anyone can delete moments"
      ON moments
      FOR DELETE
      TO anon
      USING (true);
  END IF;
END $$;