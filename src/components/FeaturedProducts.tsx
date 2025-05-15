
import React from "react";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Affiche Abstraite",
      image: "/placeholder.svg",
      price: "29,99 €",
    },
    {
      id: 2,
      name: "T-shirt «Floral»",
      image: "/placeholder.svg",
      price: "24,99 €",
    },
    {
      id: 3,
      name: "Tote Bag Dégradé",
      image: "/placeholder.svg",
      price: "19,99 €",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Produits en vedette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              name={product.name} 
              image={product.image} 
              price={product.price} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
