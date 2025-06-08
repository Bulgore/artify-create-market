
import { supabase } from '@/integrations/supabase/client';

export interface PublicCreatorProduct {
  id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
  creator_margin_percentage: number;
  category: string;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  slug: string | null;
  created_at: string;
  creator: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
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
  };
  final_price?: number;
}

export interface PublicCreator {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website_url: string | null;
  social_links: any;
  products_count: number;
}

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
        name,
        description,
        preview_url,
        creator_margin_percentage,
        category,
        tags,
        seo_title,
        seo_description,
        slug,
        created_at,
        creator:creator_id (
          id,
          full_name,
          avatar_url,
          bio,
          is_public_profile
        ),
        print_product:print_product_id (
          id,
          name,
          base_price,
          images,
          material,
          available_sizes,
          available_colors
        )
      `)
      .eq('status', 'published')
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

    // Calculer le prix final
    return (data || []).map(product => ({
      ...product,
      final_price: product.print_product ? 
        product.print_product.base_price * (1 + product.creator_margin_percentage / 100) : 
        undefined
    }));
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
        name,
        description,
        preview_url,
        creator_margin_percentage,
        category,
        tags,
        seo_title,
        seo_description,
        slug,
        created_at,
        creator:creator_id (
          id,
          full_name,
          avatar_url,
          bio,
          is_public_profile
        ),
        print_product:print_product_id (
          id,
          name,
          base_price,
          images,
          material,
          available_sizes,
          available_colors
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      ...data,
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
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        website_url,
        social_links
      `)
      .eq('is_public_profile', true)
      .eq('role', 'créateur')
      .limit(limit);

    if (error) {
      console.error('Error fetching public creators:', error);
      return [];
    }

    // Compter les produits pour chaque créateur
    const creatorsWithCounts = await Promise.all(
      (data || []).map(async (creator) => {
        const { count } = await supabase
          .from('creator_products')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', creator.id)
          .eq('status', 'published');

        return {
          ...creator,
          products_count: count || 0
        };
      })
    );

    return creatorsWithCounts;
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
        full_name,
        avatar_url,
        bio,
        website_url,
        social_links
      `)
      .eq('id', creatorId)
      .eq('is_public_profile', true)
      .eq('role', 'créateur')
      .single();

    if (error || !creator) {
      return null;
    }

    // Compter les produits
    const { count } = await supabase
      .from('creator_products')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator.id)
      .eq('status', 'published');

    return {
      ...creator,
      products_count: count || 0
    };
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
      .eq('status', 'published');

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
