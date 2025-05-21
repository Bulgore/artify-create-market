
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/pages";

// Define a separate interface for the raw database response
interface SupabasePageRow {
  id: string;
  title: string;
  content: string;
  slug: string | null;
  created_at: string;
  updated_at: string | null;
}

// Convert database row to application model
function mapToPageData(page: SupabasePageRow): PageData {
  return {
    id: page.id,
    title: page.title,
    content: page.content,
    slug: page.slug || page.id.toLowerCase(),
    created_at: page.created_at,
    updated_at: page.updated_at || page.created_at
  };
}

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
    
  // Map the database rows to our application model
  const pagesData = data ? data.map((row: SupabasePageRow) => mapToPageData(row)) : null;
    
  return {
    data: pagesData,
    error
  };
};

export const fetchPageBySlug = async (slug: string): Promise<{ data: PageData | null; error: any }> => {
  console.log(`Fetching page with slug: ${slug}`);
  
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
  console.log('Supabase response:', data);
  
  // Map the database row to our application model
  const pageData = data ? mapToPageData(data as SupabasePageRow) : null;
  
  return { data: pageData, error };
};

export const createPage = async (title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Generate a slug if not provided
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  const { error } = await supabase
    .from('pages')
    .insert({ 
      title: title,
      content: content,
      slug: pageSlug
    });
    
  return { error };
};

export const updatePage = async (pageId: string, title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Generate a slug if not provided
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  const { error } = await supabase
    .from('pages')
    .update({ 
      title: title,
      content: content,
      slug: pageSlug,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId);
    
  return { error };
};

export const deletePage = async (pageId: string): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId);
    
  return { error };
};
