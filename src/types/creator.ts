
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
  // Nouveaux champs multilingues
  full_name_fr?: string | null;
  full_name_en?: string | null;
  full_name_ty?: string | null;
  bio_fr?: string | null;
  bio_en?: string | null;
  bio_ty?: string | null;
  // Anciens champs pour compatibilité (mappés depuis les versions françaises)
  full_name?: string | null;
  bio?: string | null;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  default_commission: number;
  avatar_url: string | null;
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
