
import React from "react";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "Graphique Arc En Ciel",
      artist: "Marts Dupant",
      image: "/placeholder.svg",
      price: "20 €",
    },
    {
      id: 2,
      name: "Montagne Vague",
      artist: "Jean Martin",
      image: "/placeholder.svg",
      price: "12 €",
    },
    {
      id: 3,
      name: "Coucher de Soleil",
      artist: "Sophel Leblanc",
      image: "/placeholder.svg",
      price: "15 €",
    },
    {
      id: 4,
      name: "Fleurs Abstraites",
      artist: "Alles Moreau",
      image: "/placeholder.svg",
      price: "20 €",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          name={product.name} 
          artist={product.artist}
          image={product.image} 
          price={product.price} 
        />
      ))}
    </div>
  );
};

export default FeaturedProducts;
