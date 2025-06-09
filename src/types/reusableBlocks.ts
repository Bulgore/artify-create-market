
export interface ReusableBlock {
  id: string;
  // Nouveaux champs multilingues
  title_fr?: string;
  title_en?: string | null;
  title_ty?: string | null;
  button_text_fr?: string;
  button_text_en?: string | null;
  button_text_ty?: string | null;
  // Anciens champs pour compatibilité (toujours présents)
  title?: string;
  button_text?: string;
  type: 'hero' | 'banner' | 'text' | 'image' | 'slider' | 'testimonials' | 'cta';
  content: any;
  image_url?: string;
  link_url?: string;
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
  display_order: number;
  is_active: boolean;
  visibility: 'public' | 'authenticated' | 'guests';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReusableBlockData {
  title_fr: string;
  title_en?: string;
  title_ty?: string;
  type: 'hero' | 'banner' | 'text' | 'image' | 'slider' | 'testimonials' | 'cta';
  content: any;
  image_url?: string;
  link_url?: string;
  button_text_fr?: string;
  button_text_en?: string;
  button_text_ty?: string;
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
  display_order: number;
  is_active: boolean;
  visibility: 'public' | 'authenticated' | 'guests';
}

// Fonction utilitaire pour mapper les blocs avec compatibilité
export const mapReusableBlockWithCompatibility = (block: any): ReusableBlock => ({
  ...block,
  title: block.title ?? block.title_fr ?? '',
  button_text: block.button_text ?? block.button_text_fr ?? ''
});
