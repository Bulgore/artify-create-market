
import React from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="bg-artify-beige relative overflow-hidden">
      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-left mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Marketplace<br />Print-on-Demand
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Exprimez votre art, vendez vos créations, inspirez le monde
          </p>
          <Button className="bg-artify-blue hover:bg-blue-700 text-white text-lg px-8 py-6">
            Créer votre boutique
          </Button>
        </div>
        <div className="md:w-1/2 relative">
          <div className="relative flex justify-center items-center">
            <img 
              src="/placeholder.svg" 
              alt="Produits avec designs artistiques" 
              className="max-w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
