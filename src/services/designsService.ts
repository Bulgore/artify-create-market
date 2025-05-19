
import { supabase } from "@/integrations/supabase/client";

export interface DesignData {
  id?: string;
  name: string;
  description?: string;
  price: number;
  creator_margin: number;
  preview_url: string;
  canvas_data: string;
  is_published?: boolean;
  creator_id?: string;
}

export const fetchDesignById = async (id: string): Promise<DesignData | null> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return data as DesignData;
};

export const createDesign = async (designData: DesignData): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('designs')
    .insert(designData);
};

export const updateDesign = async (id: string, designData: Partial<DesignData>): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('designs')
    .update(designData)
    .eq('id', id);
};

export const deleteDesign = async (id: string): Promise<{ error: any }> => {
  return await supabase
    .from('designs')
    .delete()
    .eq('id', id);
};

export const fetchUserDesigns = async (userId: string): Promise<DesignData[]> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('creator_id', userId);
  
  if (error || !data) return [];
  return data as DesignData[];
};

export const publishDesign = async (id: string, publish: boolean = true): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('designs')
    .update({ is_published: publish })
    .eq('id', id);
};
