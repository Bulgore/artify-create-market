export interface GeneratedMockup {
  url: string;
  [key: string]: any;
}

export interface DesignFileInfo {
  uploadedAt: string;
  fileType: string;
  autoPositioned?: boolean;
  [key: string]: any;
}

export interface CreatorProduct {
  id: string;
  name_fr: string;
  description_fr: string | null;
  preview_url?: string | null;
  generated_mockups?: GeneratedMockup[];
  original_design_url?: string | null;
  design_file_info?: DesignFileInfo | null;
  status?: string;
  creator_id?: string;
  created_at?: string;
  users?: {
    full_name_fr: string;
    email: string;
  };
}
