import React, { useEffect } from "react";
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
  LogOut
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/useUserRole";

const Studio = () => {
  const { user, loading, signOut } = useAuth();
  const { isCreator, isPrinter, isSuperAdmin, userRole } = useUserRole();
  const navigate = useNavigate();
  
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
              <h1 className="text-xl font-semibold">
                {isCreator ? "Studio de Création" : isPrinter ? "Dashboard Imprimeur" : "Studio"}
              </h1>
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
