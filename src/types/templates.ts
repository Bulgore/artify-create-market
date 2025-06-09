
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
  svg_file_url: string;
  mockup_image_url: string;
  design_area: any;
  mockup_area?: any;
  available_positions: string[];
  available_colors: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export interface TemplateFormData {
  name: string;
  type: string;
  svg_file_url: string;
  mockup_image_url: string;
  design_area: { x: number; y: number; width: number; height: number };
  mockup_area?: { x: number; y: number; width: number; height: number };
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
}

export const DEFAULT_TEMPLATE_FORM_DATA: TemplateFormData = {
  name: '',
  type: '',
  svg_file_url: '',
  mockup_image_url: '',
  design_area: { x: 0, y: 0, width: 200, height: 200 },
  mockup_area: { x: 50, y: 50, width: 200, height: 200 },
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
