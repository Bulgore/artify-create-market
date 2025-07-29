
import { supabase } from '@/integrations/supabase/client';

export interface PublicCreatorProduct {
  id: string;
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
  preview_url: string | null;
  creator_margin_percentage: number;
  category: string;
  tags: string[];
  slug: string | null;
  created_at: string;
  creator: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    bio: string;
    is_public_profile: boolean;
  };
  print_product: {
    id: string;
    name: string;
    base_price: number;
    images: string[];
    material: string;
    available_sizes: string[];
    available_colors: string[];
    product_templates?: {
      id: string;
      primary_mockup_id?: string;
      product_mockups?: Array<{
        id: string;
        mockup_url: string;
        mockup_name: string;
        is_primary: boolean;
        has_print_area: boolean;
        print_area: any;
      }>;
    };
  };
  design_data?: any;
  original_design_url?: string;
  final_price?: number;
}

export interface PublicCreator {
  id: string;
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
  avatar_url: string | null;
  website_url: string | null;
  social_links: any;
  products_count: number;
  is_public_profile: boolean;
}

// Fonction utilitaire pour mapper les créateurs avec compatibilité
const mapCreatorWithCompatibility = (creator: any): PublicCreator => ({
  ...creator,
  full_name: creator.full_name ?? creator.full_name_fr ?? '',
  bio: creator.bio ?? creator.bio_fr ?? '',
  is_public_profile: creator.is_public_profile ?? false
});

// Fonction utilitaire pour mapper les produits avec compatibilité
const mapProductWithCompatibility = (product: any): PublicCreatorProduct => ({
  ...product,
  name: product.name ?? product.name_fr ?? '',
  description: product.description ?? product.description_fr ?? ''
});

