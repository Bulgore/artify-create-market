-- Création table des imprimeurs
CREATE TABLE IF NOT EXISTS public.printers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  specialties TEXT[],
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table de liaison gabarit -> imprimeur
CREATE TABLE IF NOT EXISTS public.template_printers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.product_templates(id) ON DELETE CASCADE,
  printer_id UUID NOT NULL REFERENCES public.printers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS template_printers_template_key ON public.template_printers(template_id);
CREATE INDEX IF NOT EXISTS template_printers_printer_idx ON public.template_printers(printer_id);

ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Printers read" ON public.printers FOR SELECT USING (true);
CREATE POLICY "Admins manage printers" ON public.printers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND (role = 'admin' OR is_super_admin = true))
);

ALTER TABLE public.template_printers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mapping read" ON public.template_printers FOR SELECT USING (true);
CREATE POLICY "Admins manage mapping" ON public.template_printers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND (role = 'admin' OR is_super_admin = true))
);
