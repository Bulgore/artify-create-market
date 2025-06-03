
export interface ProductTemplate {
  id: string;
  name: string;
  type: string;
  svg_file_url: string;
  mockup_image_url: string;
  design_area: any;
  mockup_area?: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
  created_at: string;
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
