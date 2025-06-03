
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout/AdminLayout";

const Admin = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Rediriger si non connecté ou non admin
  useEffect(() => {
    // Ne pas rediriger pendant le chargement initial
    if (loading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!isAdmin()) {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
      return;
    }
  }, [user, loading, isAdmin, navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Afficher un loader pendant la vérification des permissions
  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Ne rien rendre si pas d'utilisateur ou pas admin (en attendant la redirection)
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-slate-100">
      <AdminLayout onSignOut={handleSignOut} />
    </div>
  );
};

export default Admin;
