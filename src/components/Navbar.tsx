
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Search, Settings } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation";

const Navbar = () => {
  const { user, signOut, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { navigationItems, isLoading } = useNavigation("header");
  
  const userRole = user?.user_metadata?.role || "creator";
  const isAdminUser = isAdmin();

  // Ne pas afficher la navbar pendant le chargement initial de l'auth
  if (loading) {
    return (
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-black">Podsleek</Link>
        <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
      </nav>
    );
  }

  // Liens statiques toujours présents
  const staticLinks = [
    {
      title: "Accueil",
      url: "/",
      active: location.pathname === '/'
    },
    {
      title: "Produits",
      url: "/products",
      active: location.pathname === '/products'
    },
    {
      title: "Créateurs",
      url: "/artists",
      active: location.pathname === '/artists'
    },
    {
      title: "Imprimeurs",
      url: "/printers",
      active: location.pathname === '/printers'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

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
        {/* Affichage des liens statiques */}
        {staticLinks.map((link) => (
          <Link 
            key={link.title}
            to={link.url} 
            className={`${link.active ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
          >
            {link.title}
          </Link>
        ))}
        
        {/* Affichage des liens personnalisés */}
        {!isLoading && navigationItems.map((item, index) => {
          // Si le lien est externe
          if (item.isExternal) {
            return (
              <a 
                key={`custom-${index}`} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 hover:text-[#33C3F0] transition-colors"
              >
                {item.title}
              </a>
            );
          }
          
          // Si c'est un lien interne
          return (
            <Link 
              key={`custom-${index}`}
              to={item.url} 
              className={`${location.pathname === item.url ? 'text-[#33C3F0]' : 'text-gray-900'} hover:text-[#33C3F0] transition-colors`}
            >
              {item.title}
            </Link>
          );
        })}
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
            
            {isAdminUser && (
              <Button
                onClick={() => navigate("/admin")}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Administration
              </Button>
            )}
            
            {!isAdminUser && (
              <Button 
                onClick={() => navigate("/studio")}
                className="hidden sm:inline-flex bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              >
                {userRole === "printer" ? "Mon Dashboard" : "Mon Studio"}
              </Button>
            )}
            
            <Button 
              className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
              onClick={handleSignOut}
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
