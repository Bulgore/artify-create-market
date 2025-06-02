
export interface ReusableBlock {
  id: string;
  title: string;
  type: 'hero' | 'banner' | 'text' | 'image' | 'slider' | 'testimonials' | 'cta';
  content: any;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
  display_order: number;
  is_active: boolean;
  visibility: 'public' | 'authenticated' | 'guests';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReusableBlockData {
  title: string;
  type: 'hero' | 'banner' | 'text' | 'image' | 'slider' | 'testimonials' | 'cta';
  content: any;
  image_url?: string;
  link_url?: string;
  button_text?: string;
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
  display_order: number;
  is_active: boolean;
  visibility: 'public' | 'authenticated' | 'guests';
}
