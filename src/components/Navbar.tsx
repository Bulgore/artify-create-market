
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const userRole = user?.user_metadata?.role || "creator";

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-black">Podsleek</Link>
      
      <div className="hidden md:flex relative max-w-xs w-full mx-6">
        <Input 
          type="text" 
          placeholder="Rechercher un produit..." 
          className="pr-10 rounded-full border-gray-300"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
      </div>
      
      <div className="hidden md:flex space-x-6">
        <Link 
          to="/" 
          className={`${location.pathname === '/' ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
        >
          Accueil
        </Link>
        <Link 
          to="/products" 
          className={`${location.pathname === '/products' ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
        >
          Produits
        </Link>
        <Link 
          to="/artists" 
          className={`${location.pathname === '/artists' ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
        >
          Créateurs
        </Link>
        <Link 
          to="/printers" 
          className={`${location.pathname === '/printers' ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
        >
          Imprimeurs
        </Link>
      </div>
      
      <div className="flex space-x-4">
        {user ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="hidden sm:inline-flex"
            >
              Mon Profil
            </Button>
            <Button 
              onClick={() => navigate("/studio")}
              className="hidden sm:inline-flex bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
            >
              {userRole === "printer" ? "Mon Dashboard" : "Mon Studio"}
            </Button>
            <Button 
              className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              Déconnexion
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex"
            >
              Connexion
            </Button>
            <Button 
              className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              onClick={() => navigate("/auth?tab=register")}
            >
              Inscription
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
