import { buildImageUrl } from './imageUrl';
import { parsePrintArea } from '@/types/printArea';
import type { PublicCreatorProduct } from '@/services/publicProductsService';

/**
 * Génère l'URL de preview avec le design appliqué sur le mockup correct
 */
export const generateProductPreviewUrl = (product: PublicCreatorProduct): string | null => {
  try {
    // 1. Récupérer le mockup correct
    const mockupUrl = getCorrectMockupUrl(product);
    if (!mockupUrl) {
      console.warn('❌ [mockupGenerator] Aucun mockup trouvé pour:', product.name);
      return null;
    }

    // 2. Récupérer l'URL du design
    const designUrl = getDesignUrl(product);
    if (!designUrl) {
      console.log('⚠️ [mockupGenerator] Aucun design trouvé, utilisation du mockup seul:', product.name);
      return mockupUrl;
    }

    // 3. Pour l'instant, retourner le mockup de base
    // TODO: Implémenter la génération de mockup avec design superposé
    console.log('✅ [mockupGenerator] Preview généré pour:', product.name, { mockupUrl, designUrl });
    return mockupUrl;
    
  } catch (error) {
    console.error('❌ [mockupGenerator] Erreur génération preview:', error);
    return null;
  }
};

/**
 * Récupère l'URL du mockup correct selon la priorité
 */
export const getCorrectMockupUrl = (product: PublicCreatorProduct): string | null => {
  const printProduct = product.print_product;
  
  if (!printProduct?.product_templates?.product_mockups?.length) {
    // Fallback sur les images du produit si pas de mockups
    return printProduct?.images?.[0] ? buildImageUrl(printProduct.images[0]) : null;
  }

  const mockups = printProduct.product_templates.product_mockups;
  
  // Priorité 1: Mockup marqué comme principal
  const primaryMockup = mockups.find(m => m.is_primary);
  if (primaryMockup?.mockup_url) {
    return buildImageUrl(primaryMockup.mockup_url);
  }

  // Priorité 2: Mockup avec primary_mockup_id
  const primaryMockupById = mockups.find(
    m => m.id === printProduct.product_templates?.primary_mockup_id
  );
  if (primaryMockupById?.mockup_url) {
    return buildImageUrl(primaryMockupById.mockup_url);
  }

  // Priorité 3: Premier mockup avec zone d'impression
  const mockupWithPrintArea = mockups.find(m => m.has_print_area && m.mockup_url);
  if (mockupWithPrintArea?.mockup_url) {
    return buildImageUrl(mockupWithPrintArea.mockup_url);
  }

  // Priorité 4: Premier mockup disponible
  const firstMockup = mockups.find(m => m.mockup_url);
  if (firstMockup?.mockup_url) {
    return buildImageUrl(firstMockup.mockup_url);
  }

  return null;
};

/**
 * Récupère l'URL du design du produit
 */
export const getDesignUrl = (product: PublicCreatorProduct): string | null => {
  // 1. original_design_url (priorité)
  if (product.original_design_url) {
    return buildImageUrl(product.original_design_url);
  }

  // 2. design_data.designUrl ou design_data.design_image_url
  if (product.design_data) {
    const designData = typeof product.design_data === 'string' 
      ? JSON.parse(product.design_data) 
      : product.design_data;
    
    if (designData.designUrl) {
      return buildImageUrl(designData.designUrl);
    }
    
    if (designData.design_image_url) {
      return buildImageUrl(designData.design_image_url);
    }
  }

  return null;
};

/**
 * Récupère la zone d'impression pour un produit
 */
export const getPrintAreaForProduct = (product: PublicCreatorProduct) => {
  const printProduct = product.print_product;
  
  if (!printProduct?.product_templates?.product_mockups?.length) {
    return null;
  }

  const mockups = printProduct.product_templates.product_mockups;
  
  // Chercher le mockup avec zone d'impression
  const primaryMockup = mockups.find(m => m.is_primary && m.has_print_area);
  const mockupWithArea = primaryMockup || mockups.find(m => m.has_print_area);
  
  if (mockupWithArea?.print_area) {
    return parsePrintArea(mockupWithArea.print_area);
  }

  return null;
};