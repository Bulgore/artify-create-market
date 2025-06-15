
-- Allow ALL authenticated users to insert into creator_products (debugging purpose, insert only uses WITH CHECK)
CREATE POLICY "Debug: allow all authenticated inserts"
  ON public.creator_products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow ALL authenticated users to SELECT all creator_products (views/exports)
CREATE POLICY "Debug: allow all authenticated reads"
  ON public.creator_products
  FOR SELECT
  TO authenticated
  USING (true);

-- Make sure RLS is enabled
ALTER TABLE public.creator_products ENABLE ROW LEVEL SECURITY;
