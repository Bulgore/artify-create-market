
import { buildImageUrl } from './imageUrl';
import type { PrintProduct } from '@/types/customProduct';

export const getPrimaryMockupUrl = (product: PrintProduct): string | undefined => {
  console.log('🔍 [mockupUtils] Récupération mockup pour:', product.name_fr || product.name);
  
  // PRIORITÉ 1: Chercher dans les product_mockups pour avoir le bon mockup
  if (product.product_templates?.product_mockups?.length) {
    const mockups = product.product_templates.product_mockups;
    console.log('🖼️ [mockupUtils] Product mockups disponibles:', mockups.length);

    // Chercher le mockup marqué comme principal
    const primaryMockup = mockups.find(m => m.is_primary);
    if (primaryMockup?.mockup_url) {
      const mockupUrl = buildImageUrl(primaryMockup.mockup_url);
      console.log('✅ [mockupUtils] Mockup principal (is_primary) trouvé:', mockupUrl);
      return mockupUrl;
    }

    // Chercher le mockup par primary_mockup_id
    const primaryMockupById = mockups.find(
      m => m.id === product.product_templates?.primary_mockup_id
    );
    if (primaryMockupById?.mockup_url) {
      const mockupUrl = buildImageUrl(primaryMockupById.mockup_url);
      console.log('✅ [mockupUtils] Mockup principal (primary_id) trouvé:', mockupUrl);
      return mockupUrl;
    }

    // Fallback sur le premier mockup avec zone d'impression
    const mockupWithPrintArea = mockups.find(m => m.has_print_area && m.mockup_url);
    if (mockupWithPrintArea?.mockup_url) {
      const mockupUrl = buildImageUrl(mockupWithPrintArea.mockup_url);
      console.log('⚠️ [mockupUtils] Utilisation mockup avec zone d\'impression:', mockupUrl);
      return mockupUrl;
    }

    // Fallback sur le premier mockup disponible
    const firstMockup = mockups.find(m => m.mockup_url);
    if (firstMockup?.mockup_url) {
      const mockupUrl = buildImageUrl(firstMockup.mockup_url);
      console.log('⚠️ [mockupUtils] Utilisation du premier mockup:', mockupUrl);
      return mockupUrl;
    }
  }
  
  // PRIORITÉ 2 (FALLBACK OBSOLÈTE): mockup_image_url du template (pour compatibilité)
  if ((product.product_templates as any)?.mockup_image_url) {
    console.log('📷 [mockupUtils] Fallback: Mockup template (OBSOLÈTE):', (product.product_templates as any).mockup_image_url);
    return (product.product_templates as any).mockup_image_url;
  }
  
  // PRIORITÉ 3 (DERNIER RECOURS): Fallback vers les images du produit
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    console.log('📸 [mockupUtils] Dernier recours - image produit:', product.images[0]);
    return product.images[0];
  }

  console.warn('❌ [mockupUtils] Aucun mockup utilisable trouvé');
  return undefined;
};

export const getAllMockupUrls = (product: PrintProduct): string[] => {
  if (!product.product_templates?.product_mockups) {
    return [];
  }

  return product.product_templates.product_mockups
    .filter(m => m.mockup_url)
    .map(m => buildImageUrl(m.mockup_url));
};

export const getMockupWithPrintArea = (product: PrintProduct) => {
  if (!product.product_templates?.product_mockups) {
    return null;
  }

  const mockupWithArea = product.product_templates.product_mockups.find(
    m => m.has_print_area && m.print_area
  );

  if (mockupWithArea) {
    return {
      url: buildImageUrl(mockupWithArea.mockup_url),
      printArea: mockupWithArea.print_area
    };
  }

  return null;
};
