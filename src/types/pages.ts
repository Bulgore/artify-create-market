
export interface PageData {
  id: string;
  // Nouveaux champs multilingues
  title_fr?: string;
  title_en?: string | null;
  title_ty?: string | null;
  content_fr?: string;
  content_en?: string | null;
  content_ty?: string | null;
  // Anciens champs pour compatibilité (toujours présents)
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  order: number;
  parent_id?: string | null;
  is_active: boolean;
}

// Fonction utilitaire pour mapper les pages avec compatibilité
export const mapPageWithCompatibility = (page: any): PageData => ({
  ...page,
  title: page.title ?? page.title_fr ?? '',
  content: page.content ?? page.content_fr ?? '',
  slug: page.slug || page.id?.toLowerCase() || '',
  updated_at: page.updated_at || page.created_at
});
