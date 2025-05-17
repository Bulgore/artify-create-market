
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-center md:text-left md:pr-16"
        >
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
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-1/2 mt-10 md:mt-0"
        >
          <img 
            src="/placeholder.svg" 
            alt="T-shirt personnalisé" 
            className="mx-auto w-full max-w-md"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
