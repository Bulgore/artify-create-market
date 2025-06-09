
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
      
      // D'abord, récupérer tous les produits actifs
      const { data: allProducts, error: productsError } = await supabase
        .from('print_products')
        .select('*')
        .eq('is_active', true);

      if (productsError) {
        console.error("❌ Error fetching print products:", productsError);
        
        // Diagnostiquer le type d'erreur
        if (productsError.code === 'PGRST116' || productsError.message?.includes('permission denied')) {
          toast({
            variant: "destructive",
            title: "Erreur de permission",
            description: "Vous n'avez pas les droits pour accéder aux produits d'impression. Vérifiez votre rôle utilisateur.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur de base de données",
            description: `Impossible de charger les produits: ${productsError.message}`,
          });
        }
        throw productsError;
      }

      console.log("📦 Raw products from database:", allProducts?.length || 0);
      console.log("📦 Products data:", allProducts);

      if (!allProducts || allProducts.length === 0) {
        console.log("⚠️ No active products found");
        setPrintProducts([]);
        toast({
          title: "Aucun produit d'impression actif",
          description: "Aucun produit actif trouvé dans la base de données.",
        });
        return;
      }

      // Ensuite, récupérer les gabarits pour chaque produit qui en a un
      const productsWithTemplates = [];
      
      for (const product of allProducts) {
        const mappedProduct = mapPrintProductWithCompatibility(product);
        
        console.log(`\n🔍 Analyzing product: ${mappedProduct.name}`);
        console.log(`   - ID: ${product.id}`);
        console.log(`   - template_id: ${product.template_id}`);
        console.log(`   - is_active: ${product.is_active}`);
        
        if (!product.template_id) {
          console.log(`   ❌ No template_id - SKIPPING`);
          continue;
        }

        // Récupérer le gabarit associé
        const { data: template, error: templateError } = await supabase
          .from('product_templates')
          .select('*')
          .eq('id', product.template_id)
          .eq('is_active', true)
          .single();

        if (templateError) {
          console.error(`   ❌ Template fetch error for ${mappedProduct.name}:`, templateError);
          
          // Diagnostiquer si c'est un problème de permission
          if (templateError.code === 'PGRST116' || templateError.message?.includes('permission denied')) {
            console.error(`   ❌ Permission denied for template ${product.template_id}`);
          }
          continue;
        }

        if (!template) {
          console.log(`   ❌ No active template found - SKIPPING`);
          continue;
        }

        const mappedTemplate = mapTemplateWithCompatibility(template);
        console.log(`   ✅ Template found: ${mappedTemplate.name}`);
        console.log(`   📐 Template design_area:`, template.design_area);

        // Vérifier la zone d'impression
        let designArea = null;
        try {
          designArea = typeof template.design_area === 'string' 
            ? JSON.parse(template.design_area) 
            : template.design_area;
        } catch (e) {
          console.error(`   ❌ Invalid design_area JSON for ${mappedProduct.name}:`, e);
          continue;
        }

        if (!designArea || !designArea.width || !designArea.height || designArea.width <= 0 || designArea.height <= 0) {
          console.log(`   ❌ Invalid design area dimensions - SKIPPING`);
          console.log(`   📐 Design area:`, designArea);
          continue;
        }

        console.log(`   ✅ Valid design area: ${designArea.width}x${designArea.height}`);

        // Construire l'objet produit avec template
        const productWithTemplate = {
          ...mappedProduct,
          product_templates: mappedTemplate
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
        
        // Diagnostic détaillé
        const diagnostics = allProducts.map(product => {
          const mappedProduct = mapPrintProductWithCompatibility(product);
          const issues = [];
          if (!product.template_id) issues.push("No template assigned");
          if (!product.is_active) issues.push("Product not active");
          return `${mappedProduct.name}: ${issues.length > 0 ? issues.join(', ') : 'Unknown issue'}`;
        });

        toast({
          title: "Aucun produit configuré",
          description: `${allProducts.length} produit(s) trouvé(s) mais aucun n'est correctement configuré pour la personnalisation.\n\nProblèmes détectés:\n${diagnostics.join('\n')}`,
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
      
      // Message d'erreur plus informatif selon le type d'erreur
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
