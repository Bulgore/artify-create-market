
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Tous");
  
  const categories = ["Tous", "T-shirts", "Mugs", "Affiches", "Accessoires"];
  
  const products = [
    {
      id: 1,
      name: "Graphique Arc En Ciel",
      artist: "Marts Dupant",
      image: "/placeholder.svg",
      price: "20 €",
      category: "T-shirts"
    },
    {
      id: 2,
      name: "Montagne Vague",
      artist: "Jean Martin",
      image: "/placeholder.svg",
      price: "12 €",
      category: "Mugs"
    },
    {
      id: 3,
      name: "Coucher de Soleil",
      artist: "Sophel Leblanc",
      image: "/placeholder.svg",
      price: "15 €",
      category: "Affiches"
    },
    {
      id: 4,
      name: "Fleurs Abstraites",
      artist: "Alles Moreau",
      image: "/placeholder.svg",
      price: "20 €",
      category: "T-shirts"
    },
    {
      id: 5,
      name: "Paysage Abstrait",
      artist: "Claire Dubois",
      image: "/placeholder.svg",
      price: "18 €",
      category: "Affiches"
    },
    {
      id: 6,
      name: "Design Géométrique",
      artist: "Thomas Lefèvre",
      image: "/placeholder.svg",
      price: "22 €",
      category: "T-shirts"
    },
    {
      id: 7,
      name: "Formes Colorées",
      artist: "Marie Laurent",
      image: "/placeholder.svg",
      price: "14 €",
      category: "Mugs"
    },
    {
      id: 8,
      name: "Motif Tropical",
      artist: "Léa Bernard",
      image: "/placeholder.svg",
      price: "25 €",
      category: "Accessoires"
    }
  ];
  
  const filteredProducts = activeCategory === "Tous" 
    ? products 
    : products.filter(product => product.category === activeCategory);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pr-10 rounded-full border-gray-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Menu latéral avec catégories */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-medium mb-4">Catégories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full justify-start ${
                    activeCategory === category ? "bg-[#33C3F0] hover:bg-[#0FA0CE] text-white" : ""
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Grille de produits */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  artist={product.artist}
                  image={product.image}
                  price={product.price}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun produit trouvé dans cette catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
