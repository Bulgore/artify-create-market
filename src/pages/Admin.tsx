
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout/AdminLayout";

const Admin = () => {
  const { user, isAdmin, signOut, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  
  // Rediriger si non connecté ou non admin
  useEffect(() => {
    console.log('Admin page effect:', { user: user?.email, loading, userRole, hasCheckedPermissions });
    
    // Attendre que l'authentification soit complètement initialisée
    if (loading) {
      console.log('Still loading auth...');
      return;
    }
    
    // Éviter les vérifications multiples
    if (hasCheckedPermissions) {
      return;
    }
    
    console.log('Checking permissions...');
    
    if (!user) {
      console.log('No user, redirecting to auth');
      navigate("/auth");
      return;
    }
    
    // Attendre que le rôle soit chargé
    if (userRole === null) {
      console.log('User role not loaded yet, waiting...');
      return;
    }
    
    console.log('User role loaded:', userRole);
    
    if (!isAdmin()) {
      console.log('User is not admin, showing toast and redirecting');
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
      navigate("/");
      return;
    }
    
    console.log('User has admin permissions');
    setHasCheckedPermissions(true);
  }, [user, loading, userRole, isAdmin, navigate, toast, hasCheckedPermissions]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Afficher un loader pendant la vérification des permissions
  if (loading || !hasCheckedPermissions) {
    console.log('Showing loader...');
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
    console.log('User not admin or no user, returning null');
    return null;
  }

  console.log('Rendering admin layout');
  return (
    <div className="h-screen w-full bg-slate-100">
      <AdminLayout onSignOut={handleSignOut} />
    </div>
  );
};

export default Admin;
