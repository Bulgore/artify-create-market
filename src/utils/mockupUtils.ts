
import { buildImageUrl } from '@/utils/imageUrl';
import type { PrintProduct } from '@/types/customProduct';

export const getPrimaryMockupUrl = (printProduct: PrintProduct | null): string | undefined => {
  if (!printProduct?.product_templates?.product_mockups || !Array.isArray(printProduct.product_templates.product_mockups)) {
    console.warn('⚠️ [mockupUtils] Aucun mockup disponible');
    return undefined;
  }

  // Chercher le mockup principal
  const primaryMockup = printProduct.product_templates.product_mockups.find(
    m => m.id === printProduct.product_templates?.primary_mockup_id
  );

  if (primaryMockup) {
    return buildImageUrl(primaryMockup.mockup_url);
  }

  // Fallback sur le premier mockup
  const firstMockup = printProduct.product_templates.product_mockups[0];
  if (firstMockup) {
    return buildImageUrl(firstMockup.mockup_url);
  }

  return undefined;
};
