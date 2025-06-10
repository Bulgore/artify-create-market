
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/layout/AdminLayout";

const Admin = () => {
  const { user, isAdmin, signOut, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [permissionCheckComplete, setPermissionCheckComplete] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  
  useEffect(() => {
    console.log('🏠 Admin page effect:', { 
      userEmail: user?.email, 
      loading, 
      userRole, 
      permissionCheckComplete,
      accessDenied
    });
    
    // Attendre que l'authentification soit complètement initialisée
    if (loading) {
      console.log('⏳ Still loading auth, waiting...');
      return;
    }
    
    // Éviter les vérifications multiples
    if (permissionCheckComplete) {
      console.log('✅ Permission check already completed');
      return;
    }
    
    console.log('🔍 Checking permissions...');
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      console.log('❌ No user, redirecting to auth');
      navigate("/auth");
      return;
    }
    
    // Attendre que le rôle soit chargé (userRole peut être null pendant le chargement)
    if (userRole === null) {
      console.log('⏳ User role not loaded yet, waiting...');
      return;
    }
    
    console.log('📝 User role loaded:', userRole);
    
    // Vérifier les permissions admin
    try {
      const hasAdminAccess = isAdmin();
      console.log('🔐 Admin access check:', { userRole, hasAdminAccess });
      
      if (!hasAdminAccess) {
        console.log('❌ User is not admin, showing toast and redirecting');
        setAccessDenied(true);
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }
      
      console.log('✅ User has admin permissions');
      setPermissionCheckComplete(true);
    } catch (error) {
      console.error('❌ Error during permission check:', error);
      setAccessDenied(true);
      toast({
        variant: "destructive",
        title: "Erreur de permissions",
        description: "Une erreur est survenue lors de la vérification des permissions.",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [user, loading, userRole, isAdmin, navigate, toast, permissionCheckComplete, accessDenied]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Afficher un message d'erreur si l'accès est refusé
  if (accessDenied) {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Accès refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Afficher un loader pendant la vérification des permissions
  if (loading || !permissionCheckComplete) {
    console.log('⏳ Showing loader... loading:', loading, 'permissionCheckComplete:', permissionCheckComplete);
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
          <p className="text-xs text-gray-400 mt-2">
            État: {loading ? 'Chargement auth' : 'Vérification permissions'}
          </p>
        </div>
      </div>
    );
  }

  // Ne rien rendre si pas d'utilisateur ou pas admin (en attendant la redirection)
  if (!user || !isAdmin()) {
    console.log('❌ User not admin or no user, returning null');
    return null;
  }

  console.log('🎉 Rendering admin layout');
  return (
    <div className="h-screen w-full bg-slate-100">
      <AdminLayout onSignOut={handleSignOut} />
    </div>
  );
};

export default Admin;
