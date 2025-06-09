
import { supabase } from "@/integrations/supabase/client";

export interface DesignData {
  id?: string;
  // Nouveaux champs multilingues
  name_fr: string;
  name_en?: string;
  name_ty?: string;
  description_fr?: string;
  description_en?: string;
  description_ty?: string;
  // Anciens champs pour compatibilité (mappés depuis les versions françaises)
  name?: string;
  description?: string;
  price: number;
  creator_margin: number;
  preview_url: string;
  canvas_data: string;
  is_published?: boolean;
  creator_id?: string;
}

// Fonction utilitaire pour mapper les champs multilingues vers les anciens champs
const mapDesignWithCompatibility = (design: any): DesignData => ({
  ...design,
  name: design.name_fr || design.name || '',
  description: design.description_fr || design.description || ''
});

export const fetchDesignById = async (id: string): Promise<DesignData | null> => {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  return mapDesignWithCompatibility(data);
};

export const createDesign = async (designData: DesignData): Promise<{ data: any; error: any }> => {
  // S'assurer que name_fr est rempli
  const processedData = {
    ...designData,
    name_fr: designData.name_fr || designData.name || '',
    description_fr: designData.description_fr || designData.description || ''
  };
  
  return await supabase
    .from('designs')
    .insert(processedData);
};

export const updateDesign = async (id: string, designData: Partial<DesignData>): Promise<{ data: any; error: any }> => {
  // S'assurer que name_fr est mis à jour si name est fourni
  const processedData = {
    ...designData,
    name_fr: designData.name_fr || designData.name,
    description_fr: designData.description_fr || designData.description
  };
  
  return await supabase
    .from('designs')
    .update(processedData)
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
  return data.map(mapDesignWithCompatibility);
};

export const publishDesign = async (id: string, publish: boolean = true): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('designs')
    .update({ is_published: publish })
    .eq('id', id);
};
