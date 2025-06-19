
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  Package, 
  Image, 
  Settings,
  BarChart3,
  Home,
  Plus
} from "lucide-react";

const CreatorNavigation = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const navigationItems = [
    { 
      id: "dashboard", 
      label: "Tableau de bord", 
      icon: Home,
      onClick: () => navigate('/studio')
    },
    { 
      id: "products", 
      label: "Mes Produits", 
      icon: Package,
      onClick: () => navigate('/studio?tab=products')
    },
    { 
      id: "create", 
      label: "Créer un Produit", 
      icon: Plus,
      onClick: () => navigate('/studio?tab=create')
    },
    { 
      id: "media", 
      label: "Mes Médias", 
      icon: Image,
      onClick: () => navigate('/studio?tab=media')
    },
    { 
      id: "analytics", 
      label: "Statistiques", 
      icon: BarChart3,
      onClick: () => navigate('/studio?tab=analytics')
    },
    { 
      id: "profile", 
      label: "Mon Profil", 
      icon: User,
      onClick: () => navigate('/studio?tab=profile')
    },
    { 
      id: "settings", 
      label: "Paramètres", 
      icon: Settings,
      onClick: () => navigate('/studio?tab=settings')
    }
  ];

  return (
    <Card className="w-64 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Studio Créateur</CardTitle>
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start gap-3 text-left hover:bg-blue-50"
            onClick={item.onClick}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
        
        <div className="pt-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorNavigation;
