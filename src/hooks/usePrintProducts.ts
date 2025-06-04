
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrintProduct } from '@/types/customProduct';

export const usePrintProducts = () => {
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);

  useEffect(() => {
    fetchPrintProducts();
  }, []);

  const fetchPrintProducts = async () => {
    try {
      console.log("Fetching print products with templates...");
      
      const { data, error } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates (
            id,
            name,
            svg_file_url,
            mockup_image_url,
            design_area,
            mockup_area
          )
        `)
        .eq('is_active', true)
        .not('template_id', 'is', null);

      if (error) {
        console.error("Error fetching print products:", error);
        throw error;
      }

      console.log("Raw data from database:", data);

      const allProducts = data || [];
      
      // Filtrer pour s'assurer que les produits ont bien un template et une design_area
      const validProducts = allProducts.filter(product => {
        console.log(`Checking product ${product.name}:`, {
          template_id: product.template_id,
          has_template_data: !!product.product_templates,
          template_data: product.product_templates,
          has_design_area: !!product.product_templates?.design_area
        });
        
        // Vérifier que le produit a un template_id ET des données de template
        if (!product.template_id) {
          console.log(`Product ${product.name} filtered out: missing template_id`);
          return false;
        }

        if (!product.product_templates) {
          console.log(`Product ${product.name} filtered out: template data not found in join`);
          return false;
        }
        
        // Vérifier que le template a une zone de design
        if (!product.product_templates.design_area) {
          console.log(`Product ${product.name} filtered out: missing design_area in template`);
          return false;
        }
        
        // Vérifier que design_area n'est pas vide
        const designArea = typeof product.product_templates.design_area === 'string' 
          ? JSON.parse(product.product_templates.design_area) 
          : product.product_templates.design_area;
          
        if (!designArea || !designArea.width || !designArea.height) {
          console.log(`Product ${product.name} filtered out: invalid design_area dimensions`, designArea);
          return false;
        }
        
        console.log(`Product ${product.name} is valid for customization`);
        return true;
      });

      console.log(`Total products found: ${allProducts.length}`);
      console.log(`Valid products for customization: ${validProducts.length}`);
      
      setPrintProducts(validProducts);
      
      if (validProducts.length === 0 && allProducts.length > 0) {
        console.log("Products found but none are valid:", allProducts);
        toast({
          title: "Configuration incomplète",
          description: `${allProducts.length} produit(s) trouvé(s) mais la configuration des gabarits n'est pas complète. Vérifiez que les gabarits ont des zones d'impression définies.`,
        });
      } else if (allProducts.length === 0) {
        toast({
          title: "Aucun produit disponible",
          description: "Aucun produit d'impression actif trouvé avec un gabarit assigné.",
        });
      } else {
        console.log(`${validProducts.length} produits disponibles pour la personnalisation`);
        toast({
          title: "Produits chargés",
          description: `${validProducts.length} produit(s) disponible(s) pour la personnalisation.`,
        });
      }
    } catch (error: any) {
      console.error('Error fetching print products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits disponibles."
      });
    }
  };

  return {
    printProducts,
    refetchProducts: fetchPrintProducts
  };
};
