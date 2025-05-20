
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/pages";

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
    
  return {
    data: data as PageData[] | null,
    error
  };
};

export const fetchPageBySlug = async (slug: string): Promise<{ data: PageData | null; error: any }> => {
  // Utilisation d'une approche directe pour éviter l'erreur d'instanciation profonde
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
  // Application d'un cast explicite pour éviter l'erreur de typage
  const pageData: PageData | null = data ? {
    id: data.id,
    title: data.title,
    content: data.content,
    slug: data.slug || '',
    created_at: data.created_at,
    updated_at: data.updated_at
  } : null;
  
  return { data: pageData, error };
};

export const createPage = async (title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Générer un slug si non fourni
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
  // Générer un slug si non fourni
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
