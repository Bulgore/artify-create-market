
-- Créer les buckets storage s'ils n'existent pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mockups', 'mockups', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('templates', 'templates', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le bucket mockups
CREATE POLICY "Anyone can view mockup files" ON storage.objects
FOR SELECT USING (bucket_id = 'mockups');

CREATE POLICY "Authenticated users can upload mockup files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'mockups' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their mockup files" ON storage.objects
FOR UPDATE USING (bucket_id = 'mockups' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their mockup files" ON storage.objects
FOR DELETE USING (bucket_id = 'mockups' AND auth.role() = 'authenticated');

-- Policies pour le bucket templates
CREATE POLICY "Anyone can view template files" ON storage.objects
FOR SELECT USING (bucket_id = 'templates');

CREATE POLICY "Authenticated users can upload template files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'templates' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their template files" ON storage.objects
FOR UPDATE USING (bucket_id = 'templates' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their template files" ON storage.objects
FOR DELETE USING (bucket_id = 'templates' AND auth.role() = 'authenticated');

-- Policies pour product_templates (lecture publique, écriture admin)
DROP POLICY IF EXISTS "Anyone can view product templates" ON public.product_templates;
DROP POLICY IF EXISTS "Only admins can modify product templates" ON public.product_templates;

CREATE POLICY "Anyone can view product templates" ON public.product_templates
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify product templates" ON public.product_templates
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND (users.role = 'admin' OR users.is_super_admin = true)
  )
);

-- Policies pour printers
DROP POLICY IF EXISTS "Printers read" ON public.printers;
DROP POLICY IF EXISTS "Admins manage printers" ON public.printers;

CREATE POLICY "Anyone can view printers" ON public.printers
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify printers" ON public.printers
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND (users.role = 'admin' OR users.is_super_admin = true)
  )
);

-- Policies pour template_printers
DROP POLICY IF EXISTS "Mapping read" ON public.template_printers;
DROP POLICY IF EXISTS "Admins manage mapping" ON public.template_printers;

CREATE POLICY "Anyone can view template printer mapping" ON public.template_printers
FOR SELECT USING (true);

CREATE POLICY "Only admins can modify template printer mapping" ON public.template_printers
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND (users.role = 'admin' OR users.is_super_admin = true)
  )
);
