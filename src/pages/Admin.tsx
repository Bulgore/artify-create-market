
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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
import AdminTabs from "@/components/admin/AdminTabs";
import { 
  Settings, 
  Users, 
  LayoutDashboard, 
  Search,
  Activity,
  LogOut,
  CreditCard,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Rediriger si non connecté ou non admin
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else if (!isAdmin()) {
      navigate("/");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
    }
  }, [user, navigate, isAdmin, toast]);

  if (!user || !isAdmin()) {
    return null; // Ne rien rendre pendant la redirection
  }

  const handleTabChange = (tabName: string) => {
    // Trouver l'élément AdminTabs
    const adminTabs = document.querySelector('[data-admin-tabs="true"]');
    if (!adminTabs) return;
    
    // Trouver le trigger du tab correspondant et le cliquer
    const tabTrigger = adminTabs.querySelector(`[value="${tabName}"]`);
    if (tabTrigger instanceof HTMLElement) {
      tabTrigger.click();
    }
  };

  return (
    <div className="h-screen w-full bg-slate-100">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar side="left" variant="sidebar">
            <SidebarHeader className="bg-[#333945] text-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-orange-400">DASHBOARD</h2>
              </div>
              <div className="mt-4 relative">
                <Input 
                  placeholder="Rechercher" 
                  className="pl-8 bg-white/10 border-none text-white" 
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/60" />
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#333945] text-white px-2 py-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("general")}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Général</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("users")}
                  >
                    <Users className="h-5 w-5" />
                    <span>Utilisateurs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("pricing")}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Prix et Marges</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("statistics")}
                  >
                    <Activity className="h-5 w-5" />
                    <span>Statistiques</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("pages")}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Pages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38]"
                    onClick={() => handleTabChange("builder")}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Builder.io</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                <span>Déconnexion</span>
              </div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 overflow-auto">
            <header className="bg-white p-4 flex items-center justify-between border-b">
              <h1 className="text-xl font-semibold">Administration</h1>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">
                  {user.user_metadata?.full_name || "Admin User"}
                </span>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                  {(user.user_metadata?.full_name || "A")[0]}
                </div>
              </div>
            </header>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6"
            >
              <AdminTabs data-admin-tabs="true" />
            </motion.div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
