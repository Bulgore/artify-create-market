
import { supabase } from "@/integrations/supabase/client";

export interface Subscription {
  id: string;
  user_id: string;
  subscription_type: string;
  commission_rate: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchUserSubscription = async (userId: string): Promise<Subscription | null> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) return null;
  return data as Subscription;
};

export const createSubscription = async (
  userId: string,
  subscriptionType: string,
  commissionRate: number,
  stripeSubscriptionId?: string
): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      subscription_type: subscriptionType,
      commission_rate: commissionRate,
      stripe_subscription_id: stripeSubscriptionId,
      is_active: true
    });
};

export const cancelSubscription = async (subscriptionId: string): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('subscriptions')
    .update({
      is_active: false,
      end_date: new Date().toISOString()
    })
    .eq('id', subscriptionId);
};

export const getSubscriptionPlans = () => {
  // Plans pour les créateurs
  const creatorPlans = [
    {
      id: "creator_basic",
      name: "Basique",
      price: 0,
      commissionRate: 15,
      features: [
        "Création illimitée de designs",
        "15% de commission sur les ventes",
        "Support par email"
      ],
      isPopular: false
    },
    {
      id: "creator_premium",
      name: "Premium",
      price: 9.99,
      commissionRate: 10,
      features: [
        "Création illimitée de designs",
        "10% de commission sur les ventes",
        "Support prioritaire",
        "Visibilité accrue dans la boutique"
      ],
      isPopular: true
    },
    {
      id: "creator_pro",
      name: "Professionnel",
      price: 19.99,
      commissionRate: 7.5,
      features: [
        "Création illimitée de designs",
        "7.5% de commission sur les ventes",
        "Support dédié",
        "Placement en tête des résultats de recherche",
        "Outils d'analyse avancés"
      ],
      isPopular: false
    }
  ];
  
  // Plans pour les imprimeurs
  const printerPlans = [
    {
      id: "printer_basic",
      name: "Basique",
      price: 0,
      features: [
        "Ajout de produits illimité",
        "Frais de service standard",
        "Support par email"
      ],
      isPopular: false
    },
    {
      id: "printer_premium",
      name: "Premium",
      price: 29.99,
      features: [
        "Ajout de produits illimité",
        "Frais de service réduits",
        "Support prioritaire",
        "Mise en avant des produits",
        "Outils de gestion des commandes"
      ],
      isPopular: true
    }
  ];
  
  return { creatorPlans, printerPlans };
};

export const calculateEarnings = async (orderId: string): Promise<any> => {
  const { data, error } = await supabase
    .rpc('calculate_earnings', { order_id: orderId });
  
  if (error) throw error;
  return data;
};
