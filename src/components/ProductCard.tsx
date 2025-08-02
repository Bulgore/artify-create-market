
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  artist?: string;
  image: string;
  price: string;
  designUrl?: string;
  printArea?: any;
}

const ProductCard = ({ id, name, artist, image, price, designUrl, printArea }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id,
      title: name,
      price: parseFloat(price.replace('€', '').replace(',', '.')),
      mockupUrl: image,
      designUrl: designUrl || image,
      printArea: printArea || {},
    });

    toast({
      title: "Produit ajouté au panier",
      description: `${name} a été ajouté à votre panier`,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))}`}>
        <div className="h-64 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        {artist && <p className="text-sm text-gray-600 mb-2">{artist}</p>}
        <p className="text-gray-900 font-medium mb-4">{price}</p>
        
        <div className="flex gap-2">
          <Link to={`/product/${encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Voir Produit
            </Button>
          </Link>
          <Button onClick={handleAddToCart} className="flex-shrink-0">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
