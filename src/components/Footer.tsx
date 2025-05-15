
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12 border-t">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div>
            <Link to="/" className="text-2xl font-bold text-black">Podsleek</Link>
            <p className="mt-2 text-gray-600">
              Votre plateforme locale de print-on-demand.
            </p>
          </div>
          
          {/* Colonne centrale */}
          <div>
            <h3 className="text-lg font-medium mb-4">Liens Rapides</h3>
            <div className="space-y-2">
              <p><Link to="/legal" className="text-gray-600 hover:text-[#33C3F0]">Mentions légales</Link></p>
              <p><Link to="/terms" className="text-gray-600 hover:text-[#33C3F0]">Conditions générales d'utilisation</Link></p>
              <p><Link to="/privacy" className="text-gray-600 hover:text-[#33C3F0]">Politique de confidentialité</Link></p>
            </div>
          </div>
          
          {/* Colonne droite */}
          <div>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-[#33C3F0]">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#33C3F0]">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#33C3F0]">
                <Twitter size={20} />
              </a>
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="max-w-xs"
              />
              <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
                Inscription
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
