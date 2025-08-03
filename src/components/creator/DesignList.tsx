
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MockupPreview } from "@/components/creator/design-uploader/MockupPreview";

interface Design {
  id: string;
  name: string;
  description?: string;
  preview_url: string;
  is_published: boolean;
  creator_margin_percentage: number;
}

interface DesignListProps {
  designs: Design[];
  onDesignUpdated: () => void;
  onCreateDesign: () => void;
  onEditDesign: (id: string) => void;
}

interface CreatorProductWithMockup {
  id: string;
  name_fr: string;
  description_fr: string | null;
  is_published: boolean;
  creator_margin_percentage: number;
  original_design_url: string | null;
  design_data: any;
  print_product?: {
    product_templates?: {
      product_mockups?: Array<{
        mockup_url: string;
        is_primary: boolean;
        print_area: any;
      }> | null;
    } | null;
  } | null;
}

const DesignList: React.FC<DesignListProps> = ({
  designs,
  onDesignUpdated,
  onCreateDesign,
  onEditDesign
}) => {
  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('creator_products')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: currentStatus ? "Produit retiré" : "Produit publié",
        description: currentStatus 
          ? "Votre produit a été retiré de la boutique" 
          : "Votre produit est maintenant disponible dans la boutique"
      });
      
      // Refresh products list
      onDesignUpdated();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du produit."
      });
    }
  };

  const [creatorProducts, setCreatorProducts] = useState<CreatorProductWithMockup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreatorProducts();
  }, [designs]);

  const loadCreatorProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('creator_products')
        .select(`
          id,
          name_fr,
          description_fr,
          is_published,
          creator_margin_percentage,
          original_design_url,
          design_data,
          print_product:print_product_id (
            product_templates:template_id (
              product_mockups!product_mockups_product_template_id_fkey (
                mockup_url,
                is_primary,
                print_area
              )
            )
          )
        `)
        .eq('creator_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreatorProducts((data as unknown as CreatorProductWithMockup[]) || []);
    } catch (error) {
      console.error('Error loading creator products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Chargement de vos produits...</p>
      </div>
    );
  }

  if (creatorProducts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Vous n'avez pas encore créé de produits personnalisés.</p>
        <Button 
          className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
          onClick={onCreateDesign}
        >
          Créer mon premier produit
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creatorProducts.map(product => {
        const primaryMockup = product.print_product?.product_templates?.product_mockups?.find(m => m.is_primary) ||
                              product.print_product?.product_templates?.product_mockups?.[0];
        
        return (
          <Card key={product.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden bg-gray-100">
              {product.original_design_url && primaryMockup ? (
                <MockupPreview
                  mockupUrl={primaryMockup.mockup_url}
                  designUrl={product.original_design_url}
                  designArea={primaryMockup.print_area}
                  designPosition={product.design_data?.position}
                />
              ) : (
                <img 
                  src={primaryMockup?.mockup_url || "/placeholder.svg"} 
                  alt={product.name_fr} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-1">{product.name_fr}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description_fr}</p>
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#33C3F0]">
                  Marge: {product.creator_margin_percentage}%
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.is_published 
                    ? "bg-green-100 text-green-700" 
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {product.is_published ? "Publié" : "Brouillon"}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEditDesign(product.id)}
              >
                Modifier
              </Button>
              <Button 
                variant={product.is_published ? "outline" : "default"}
                className={product.is_published ? "flex-1" : "flex-1 bg-[#33C3F0] hover:bg-[#0FA0CE]"}
                onClick={() => handlePublishToggle(product.id, product.is_published)}
              >
                {product.is_published ? "Retirer" : "Publier"}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
};

export default DesignList;

