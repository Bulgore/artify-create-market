
import { supabase } from "@/integrations/supabase/client";

export interface ProductionFile {
  orderId: string;
  designUrl: string;
  printArea: any;
  specifications: {
    size: string;
    quantity: number;
    material: string;
    color: string;
  };
  printerInfo: {
    name: string;
    email: string;
    instructions?: string;
  };
}

export interface AutomationResult {
  success: boolean;
  orderId: string;
  printerEmail?: string;
  productionFileUrl?: string;
  error?: string;
}

class OrderAutomationService {
  
  // Génération automatique du fichier de production
  async generateProductionFile(orderId: string): Promise<string | null> {
    try {
      console.log('📄 Génération fichier de production pour commande:', orderId);
      
      // Récupérer les données de la commande
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          creator_products!inner(
            design_data,
            creator_id
          ),
          product_templates!inner(
            design_area,
            technical_instructions_fr
          )
        `)
        .eq('id', orderId)
        .single();

      if (error || !order) {
        throw new Error('Commande non trouvée');
      }

      // Créer le fichier de production (simulation)
      const productionData = {
        order_id: orderId,
        design_data: order.creator_products.design_data,
        print_area: order.product_templates.design_area,
        specifications: {
          size: order.size,
          quantity: order.quantity,
          total_price: order.total_price
        },
        technical_instructions: order.product_templates.technical_instructions_fr,
        generated_at: new Date().toISOString()
      };

      // Ici on génèrerait le vrai fichier PDF/ZIP
      // Pour la démo, on simule la génération
      const productionFileUrl = `https://example.com/production/${orderId}.pdf`;
      
      console.log('✅ Fichier de production généré:', productionFileUrl);
      return productionFileUrl;
      
    } catch (error) {
      console.error('❌ Erreur génération fichier:', error);
      return null;
    }
  }

  // Routage automatique vers l'imprimeur
  async routeToprinter(orderId: string, productionFileUrl: string): Promise<boolean> {
    try {
      console.log('📧 Routage commande vers imprimeur:', orderId);
      
      // Trouver l'imprimeur assigné au gabarit
      const { data: orderData, error } = await supabase
        .from('orders')
        .select(`
          *,
          product_templates!inner(
            id,
            name_fr
          )
        `)
        .eq('id', orderId)
        .single();

      if (error || !orderData) {
        throw new Error('Impossible de récupérer les données de commande');
      }

      // Mapping simulé gabarit -> imprimeur
      const printerMapping = {
        'template-1': { name: 'Pacific Print Co.', email: 'orders@pacificprint.pf' },
        'template-2': { name: 'Oceania Graphics', email: 'print@oceaniagraphics.nc' },
        'template-3': { name: 'Atoll Creations', email: 'contact@atollcreations.com' }
      };

      const templateId = orderData.product_templates.id;
      const printer = printerMapping[templateId as keyof typeof printerMapping] || 
                    printerMapping['template-1'];

      // Simulation de l'envoi d'email
      console.log(`📨 Envoi email à ${printer.email} pour commande ${orderId}`);
      console.log(`📎 Fichier joint: ${productionFileUrl}`);
      
      // Ici on appellerait le service d'email réel
      await this.simulateEmailSend(printer.email, orderId, productionFileUrl);
      
      return true;
      
    } catch (error) {
      console.error('❌ Erreur routage imprimeur:', error);
      return false;
    }
  }

  // Simulation d'envoi d'email
  private async simulateEmailSend(printerEmail: string, orderId: string, fileUrl: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ Email envoyé à ${printerEmail} pour commande ${orderId}`);
        resolve();
      }, 1000);
    });
  }

  // Traitement automatique complet d'une commande
  async processOrderAutomatically(orderId: string): Promise<AutomationResult> {
    try {
      console.log('🚀 Démarrage traitement automatique commande:', orderId);
      
      // Étape 1: Génération fichier de production
      const productionFileUrl = await this.generateProductionFile(orderId);
      if (!productionFileUrl) {
        throw new Error('Échec génération fichier de production');
      }

      // Étape 2: Routage vers imprimeur
      const routingSuccess = await this.routeToprinter(orderId, productionFileUrl);
      if (!routingSuccess) {
        throw new Error('Échec routage vers imprimeur');
      }

      // Étape 3: Mise à jour du statut
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', orderId);

      console.log('✅ Traitement automatique terminé avec succès');
      
      return {
        success: true,
        orderId,
        productionFileUrl,
        printerEmail: 'orders@pacificprint.pf' // Simulé
      };
      
    } catch (error: any) {
      console.error('❌ Erreur traitement automatique:', error);
      
      return {
        success: false,
        orderId,
        error: error.message
      };
    }
  }

  // Surveillance des nouvelles commandes
  async monitorNewOrders(): Promise<void> {
    console.log('👀 Surveillance des nouvelles commandes activée');
    
    // Écoute en temps réel des nouvelles commandes
    const subscription = supabase
      .channel('orders-automation')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: 'status=eq.pending'
        },
        async (payload) => {
          console.log('🆕 Nouvelle commande détectée:', payload.new.id);
          
          // Traitement automatique après un petit délai
          setTimeout(async () => {
            await this.processOrderAutomatically(payload.new.id);
          }, 2000);
        }
      )
      .subscribe();
  }
}

export const orderAutomationService = new OrderAutomationService();
