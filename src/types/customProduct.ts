import type { ProductMockup } from './templates';
export interface PrintProduct {
  id: string;
  printer_id: string;
  template_id: string | null;
  // Nouveaux champs multilingues
  name_fr?: string;
  name_en?: string | null;
  name_ty?: string | null;
  description_fr?: string | null;
  description_en?: string | null;
  description_ty?: string | null;
  // Anciens champs pour compatibilité (toujours présents)
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  print_areas: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  available_sizes: string[];
  available_colors: string[];
  images: string[];
  status?: string;
  product_templates?: ProductTemplate | null;
}

export interface ProductTemplate {
  id: string;
  // Nouveaux champs multilingues
  name_fr?: string;
  name_en?: string | null;
  name_ty?: string | null;
  technical_instructions_fr?: string | null;
  technical_instructions_en?: string | null;
  technical_instructions_ty?: string | null;
  // Anciens champs pour compatibilité (toujours présents)
  name: string;
  technical_instructions: string | null;
  type: string;
  primary_mockup_id?: string;
  product_mockups?: ProductMockup[];
  available_positions: string[];
  available_colors: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductData {
  name: string;
  description: string;
  margin_percentage: number;
}

// Fonction utilitaire pour mapper les produits avec compatibilité
export const mapPrintProductWithCompatibility = (product: any): PrintProduct => ({
  ...product,
  name: product.name ?? product.name_fr ?? '',
  description: product.description ?? product.description_fr ?? ''
});

// Fonction utilitaire pour mapper les templates avec compatibilité
export const mapTemplateWithCompatibility = (template: any): ProductTemplate => ({
  ...template,
  name: template.name ?? template.name_fr ?? '',
  technical_instructions: template.technical_instructions ?? template.technical_instructions_fr ?? ''
});
