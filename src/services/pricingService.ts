
import { supabase } from "@/integrations/supabase/client";

export interface PricingDetails {
  basePrice: number;
  creatorMargin: number;
  commissionRate: number;
  subtotal: number;
  finalPrice: number;
}

// Récupère les détails de tarification pour un design et un template spécifiques
export const getProductPricing = async (designId: string, templateId: string): Promise<PricingDetails | null> => {
  const { data, error } = await supabase
    .from('product_pricing')
    .select('*')
    .eq('design_id', designId)
    .eq('template_id', templateId)
    .single();
  
  if (error || !data) return null;
  
  return {
    basePrice: data.base_price,
    creatorMargin: data.creator_margin,
    commissionRate: data.commission_rate,
    subtotal: data.subtotal,
    finalPrice: data.final_price
  };
};

// Calcule le prix brut (pour affichage dans le formulaire de création de design)
export const calculateRawPrice = (basePrice: number, creatorMargin: number = 5): number => {
  return basePrice + creatorMargin;
};

// Calcule le prix final incluant la commission (pour affichage au client)
export const calculateFinalPrice = (basePrice: number, creatorMargin: number = 5, commissionRate: number = 15): number => {
  const subtotal = basePrice + creatorMargin;
  return subtotal * (1 + commissionRate / 100);
};

// Vérifie si un utilisateur a un abonnement premium actif
export const checkUserSubscription = async (userId: string): Promise<{isSubscribed: boolean, commissionRate: number}> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) {
    // Récupérer le taux de commission par défaut
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('default_commission')
      .eq('id', userId)
      .single();
    
    return {
      isSubscribed: false,
      commissionRate: userData?.default_commission || 15 // Taux par défaut si pas d'abonnement
    };
  }
  
  return {
    isSubscribed: true,
    commissionRate: data.commission_rate
  };
};
