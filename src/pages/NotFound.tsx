
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-artify-cream">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md px-6 py-16">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-700 mb-8">Oops! Page introuvable</p>
          <Button asChild className="bg-artify-blue hover:bg-blue-700">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