export const getPublishedProducts = async (options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<PublicCreatorProduct[]> => {
  try {
    let query = supabase
      .from('creator_products')
      .select(`
        id,
        name_fr,
        name_en,
        name_ty,
        description_fr,
        description_en,
        description_ty,
        preview_url,
        creator_margin_percentage,
        category,
        tags,
        slug,
        created_at,
        creator:creator_id (
          id,
          full_name_fr,
          full_name_en,
          full_name_ty,
          bio_fr,
          bio_en,
          bio_ty,
          avatar_url,
          is_public_profile
        ),
        print_product:print_product_id (
          id,
          name_fr,
          name_en,
          name_ty,
          base_price,
          images,
          material,
          available_sizes,
          available_colors,
          product_templates:template_id (
            id,
            primary_mockup_id,
            product_mockups!product_mockups_product_template_id_fkey (
              id,
              mockup_url,
              mockup_name,
              is_primary,
              has_print_area,
              print_area
            )
          )
        ),
        design_data,
        original_design_url
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching published products:', error);
      return [];
    }

    // Calculer le prix final et mapper avec compatibilité
    return (data || []).map(product => {
      const mappedProduct = mapProductWithCompatibility(product);
      
      // Mapper le créateur avec compatibilité
      if (product.creator) {
        mappedProduct.creator = {
          id: product.creator.id,
          avatar_url: product.creator.avatar_url,
          is_public_profile: product.creator.is_public_profile,
          full_name: product.creator.full_name_fr ?? '',
          bio: product.creator.bio_fr ?? ''
        };
      }
      
      // Mapper le produit d'impression avec compatibilité
      if (product.print_product) {
        mappedProduct.print_product = {
          ...product.print_product,
          name: product.print_product.name_fr ?? '',
          product_templates: product.print_product.product_templates ? {
            id: product.print_product.product_templates.id,
            primary_mockup_id: product.print_product.product_templates.primary_mockup_id,
            product_mockups: Array.isArray(product.print_product.product_templates.product_mockups) 
              ? product.print_product.product_templates.product_mockups.map((mockup: any) => ({
                  id: mockup.id,
                  mockup_url: mockup.mockup_url,
                  mockup_name: mockup.mockup_name,
                  is_primary: mockup.is_primary,
                  has_print_area: mockup.has_print_area,
                  print_area: mockup.print_area
                }))
              : []
          } : undefined
        };
      }
      
      return {
        ...mappedProduct,
        final_price: product.print_product ? 
          product.print_product.base_price * (1 + product.creator_margin_percentage / 100) : 
          undefined
      };
    });
  } catch (error) {
    console.error('Error in getPublishedProducts:', error);
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<PublicCreatorProduct | null> => {
  try {
    const { data, error } = await supabase
      .from('creator_products')
      .select(`
        id,
        name_fr,
        name_en,
        name_ty,
        description_fr,
        description_en,
        description_ty,
        preview_url,
        creator_margin_percentage,
        category,
        tags,
        slug,
        created_at,
        creator:creator_id (
          id,
          full_name_fr,
          full_name_en,
          full_name_ty,
          bio_fr,
          bio_en,
          bio_ty,
          avatar_url,
          is_public_profile
        ),
        print_product:print_product_id (
          id,
          name_fr,
          name_en,
          name_ty,
          base_price,
          images,
          material,
          available_sizes,
          available_colors,
          product_templates:template_id (
            id,
            primary_mockup_id,
            product_mockups!product_mockups_product_template_id_fkey (
              id,
              mockup_url,
              mockup_name,
              is_primary,
              has_print_area,
              print_area
            )
          )
        ),
        design_data,
        original_design_url
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const mappedProduct = mapProductWithCompatibility(data);
    
    // Mapper le créateur avec compatibilité
    if (data.creator) {
      mappedProduct.creator = {
        id: data.creator.id,
        avatar_url: data.creator.avatar_url,
        is_public_profile: data.creator.is_public_profile,
        full_name: data.creator.full_name_fr ?? '',
        bio: data.creator.bio_fr ?? ''
      };
    }
    
    // Mapper le produit d'impression avec compatibilité
    if (data.print_product) {
      mappedProduct.print_product = {
        ...data.print_product,
        name: data.print_product.name_fr ?? '',
        product_templates: data.print_product.product_templates ? {
          id: data.print_product.product_templates.id,
          primary_mockup_id: data.print_product.product_templates.primary_mockup_id,
          product_mockups: Array.isArray(data.print_product.product_templates.product_mockups) 
            ? data.print_product.product_templates.product_mockups.map((mockup: any) => ({
                id: mockup.id,
                mockup_url: mockup.mockup_url,
                mockup_name: mockup.mockup_name,
                is_primary: mockup.is_primary,
                has_print_area: mockup.has_print_area,
                print_area: mockup.print_area
              }))
            : []
        } : undefined
      };
    }

    return {
      ...mappedProduct,
      final_price: data.print_product ? 
        data.print_product.base_price * (1 + data.creator_margin_percentage / 100) : 
        undefined
    };
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
};

export const getPublicCreators = async (limit = 12): Promise<PublicCreator[]> => {
  try {
    console.log('Fetching public creators from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name_fr,
        full_name_en,
        full_name_ty,
        bio_fr,
        bio_en,
        bio_ty,
        avatar_url,
        website_url,
        social_links,
        is_public_profile
      `)
      .eq('role', 'créateur')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching public creators:', error);
      return [];
    }

    console.log('Raw creators data:', data);

    // Compter les produits pour chaque créateur et filtrer ceux avec profil public
    const creatorsWithCounts = await Promise.all(
      (data || []).map(async (creator) => {
        const { count } = await supabase
          .from('creator_products')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', creator.id)
          .eq('is_published', true);

        const creatorData = mapCreatorWithCompatibility({
          ...creator,
          products_count: count || 0,
          full_name: creator.full_name_fr ?? '',
          bio: creator.bio_fr ?? '',
          is_public_profile: creator.is_public_profile ?? false
        });

        console.log(`Creator ${creatorData.full_name}: public_profile=${creator.is_public_profile}, products=${count}`);
        
        return creatorData;
      })
    );

    // Filtrer les créateurs avec profil public OU qui ont des produits publiés
    const visibleCreators = creatorsWithCounts.filter(creator => 
      creator.is_public_profile || creator.products_count > 0
    );

    console.log('Filtered visible creators:', visibleCreators);
    return visibleCreators;
  } catch (error) {
    console.error('Error in getPublicCreators:', error);
    return [];
  }
};

export const getCreatorBySlug = async (creatorId: string): Promise<PublicCreator | null> => {
  try {
    const { data: creator, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name_fr,
        full_name_en,
        full_name_ty,
        bio_fr,
        bio_en,
        bio_ty,
        avatar_url,
        website_url,
        social_links,
        is_public_profile
      `)
      .eq('id', creatorId)
      .eq('is_public_profile', true)
      .eq('role', 'créateur')
      .maybeSingle();

    if (error || !creator) {
      return null;
    }

    // Compter les produits
    const { count } = await supabase
      .from('creator_products')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator.id)
      .eq('is_published', true);

    return mapCreatorWithCompatibility({
      ...creator,
      products_count: count || 0,
      full_name: creator.full_name_fr ?? '',
      bio: creator.bio_fr ?? '',
      is_public_profile: creator.is_public_profile ?? false
    });
  } catch (error) {
    console.error('Error in getCreatorBySlug:', error);
    return null;
  }
};

export const getProductCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('creator_products')
      .select('category')
      .eq('is_published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return ['general'];
    }

    const categories = [...new Set(data?.map(item => item.category).filter(Boolean) || ['general'])];
    return categories.length > 0 ? categories : ['general'];
  } catch (error) {
    console.error('Error in getProductCategories:', error);
    return ['general'];
  }
};
