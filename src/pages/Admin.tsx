
import React, { useEffect, useState } from "react";
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
import NewAdminTabs from "@/components/admin/NewAdminTabs";
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

  const [activeSection, setActiveSection] = useState<string>("content");

  const sidebarSections = [
    {
      title: "Contenu",
      items: [
        { id: "pages", name: "Pages", component: "PagesManagement" },
        { id: "products", name: "Produits", component: "ProductsManagement" },
        { id: "blocks", name: "Blocs", component: "BlocksManagement" }
      ]
    },
    {
      title: "Apparence", 
      items: [
        { id: "menu", name: "Menu principal", component: "MenuManagement" },
        { id: "footer", name: "Pied de page", component: "FooterManagement" },
        { id: "theme", name: "Thème du site", component: "ThemeManagement" }
      ]
    },
    {
      title: "Outils",
      items: [
        { id: "media", name: "Médias", component: "MediaManagement" },
        { id: "calendar", name: "Calendrier", component: "CalendarManagement" },
        { id: "automation", name: "Automatisations", component: "AutomationManagement" }
      ]
    }
  ];

  const renderMainContent = () => {
    if (activeSection === "content") {
      return <NewAdminTabs />;
    }
    
    // Gérer les autres sections ici
    return <div className="p-6">Section en développement</div>;
  };

  return (
    <div className="h-screen w-full bg-slate-100">
      <SidebarProvider>
        <div className="flex h-full w-full">
          <Sidebar side="left" variant="sidebar">
            <SidebarHeader className="bg-[#333945] text-white p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-orange-400">ADMINISTRATION</h2>
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
                {/* Section principale - Dashboard */}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className={`w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38] ${activeSection === "content" ? "bg-[#282f38] text-white" : ""}`}
                    onClick={() => setActiveSection("content")}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Sections dynamiques */}
                {sidebarSections.map((section) => (
                  <div key={section.title} className="mt-6">
                    <div className="px-3 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                      {section.title}
                    </div>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          className={`w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38] ${activeSection === item.id ? "bg-[#282f38] text-white" : ""}`}
                          onClick={() => setActiveSection(item.id)}
                        >
                          <FileText className="h-5 w-5" />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
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
              {renderMainContent()}
            </motion.div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
