
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type {
  CreatorProduct,
  GeneratedMockup,
  DesignFileInfo
} from '@/types/creatorProduct';

interface CreatorProductPreviewProps {
  productId: string;
  onClose: () => void;
}

interface ProductWithMockups extends CreatorProduct {
  generated_mockups?: GeneratedMockup[];
  original_design_url?: string | null;
  design_file_info?: DesignFileInfo | null;
}

export const CreatorProductPreview: React.FC<CreatorProductPreviewProps> = ({
  productId,
  onClose
}) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductWithMockups | null>(null);
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('creator_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      
      // Mapper les données pour assurer la compatibilité avec les nouveaux champs
      const productData: ProductWithMockups = {
        id: data.id,
        name_fr: data.name_fr,
        description_fr: data.description_fr,
        preview_url: data.preview_url,
        generated_mockups: Array.isArray(data.generated_mockups)
          ? (data.generated_mockups as GeneratedMockup[])
          : [],
        original_design_url: data.original_design_url || data.preview_url,
        design_file_info: (data.design_file_info as DesignFileInfo) || null
      };
      
      setProduct(productData);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du produit.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextMockup = () => {
    if (Array.isArray(product?.generated_mockups) && product.generated_mockups.length > 0) {
      setCurrentMockupIndex((prev) =>
        (prev + 1) % product.generated_mockups.length
      );
    }
  };

  const prevMockup = () => {
    if (Array.isArray(product?.generated_mockups) && product.generated_mockups.length > 0) {
      setCurrentMockupIndex((prev) =>
        prev === 0 ? product.generated_mockups.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-500">Chargement de l'aperçu...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-10 text-gray-500">
            Produit introuvable
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const mockups = product.generated_mockups || [];
  const hasMultipleMockups = mockups.length > 1;
  const displayImage = mockups.length > 0 ? mockups[currentMockupIndex]?.url : product.preview_url;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name_fr}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative bg-gray-50 rounded-lg p-4">
              {displayImage ? (
                <>
                  <img
                    src={displayImage}
                    alt={`Aperçu ${currentMockupIndex + 1}`}
                    className="w-full h-auto rounded"
                  />
                  
                  {hasMultipleMockups && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevMockup}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextMockup}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                        {currentMockupIndex + 1} / {mockups.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500">Aucun aperçu disponible</p>
                </div>
              )}
            </div>
            
            {hasMultipleMockups && (
              <div className="flex gap-2 overflow-x-auto">
                {mockups.map((mockup, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMockupIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 border-2 rounded ${
                      index === currentMockupIndex ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={mockup.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{product.name_fr}</h3>
              <p className="text-gray-600 mt-2">{product.description_fr}</p>
            </div>
            
            {product.original_design_url && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Fichier design original</h4>
                <div className="flex items-center gap-2">
                  <img
                    src={product.original_design_url}
                    alt="Design original"
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="text-sm text-blue-800">Fichier HD disponible</p>
                    {product.design_file_info && (
                      <div className="text-xs text-blue-600 mt-1">
                        <p>Taille: {product.design_file_info.size ? Math.round(product.design_file_info.size / 1024) + ' KB' : 'N/A'}</p>
                        <p>Format: {product.design_file_info.type || 'N/A'}</p>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = product.original_design_url!;
                        link.download = `design_${product.id}.jpg`;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Télécharger HD
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              <p><strong>ID Produit:</strong> {product.id}</p>
              <p><strong>Mockups générés:</strong> {mockups.length}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
