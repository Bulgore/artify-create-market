
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left md:pr-16">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Créez, Imprimez, Partagez
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-xl">
            Personnalisez vos produits et partagez votre créativité avec le monde entier.
          </p>
          <Button 
            onClick={() => navigate("/products")} 
            className="mt-8 px-8 py-3 text-lg bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
          >
            Explorer
          </Button>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img 
            src="/placeholder.svg" 
            alt="T-shirt personnalisé" 
            className="mx-auto w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
