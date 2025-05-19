
import { supabase } from "@/integrations/supabase/client";

export interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
  };
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  productDetails: {
    designId: string;
    templateId: string;
    quantity: number;
    size: string;
  };
}

// Cette fonction sera complétée lors de l'intégration avec Stripe
export const processPayment = async (paymentDetails: PaymentDetails): Promise<{ success: boolean; error?: any; sessionId?: string }> => {
  // Endpoint à implémenter avec Supabase Edge Function pour l'intégration Stripe
  try {
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: JSON.stringify(paymentDetails)
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      sessionId: data.sessionId 
    };
  } catch (error) {
    console.error("Erreur lors du traitement du paiement:", error);
    return { 
      success: false, 
      error: error 
    };
  }
};

// Enregistrement de la commande dans la base de données
export const createOrder = async (
  userId: string,
  designId: string,
  templateId: string,
  quantity: number,
  size: string,
  totalPrice: number,
  shippingAddress: any
): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('orders')
    .insert({
      user_id: userId,
      design_id: designId,
      template_id: templateId,
      quantity: quantity,
      size: size,
      total_price: totalPrice,
      shipping_address: shippingAddress,
      status: 'pending'
    });
};

// Récupération des commandes d'un utilisateur
export const fetchUserOrders = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      designs:design_id (name, preview_url),
      tshirt_templates:template_id (name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
};

// Récupération des commandes à traiter par un imprimeur
export const fetchPrinterOrders = async (printerId: string): Promise<any[]> => {
  // Fix: Don't use .in() with a query, use .in() with an array of values
  const { data: templateIds, error: templateError } = await supabase
    .from('tshirt_templates')
    .select('id')
    .eq('printer_id', printerId);
    
  if (templateError || !templateIds) return [];
  
  const templateIdArray = templateIds.map(t => t.id);
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      designs:design_id (name, preview_url),
      tshirt_templates:template_id (name)
    `)
    .eq('status', 'paid')
    .in('template_id', templateIdArray)
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
};

// Mise à jour du statut d'une commande
export const updateOrderStatus = async (orderId: string, status: string): Promise<{ data: any; error: any }> => {
  return await supabase
    .from('orders')
    .update({ status: status })
    .eq('id', orderId);
};
