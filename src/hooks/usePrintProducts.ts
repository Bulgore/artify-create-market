
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
      
      // Récupérer tous les produits actifs d'abord
      const { data: allProducts, error: productsError } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates!print_products_template_id_fkey (
            id,
            name,
            svg_file_url,
            mockup_image_url,
            design_area,
            mockup_area
          )
        `)
        .eq('is_active', true);

      if (productsError) {
        console.error("Error fetching print products:", productsError);
        throw productsError;
      }

      console.log("Raw data from database:", allProducts?.length || 0, "products found");
      console.log("Products data:", allProducts);

      if (!allProducts || allProducts.length === 0) {
        console.log("No products found in database");
        setPrintProducts([]);
        toast({
          title: "Aucun produit disponible",
          description: "Aucun produit d'impression actif trouvé.",
        });
        return;
      }

      // Analyser chaque produit pour la compatibilité
      const productAnalysis = allProducts.map(product => {
        const analysis = {
          id: product.id,
          name: product.name,
          hasTemplateId: !!product.template_id,
          hasTemplateData: !!product.product_templates,
          hasDesignArea: false,
          designAreaValid: false,
          isValid: false
        };

        if (product.product_templates && product.product_templates.design_area) {
          analysis.hasDesignArea = true;
          
          try {
            const designArea = typeof product.product_templates.design_area === 'string' 
              ? JSON.parse(product.product_templates.design_area) 
              : product.product_templates.design_area;
              
            if (designArea && designArea.width > 0 && designArea.height > 0) {
              analysis.designAreaValid = true;
              analysis.isValid = true;
            }
          } catch (e) {
            console.error(`Error parsing design_area for product ${product.name}:`, e);
          }
        }

        console.log(`Product ${product.name} analysis:`, analysis);
        return { product, analysis };
      });

      // Filtrer les produits valides
      const validProducts = productAnalysis
        .filter(({ analysis }) => analysis.isValid)
        .map(({ product }) => product);

      console.log(`Products analysis: ${allProducts.length} total, ${validProducts.length} valid`);

      // Afficher les détails des produits non valides
      const invalidProducts = productAnalysis.filter(({ analysis }) => !analysis.isValid);
      if (invalidProducts.length > 0) {
        console.log("Invalid products details:");
        invalidProducts.forEach(({ product, analysis }) => {
          console.log(`- ${product.name}:`, {
            template_id: product.template_id,
            has_template_data: analysis.hasTemplateData,
            has_design_area: analysis.hasDesignArea,
            design_area_valid: analysis.designAreaValid,
            template_data: product.product_templates
          });
        });
      }

      setPrintProducts(validProducts);
      
      if (validProducts.length === 0 && allProducts.length > 0) {
        const issues = invalidProducts.map(({ product, analysis }) => {
          if (!analysis.hasTemplateId) return `${product.name}: aucun gabarit assigné`;
          if (!analysis.hasTemplateData) return `${product.name}: données de gabarit manquantes`;
          if (!analysis.hasDesignArea) return `${product.name}: zone d'impression non définie`;
          if (!analysis.designAreaValid) return `${product.name}: zone d'impression invalide`;
          return `${product.name}: problème inconnu`;
        }).join('\n');

        toast({
          title: "Configuration incomplète",
          description: `${allProducts.length} produit(s) trouvé(s) mais aucun n'est configuré correctement :\n${issues}`,
        });
      } else if (allProducts.length === 0) {
        toast({
          title: "Aucun produit disponible",
          description: "Aucun produit d'impression actif trouvé.",
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
