
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { buildMockupUrl } from '@/utils/imageUrl';

interface ProductMockup {
  id: string;
  product_template_id: string;
  mockup_url: string;
  mockup_name: string;
  display_order: number;
  is_primary: boolean;
  print_area: any;
  has_print_area: boolean;
  created_at: string;
  updated_at: string;
}

export const useProductMockups = (templateId?: string) => {
  const { toast } = useToast();
  const [mockups, setMockups] = useState<ProductMockup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMockups = async () => {
    if (!templateId) return;
    
    setIsLoading(true);
    try {
      console.log('🔄 Fetching mockups for template:', templateId);
      
      const { data, error } = await supabase
        .from('product_mockups')
        .select('*')
        .eq('product_template_id', templateId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching mockups:', error);
        setMockups([]);
        return;
      }

      console.log('✅ Mockups fetched:', data?.length || 0);

      const mapped = (data || []).map((m) => ({
        ...m,
        url: buildMockupUrl(m.mockup_url)
      }));

      setMockups(mapped);
    } catch (error: any) {
      console.error('❌ Exception fetching mockups:', error);
      setMockups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMockup = async (mockupData: Omit<ProductMockup, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🔄 Adding mockup:', mockupData);
      
      const { error } = await supabase
        .from('product_mockups')
        .insert([mockupData]);

      if (error) {
        console.error('❌ Error adding mockup:', error);
        throw error;
      }
      
      toast({
        title: "Mockup ajouté",
        description: "Le mockup a été ajouté avec succès.",
      });
      
      fetchMockups();
      return true;
    } catch (error: any) {
      console.error('❌ Exception adding mockup:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le mockup.",
      });
      return false;
    }
  };

  const updateMockup = async (mockupId: string, updates: Partial<ProductMockup>) => {
    try {
      console.log('🔄 Updating mockup:', mockupId, updates);
      
      const { error } = await supabase
        .from('product_mockups')
        .update(updates)
        .eq('id', mockupId);

      if (error) {
        console.error('❌ Error updating mockup:', error);
        throw error;
      }
      
      toast({
        title: "Mockup mis à jour",
        description: "Le mockup a été mis à jour avec succès.",
      });
      
      fetchMockups();
      return true;
    } catch (error: any) {
      console.error('❌ Exception updating mockup:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le mockup.",
      });
      return false;
    }
  };

  const deleteMockup = async (mockupId: string) => {
    try {
      console.log('🔄 Deleting mockup:', mockupId);
      
      const { error } = await supabase
        .from('product_mockups')
        .delete()
        .eq('id', mockupId);

      if (error) {
        console.error('❌ Error deleting mockup:', error);
        throw error;
      }
      
      toast({
        title: "Mockup supprimé",
        description: "Le mockup a été supprimé avec succès.",
      });
      
      fetchMockups();
      return true;
    } catch (error: any) {
      console.error('❌ Exception deleting mockup:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le mockup.",
      });
      return false;
    }
  };

  const updatePrintArea = async (mockupId: string, printArea: any) => {
    return updateMockup(mockupId, { 
      print_area: printArea,
      has_print_area: true 
    });
  };

  useEffect(() => {
    fetchMockups();
  }, [templateId]);

  return {
    mockups,
    isLoading,
    fetchMockups,
    addMockup,
    updateMockup,
    deleteMockup,
    updatePrintArea
  };
};
