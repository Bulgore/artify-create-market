
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
}

interface ProductsListProps {
  isLoading: boolean;
  templates: Product[];
  onEditProduct?: (productId: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ isLoading, templates, onEditProduct }) => {
  return (
    <>
      {isLoading ? (
        <p className="text-center py-8">Chargement des produits...</p>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <Card key={template.id}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={template.images[0] || "/placeholder.svg"} 
                  alt={template.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.material}</p>
                <p className="text-sm text-gray-600 mb-2">Stock: {template.stock_quantity}</p>
                <p className="font-medium mb-4">{template.base_price} €</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditProduct && onEditProduct(template.id)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Fonctionnalité à venir",
                        description: "La suppression de produits sera bientôt disponible."
                      });
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Vous n'avez pas encore ajouté de produits.</p>
          <Button 
            className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
            onClick={() => document.querySelector('[data-value="addProduct"]')?.dispatchEvent(new MouseEvent('click'))}
          >
            Ajouter mon premier produit
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductsList;
