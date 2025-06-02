
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import BuilderComponent from "@/components/builder/BuilderComponent";

const BuilderPage = () => {
  const { contentPath } = useParams<{ contentPath?: string }>();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <BuilderComponent 
          model="page"
          content={contentPath} 
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default BuilderPage;
