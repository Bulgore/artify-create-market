
import React from "react";
import { Link } from "react-router-dom";
import ReusableBlockRenderer from "@/components/content/ReusableBlockRenderer";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      {/* Blocs réutilisables du footer */}
      <ReusableBlockRenderer placement="footer" className="container mx-auto px-6 mb-8" />
      
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Podsleek</h3>
            <p className="text-gray-400">
              La plateforme qui connecte créateurs et imprimeurs pour donner vie à vos designs uniques.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Créateurs</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/studio" className="hover:text-white transition-colors">Studio de création</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/artists" className="hover:text-white transition-colors">Communauté</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Imprimeurs</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/printers" className="hover:text-white transition-colors">Rejoindre le réseau</Link></li>
              <li><Link to="/studio" className="hover:text-white transition-colors">Gestion des commandes</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/legal" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Podsleek. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
