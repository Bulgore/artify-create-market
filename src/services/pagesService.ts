
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/pages";

// Définir clairement l'interface pour le résultat de Supabase
interface SupabasePage {
  id: string;
  title: string;
  content: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('title', { ascending: true });
    
  // Transformation explicite pour éviter des problèmes de typage
  const pagesData: PageData[] | null = data ? data.map((page: SupabasePage) => ({
    id: page.id,
    title: page.title,
    content: page.content,
    slug: page.slug || page.id.toLowerCase(), // Utiliser l'ID si le slug est vide
    created_at: page.created_at,
    updated_at: page.updated_at
  })) : null;
    
  return {
    data: pagesData,
    error
  };
};

export const fetchPageBySlug = async (slug: string): Promise<{ data: PageData | null; error: any }> => {
  // Requête simple à Supabase
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
  // Transformation explicite du résultat avec gestion des valeurs nulles
  let pageData: PageData | null = null;
  
  if (data) {
    pageData = {
      id: data.id,
      title: data.title,
      content: data.content,
      slug: data.slug || data.id.toLowerCase(), // Utiliser l'ID comme slug par défaut
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
  
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
