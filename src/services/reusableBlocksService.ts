
import { supabase } from "@/integrations/supabase/client";
import { ReusableBlock, CreateReusableBlockData } from "@/types/reusableBlocks";

export const reusableBlocksService = {
  async getBlocks(placement?: string): Promise<ReusableBlock[]> {
    let query = supabase
      .from('reusable_blocks')
      .select('*')
      .order('display_order', { ascending: true });

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reusable blocks:', error);
      throw error;
    }

    return (data || []) as ReusableBlock[];
  },

  async getActiveBlocks(placement?: string): Promise<ReusableBlock[]> {
    let query = supabase
      .from('reusable_blocks')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (placement) {
      query = query.eq('placement', placement);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching active reusable blocks:', error);
      throw error;
    }

    return (data || []) as ReusableBlock[];
  },

  async createBlock(blockData: CreateReusableBlockData): Promise<ReusableBlock> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reusable_blocks')
      .insert({
        ...blockData,
        created_by: user.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reusable block:', error);
      throw error;
    }

    return data as ReusableBlock;
  },

  async updateBlock(id: string, blockData: Partial<CreateReusableBlockData>): Promise<ReusableBlock> {
    const { data, error } = await supabase
      .from('reusable_blocks')
      .update({
        ...blockData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reusable block:', error);
      throw error;
    }

    return data as ReusableBlock;
  },

  async deleteBlock(id: string): Promise<void> {
    const { error } = await supabase
      .from('reusable_blocks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting reusable block:', error);
      throw error;
    }
  }
};
