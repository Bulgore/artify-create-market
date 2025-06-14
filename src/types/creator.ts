
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
  // Email maintenant synchronisé depuis auth.users via trigger
  email: string;
  // Nouveaux champs multilingues
  full_name_fr?: string | null;
  full_name_en?: string | null;
  full_name_ty?: string | null;
  bio_fr?: string | null;
  bio_en?: string | null;
  bio_ty?: string | null;
  // Anciens champs pour compatibilité (toujours présents)
  full_name: string;
  bio: string;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  default_commission: number;
  avatar_url: string | null;
  is_public_profile: boolean;
  website_url: string | null;
  social_links: any;
  is_active?: boolean;
  creator_status?: string;
  creator_level?: string;
  products_count?: number;
  onboarding_completed?: boolean;
  banner_url?: string | null;
  keywords?: string[];
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  rejection_reason?: string | null;
}

// Fonction utilitaire pour mapper les utilisateurs avec compatibilité
export const mapUserWithCompatibility = (user: any): User => ({
  ...user,
  full_name: user.full_name ?? user.full_name_fr ?? '',
  bio: user.bio ?? user.bio_fr ?? '',
  email: user.email || 'Email non disponible' // Fallback au cas où
});
