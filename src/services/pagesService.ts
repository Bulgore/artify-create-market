
import { supabase } from "@/integrations/supabase/client";
import { PageData } from "@/types/pages";

export const fetchAllPages = async (): Promise<{ data: PageData[] | null; error: any }> => {
  return await supabase
    .from('pages')
    .select('*');
};

export const createPage = async (title: string, content: string): Promise<{ error: any }> => {
  return await supabase
    .from('pages')
    .insert({ 
      title: title,
      content: content,
    });
};

export const updatePage = async (pageId: string, title: string, content: string): Promise<{ error: any }> => {
  return await supabase
    .from('pages')
    .update({ 
      title: title,
      content: content,
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
