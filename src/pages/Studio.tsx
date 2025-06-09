
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CreatorStudio from "@/components/CreatorStudio";
import PrinterStudio from "@/components/PrinterStudio";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Settings, 
  LayoutDashboard, 
  Search,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const Studio = () => {
  const { user, loading, signOut } = useAuth();
  const { isCreator, isPrinter, isSuperAdmin, userRole } = useUserRole();
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState<{
    creator_status?: string;
    onboarding_completed?: boolean;
  } | null>(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Redirect admin to admin page
  useEffect(() => {
    if (!loading && user && isSuperAdmin) {
      navigate("/admin");
    }
  }, [user, loading, isSuperAdmin, navigate]);

  // Check creator onboarding status
  useEffect(() => {
    if (user && isCreator) {
      checkCreatorStatus();
    }
  }, [user, isCreator]);

  const checkCreatorStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('creator_status, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserStatus(data);

      // Rediriger vers l'onboarding seulement si explicitement demandé
      // Permettre l'accès au studio même si l'onboarding n'est pas terminé
    } catch (error) {
      console.error('Error checking creator status:', error);
    }
  };

  const goBackToOnboarding = () => {
    navigate('/onboarding');
  };
  
  // Show loading while auth is initializing
  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  // If user is admin, we'll redirect in the useEffect
  if (isSuperAdmin) {
    return null;
  }

  // Check if user has a valid role
  if (!isCreator && !isPrinter) {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Rôle d'utilisateur non reconnu: {userRole}</p>
          <p className="text-sm text-gray-400">Veuillez contacter l'administrateur.</p>
        </div>
      </div>
    );
  }

  // Show status message for creators pending approval
  if (isCreator && userStatus?.creator_status === 'pending') {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profil en cours de validation</h2>
          <p className="text-gray-600 mb-4">
            Votre profil et vos premiers produits sont en cours de validation par notre équipe.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vous recevrez une notification dès que votre profil sera approuvé.
          </p>
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (isCreator && userStatus?.creator_status === 'rejected') {
    return (
      <div className="h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Corrections nécessaires</h2>
          <p className="text-gray-600 mb-4">
            Votre profil nécessite quelques ajustements avant d'être publié.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 mb-4"
          >
            Modifier mon profil
          </button>
          <br />
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="text-orange-600 hover:text-orange-700 underline text-sm"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Paramètres", icon: Settings },
  ];

  // Debug log to help track the issue
  console.log("Studio - userRole:", userRole, "user_metadata.role:", user.user_metadata?.role);

  return (
    <div className="h-screen w-full bg-slate-100">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar side="left" variant="sidebar">
            <SidebarHeader className="bg-[#333945] text-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-orange-400">
                  {isCreator ? "STUDIO CRÉATEUR" : isPrinter ? "STUDIO IMPRIMEUR" : "STUDIO"}
                </h2>
              </div>
              <div className="mt-4 relative">
                <Input 
                  placeholder="Search" 
                  className="pl-8 bg-white/10 border-none text-white" 
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/60" />
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#333945] text-white px-2 py-4">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]">
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="bg-[#333945] border-t border-gray-700 p-4">
              <div 
                className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 overflow-auto">
            <header className="bg-white p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {isCreator ? "Studio de Création" : isPrinter ? "Dashboard Imprimeur" : "Studio"}
                </h1>
                {isCreator && !userStatus?.onboarding_completed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goBackToOnboarding}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à l'onboarding
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
              </div>
            </header>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6"
            >
              {isCreator && <CreatorStudio />}
              {isPrinter && <PrinterStudio />}
            </motion.div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Studio;
