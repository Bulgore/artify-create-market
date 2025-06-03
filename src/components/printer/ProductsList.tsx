
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  is_active: boolean;
}

interface ProductsListProps {
  isLoading: boolean;
  printProducts: PrintProduct[];
  onEditProduct?: (productId: string) => void;
  onAddProduct?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  isLoading, 
  printProducts, 
  onEditProduct,
  onAddProduct 
}) => {
  const handleAddProductClick = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      // Fallback: trigger the tab change programmatically
      const addProductTab = document.querySelector('[data-value="addProduct"]') as HTMLElement;
      if (addProductTab) {
        addProductTab.click();
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <p className="text-center py-8">Chargement des produits...</p>
      ) : printProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {printProducts.map(product => (
            <Card key={product.id}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.images[0] || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.material}</p>
                <p className="text-sm text-gray-600 mb-2">Stock: {product.stock_quantity}</p>
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Tailles: {product.available_sizes.join(', ')}</p>
                  <p className="text-xs text-gray-500">Couleurs: {product.available_colors.join(', ')}</p>
                </div>
                <p className="font-medium mb-4">{product.base_price} XPF</p>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditProduct && onEditProduct(product.id)}
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
          <p>Vous n'avez pas encore créé de produits d'impression.</p>
          <Button 
            className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
            onClick={handleAddProductClick}
          >
            Créer mon premier produit
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductsList;
