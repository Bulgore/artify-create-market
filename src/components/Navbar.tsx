
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-10">
        <Link to="/" className="text-2xl font-bold text-gray-900">Artify</Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-artify-blue transition-colors">
            Accueil
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-artify-blue transition-colors">
            Explorer
          </Link>
          <Link to="/artists" className="text-gray-700 hover:text-artify-blue transition-colors">
            Artistes
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-artify-blue transition-colors">
            Produits
          </Link>
        </div>
      </div>
      <div className="flex space-x-4">
        <Button variant="outline" className="hidden sm:inline-flex">
          Se connecter
        </Button>
        <Button className="bg-artify-blue hover:bg-blue-700 text-white">
          S'inscrire
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
