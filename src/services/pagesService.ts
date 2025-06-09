
import { supabase } from "@/integrations/supabase/client";
import { PageData, mapPageWithCompatibility } from "@/types/pages";

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('title_fr', { ascending: true });
    
  // Map the database rows to our application model
  const pagesData = data ? data.map(mapPageWithCompatibility) : null;
    
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
    .maybeSingle();
  
  console.log('Supabase response:', data);
  
  // Map the database row to our application model
  const pageData = data ? mapPageWithCompatibility(data) : null;
  
  return { data: pageData, error };
};

export const createPage = async (title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "Utilisateur non authentifié" } };
  }

  // Generate a slug if not provided
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  const { error } = await supabase
    .from('pages')
    .insert({ 
      title_fr: title,
      content_fr: content,
      slug: pageSlug
    });
    
  return { error };
};

export const updatePage = async (pageId: string, title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "Utilisateur non authentifié" } };
  }

  // Generate a slug if not provided
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  const { error } = await supabase
    .from('pages')
    .update({ 
      title_fr: title,
      content_fr: content,
      slug: pageSlug,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId);
    
  return { error };
};

export const deletePage = async (pageId: string): Promise<{ error: any }> => {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: { message: "Utilisateur non authentifié" } };
  }

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId);
    
  return { error };
};
