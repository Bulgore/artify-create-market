
-- Créer le bucket designs s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('designs', 'designs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Supprimer les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Anyone can view design files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their design files" ON storage.objects;

-- Créer les nouvelles politiques pour le bucket designs
CREATE POLICY "Public access for design files" ON storage.objects
FOR SELECT USING (bucket_id = 'designs');

CREATE POLICY "Authenticated users can upload design files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'designs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own design files" ON storage.objects
FOR UPDATE USING (bucket_id = 'designs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own design files" ON storage.objects
FOR DELETE USING (bucket_id = 'designs' AND auth.uid()::text = (storage.foldername(name))[1]);
