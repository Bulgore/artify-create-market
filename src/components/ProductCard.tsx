
import React from "react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
}

const ProductCard = ({ name, image, price }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden transition-all hover:shadow-lg">
      <div className="h-64 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-700 mb-4">{price}</p>
        <Button className="w-full bg-artify-blue hover:bg-blue-700 text-white">
          Voir le produit
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
