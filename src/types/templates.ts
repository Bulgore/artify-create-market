
export interface ProductTemplate {
  id: string;
  // Nouveaux champs multilingues
  name_fr?: string;
  name_en?: string | null;
  name_ty?: string | null;
  technical_instructions_fr?: string | null;
  technical_instructions_en?: string | null;
  technical_instructions_ty?: string | null;
  // Anciens champs pour compatibilité (optionnels avec fallback)
  name?: string;
  technical_instructions?: string | null;
  type: string;
  available_positions: string[];
  available_colors: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  primary_mockup_id?: string;
}

export interface ProductMockup {
  id: string;
  product_template_id: string;
  mockup_url: string;
  mockup_name: string;
  display_order: number;
  is_primary: boolean;
  print_area: any;
  has_print_area: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateFormData {
  name: string;
  type: string;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
}

export const DEFAULT_TEMPLATE_FORM_DATA: TemplateFormData = {
  name: '',
  type: '',
  available_positions: ['face'],
  available_colors: ['white', 'black'],
  technical_instructions: '',
  is_active: true
};

// Fonction utilitaire pour mapper les templates avec compatibilité
export const mapTemplateWithCompatibility = (template: any): ProductTemplate => ({
  ...template,
  name: template.name ?? template.name_fr ?? '',
  technical_instructions: template.technical_instructions ?? template.technical_instructions_fr ?? ''
});
