
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import BuilderComponent from "@/components/builder/BuilderComponent";
import FeaturedProducts from "@/components/FeaturedProducts";
import FeaturedArtists from "@/components/FeaturedArtists";
import CallToAction from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <BuilderComponent model="homepage" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="py-16"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">
              Produits Populaires
            </h2>
            <FeaturedProducts />
          </div>
        </motion.div>
        <FeaturedArtists />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
