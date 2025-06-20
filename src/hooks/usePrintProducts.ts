
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PrintProduct, mapPrintProductWithCompatibility, mapTemplateWithCompatibility } from '@/types/customProduct';

export const usePrintProducts = () => {
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);

  useEffect(() => {
    fetchPrintProducts();
  }, []);

  const fetchPrintProducts = async () => {
    try {
      console.log("=== DEBUT FETCH PRINT PRODUCTS ===");
      
      // Vérifier d'abord l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("❌ Auth error:", authError);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter.",
        });
        return;
      }

      if (!user) {
        console.log("❌ No authenticated user");
        toast({
          variant: "destructive",
          title: "Non authentifié",
          description: "Veuillez vous connecter pour accéder aux produits.",
        });
        return;
      }

      console.log("✅ User authenticated:", user.email);
      
      // Récupérer tous les produits actifs avec leurs templates et mockups
      const { data: allProducts, error: productsError } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates (
            id,
            name_fr,
            name_en,
            name_ty,
            technical_instructions_fr,
            technical_instructions_en,
            technical_instructions_ty,
            type,
            available_positions,
            available_colors,
            is_active,
            created_by,
            created_at,
            updated_at,
          primary_mockup_id,
          product_mockups (
            id,
            mockup_url,
            mockup_name,
            print_area,
            is_primary,
            display_order
          )
          )
        `)
        .eq('is_active', true);

      if (productsError) {
        console.error("❌ Error fetching print products:", productsError);
        toast({
          variant: "destructive",
          title: "Erreur de base de données",
          description: `Impossible de charger les produits: ${productsError.message}`,
        });
        throw productsError;
      }

      console.log("📦 Raw products from database:", allProducts?.length || 0);

      if (!allProducts || allProducts.length === 0) {
        console.log("⚠️ No active products found");
        setPrintProducts([]);
        toast({
          title: "Aucun produit d'impression actif",
          description: "Aucun produit actif trouvé dans la base de données.",
        });
        return;
      }

      // Traiter les produits avec templates
      const productsWithTemplates = [];
      
      for (const product of allProducts) {
        const mappedProduct = mapPrintProductWithCompatibility(product);
        
        console.log(`\n🔍 Analyzing product: ${mappedProduct.name}`);
        console.log(`   - ID: ${product.id}`);
        console.log(`   - template_id: ${product.template_id}`);
        console.log(`   - is_active: ${product.is_active}`);
        
        if (!product.template_id || !product.product_templates) {
          console.log(`   ❌ No template - SKIPPING`);
          continue;
        }

        const template = product.product_templates;
        const mappedTemplate = mapTemplateWithCompatibility(template);

        // Récupérer le mockup principal avec sa zone d'impression
        let mockupImageUrl = '';
        if (
          template.primary_mockup_id &&
          Array.isArray(template.product_mockups) &&
          template.product_mockups.length > 0
        ) {
          const primaryMockup = template.product_mockups.find(
            m => m.id === template.primary_mockup_id
          );
          if (primaryMockup) {
            mockupImageUrl = primaryMockup.mockup_url;
            console.log(`   ✅ Primary mockup found: ${primaryMockup.mockup_name}`);
          }
        }

        if (!mockupImageUrl) {
          console.log(`   ❌ No primary mockup - SKIPPING`);
          continue;
        }

        console.log(`   ✅ Template found: ${mappedTemplate.name}`);

        // Construire l'objet produit avec template
        const productWithTemplate = {
          ...mappedProduct,
          product_templates: {
            ...mappedTemplate
          }
        };

        productsWithTemplates.push(productWithTemplate);
        console.log(`   ✅ Product ${mappedProduct.name} VALIDATED and ADDED`);
      }

      console.log(`\n📊 SUMMARY:`);
      console.log(`   Total products in DB: ${allProducts.length}`);
      console.log(`   Valid products for customization: ${productsWithTemplates.length}`);

      setPrintProducts(productsWithTemplates);

      if (productsWithTemplates.length === 0) {
        console.log("⚠️ No valid products found after validation");
        toast({
          title: "Aucun produit configuré",
          description: `${allProducts.length} produit(s) trouvé(s) mais aucun n'est correctement configuré pour la personnalisation.`,
        });
      } else {
        console.log(`✅ ${productsWithTemplates.length} produits disponibles pour la personnalisation`);
        toast({
          title: "Produits chargés",
          description: `${productsWithTemplates.length} produit(s) disponible(s) pour la personnalisation.`,
        });
      }

      console.log("=== FIN FETCH PRINT PRODUCTS ===\n");
      
    } catch (error: any) {
      console.error('❌ CRITICAL ERROR in fetchPrintProducts:', error);
      
      let errorMessage = "Erreur inconnue";
      if (error.code === 'PGRST116') {
        errorMessage = "Permissions insuffisantes. Vérifiez votre rôle utilisateur.";
      } else if (error.message?.includes('JWT')) {
        errorMessage = "Session expirée. Veuillez vous reconnecter.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur critique",
        description: `Impossible de charger les produits: ${errorMessage}`
      });
      setPrintProducts([]);
    }
  };

  return {
    printProducts,
    refetchProducts: fetchPrintProducts
  };
};
