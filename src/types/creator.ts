
export type CreatorStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type CreatorLevel = 'debutant' | 'confirme' | 'premium';

export interface CreatorFormData {
  full_name: string;
  role: string;
  bio: string;
  is_public_profile: boolean;
  website_url: string;
  default_commission: number;
  is_super_admin: boolean;
  creator_status: CreatorStatus;
  creator_level: CreatorLevel;
}

export interface User {
  id: string;
  full_name: string | null;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  default_commission: number;
  avatar_url: string | null;
  bio: string | null;
  is_public_profile: boolean;
  website_url: string | null;
  social_links: any;
  email?: string;
  is_active?: boolean;
  creator_status?: string;
  creator_level?: string;
  products_count?: number;
  onboarding_completed?: boolean;
}
