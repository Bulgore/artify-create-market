
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
      console.log("=== DEBUT FETCH PRINT PRODUCTS ===");
      
      // D'abord, récupérer tous les produits actifs
      const { data: allProducts, error: productsError } = await supabase
        .from('print_products')
        .select('*')
        .eq('is_active', true);

      if (productsError) {
        console.error("❌ Error fetching print products:", productsError);
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
        console.log(`\n🔍 Analyzing product: ${product.name}`);
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
          console.error(`   ❌ Template fetch error for ${product.name}:`, templateError);
          continue;
        }

        if (!template) {
          console.log(`   ❌ No active template found - SKIPPING`);
          continue;
        }

        console.log(`   ✅ Template found: ${template.name}`);
        console.log(`   📐 Template design_area:`, template.design_area);

        // Vérifier la zone d'impression
        let designArea = null;
        try {
          designArea = typeof template.design_area === 'string' 
            ? JSON.parse(template.design_area) 
            : template.design_area;
        } catch (e) {
          console.error(`   ❌ Invalid design_area JSON for ${product.name}:`, e);
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
          ...product,
          product_templates: template
        };

        productsWithTemplates.push(productWithTemplate);
        console.log(`   ✅ Product ${product.name} VALIDATED and ADDED`);
      }

      console.log(`\n📊 SUMMARY:`);
      console.log(`   Total products in DB: ${allProducts.length}`);
      console.log(`   Valid products for customization: ${productsWithTemplates.length}`);

      setPrintProducts(productsWithTemplates);

      if (productsWithTemplates.length === 0) {
        console.log("⚠️ No valid products found after validation");
        
        // Diagnostic détaillé
        const diagnostics = allProducts.map(product => {
          const issues = [];
          if (!product.template_id) issues.push("No template assigned");
          if (!product.is_active) issues.push("Product not active");
          return `${product.name}: ${issues.length > 0 ? issues.join(', ') : 'Unknown issue'}`;
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
      toast({
        variant: "destructive",
        title: "Erreur critique",
        description: `Impossible de charger les produits: ${error.message}`
      });
      setPrintProducts([]);
    }
  };

  return {
    printProducts,
    refetchProducts: fetchPrintProducts
  };
};
