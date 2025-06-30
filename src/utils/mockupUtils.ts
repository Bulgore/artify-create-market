
import { buildImageUrl } from './imageUrl';
import type { PrintProduct } from '@/types/customProduct';

export const getPrimaryMockupUrl = (product: PrintProduct): string | undefined => {
  console.log('🔍 [mockupUtils] Récupération mockup pour:', product.name);
  
  if (!product.product_templates?.product_mockups || !Array.isArray(product.product_templates.product_mockups)) {
    console.warn('⚠️ [mockupUtils] Aucun mockup disponible pour ce produit');
    return undefined;
  }

  const mockups = product.product_templates.product_mockups;
  console.log('🖼️ [mockupUtils] Mockups disponibles:', mockups.length);

  // Chercher le mockup principal
  const primaryMockup = mockups.find(
    m => m.id === product.product_templates?.primary_mockup_id
  );

  if (primaryMockup?.mockup_url) {
    const mockupUrl = buildImageUrl(primaryMockup.mockup_url);
    console.log('✅ [mockupUtils] Mockup principal trouvé:', mockupUrl);
    return mockupUrl;
  }

  // Fallback sur le premier mockup disponible
  const firstMockup = mockups.find(m => m.mockup_url);
  if (firstMockup?.mockup_url) {
    const mockupUrl = buildImageUrl(firstMockup.mockup_url);
    console.log('⚠️ [mockupUtils] Utilisation du premier mockup:', mockupUrl);
    return mockupUrl;
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
