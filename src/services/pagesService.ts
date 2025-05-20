
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/pages";

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  return await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
};

export const fetchPageBySlug = async (slug: string): Promise<{ data: PageData | null; error: any }> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
  return { data, error };
};

export const createPage = async (title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Générer un slug si non fourni
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  return await supabase
    .from('pages')
    .insert({ 
      title: title,
      content: content,
      slug: pageSlug
    });
};

export const updatePage = async (pageId: string, title: string, content: string, slug: string): Promise<{ error: any }> => {
  // Générer un slug si non fourni
  const pageSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
  
  return await supabase
    .from('pages')
    .update({ 
      title: title,
      content: content,
      slug: pageSlug,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId);
};

export const deletePage = async (pageId: string): Promise<{ error: any }> => {
  return await supabase
    .from('pages')
    .delete()
    .eq('id', pageId);
};
