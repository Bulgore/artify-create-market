
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  name: string;
  artist?: string;
  image: string;
  price: string;
}

const ProductCard = ({ name, artist, image, price }: ProductCardProps) => {
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
        <Link to={`/product/${encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))}`}>
          <Button className="w-full bg-white hover:bg-gray-50 text-[#33C3F0] border border-[#33C3F0]">
            Voir Produit
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
