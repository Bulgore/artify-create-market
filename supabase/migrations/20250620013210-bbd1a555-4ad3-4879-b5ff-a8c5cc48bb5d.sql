
-- Création de la nouvelle table pour les mockups multiples par produit
CREATE TABLE public.product_mockups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_template_id UUID NOT NULL REFERENCES public.product_templates(id) ON DELETE CASCADE,
  mockup_url TEXT NOT NULL,
  mockup_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  print_area JSONB NULL, -- Position et dimensions de la zone d'impression sur ce mockup spécifique
  has_print_area BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_product_mockups_template_id ON public.product_mockups(product_template_id);
CREATE INDEX idx_product_mockups_display_order ON public.product_mockups(product_template_id, display_order);

-- Trigger pour la mise à jour automatique de updated_at
CREATE TRIGGER update_product_mockups_updated_at
  BEFORE UPDATE ON public.product_mockups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Suppression des champs obsolètes dans product_templates
ALTER TABLE public.product_templates 
  DROP COLUMN IF EXISTS svg_file_url,
  DROP COLUMN IF EXISTS design_area,
  DROP COLUMN IF EXISTS mockup_area;

-- Ajout d'un champ pour le mockup principal
ALTER TABLE public.product_templates 
  ADD COLUMN IF NOT EXISTS primary_mockup_id UUID REFERENCES public.product_mockups(id);

-- Modification de creator_products pour supporter les nouveaux aperçus
ALTER TABLE public.creator_products 
  ADD COLUMN IF NOT EXISTS generated_mockups JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS original_design_url TEXT,
  ADD COLUMN IF NOT EXISTS design_file_info JSONB DEFAULT '{}'::jsonb;

-- Table pour tracer les emails envoyés aux imprimeurs
CREATE TABLE IF NOT EXISTS public.printer_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  creator_product_id UUID NOT NULL REFERENCES public.creator_products(id),
  printer_email TEXT NOT NULL,
  email_subject TEXT NOT NULL,
  email_content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT DEFAULT 'sent'
);

-- RLS pour product_mockups - lecture publique, écriture admin/superadmin seulement
ALTER TABLE public.product_mockups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product mockups" 
  ON public.product_mockups 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can modify product mockups" 
  ON public.product_mockups 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'admin' OR users.is_super_admin = true)
    )
  );

-- RLS pour printer_emails - accès superadmin seulement
ALTER TABLE public.printer_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can access printer emails" 
  ON public.printer_emails 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.is_super_admin = true
    )
  );
