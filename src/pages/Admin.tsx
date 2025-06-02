
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
import PagesManagement from "@/components/admin/PagesManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import BlocksManagement from "@/components/admin/content/BlocksManagement";
import MenuManagement from "@/components/admin/content/MenuManagement";
import FooterManagement from "@/components/admin/FooterManagement";
import ThemeManagement from "@/components/admin/ThemeManagement";
import MediaManagement from "@/components/admin/MediaManagement";
import CalendarManagement from "@/components/admin/CalendarManagement";
import AutomationManagement from "@/components/admin/AutomationManagement";
import TemplatesManagement from "@/components/admin/TemplatesManagement";
import { 
  Settings, 
  Users, 
  LayoutDashboard, 
  Search,
  Activity,
  LogOut,
  CreditCard,
  FileText,
  Package,
  Blocks,
  Menu,
  Image,
  Calendar,
  Zap,
  Palette,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const { user, isAdmin, isSuperAdmin, signOut } = useAuth();
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

  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const sidebarSections = [
    {
      title: "Contenu",
      items: [
        { id: "pages", name: "Pages", component: "PagesManagement", icon: FileText },
        { id: "products", name: "Produits", component: "ProductsManagement", icon: Package },
        { id: "blocks", name: "Blocs", component: "BlocksManagement", icon: Blocks },
        // Gabarits visible uniquement pour superAdmin
        ...(isSuperAdmin() ? [
          { id: "templates", name: "Gabarits", component: "TemplatesManagement", icon: Layers }
        ] : [])
      ]
    },
    {
      title: "Apparence", 
      items: [
        { id: "menu", name: "Menu principal", component: "MenuManagement", icon: Menu },
        { id: "footer", name: "Pied de page", component: "FooterManagement", icon: FileText },
        { id: "theme", name: "Thème du site", component: "ThemeManagement", icon: Palette }
      ]
    },
    {
      title: "Outils",
      items: [
        { id: "media", name: "Médias", component: "MediaManagement", icon: Image },
        { id: "calendar", name: "Calendrier", component: "CalendarManagement", icon: Calendar },
        { id: "automation", name: "Automatisations", component: "AutomationManagement", icon: Zap }
      ]
    }
  ];

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <NewAdminTabs />;
      case "pages":
        return <PagesManagement />;
      case "products":
        return <ProductsManagement />;
      case "blocks":
        return <BlocksManagement />;
      case "templates":
        return <TemplatesManagement />;
      case "menu":
        return <MenuManagement />;
      case "footer":
        return <FooterManagement />;
      case "theme":
        return <ThemeManagement />;
      case "media":
        return <MediaManagement />;
      case "calendar":
        return <CalendarManagement />;
      case "automation":
        return <AutomationManagement />;
      default:
        return <NewAdminTabs />;
    }
  };

  const getSectionTitle = () => {
    if (activeSection === "dashboard") return "Dashboard";
    const allItems = sidebarSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.id === activeSection);
    return currentItem?.name || "Administration";
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
                    className={`w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38] ${activeSection === "dashboard" ? "bg-[#282f38] text-white" : ""}`}
                    onClick={() => setActiveSection("dashboard")}
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
                    {section.items.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton 
                            className={`w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-[#282f38] ${activeSection === item.id ? "bg-[#282f38] text-white" : ""}`}
                            onClick={() => setActiveSection(item.id)}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span>{item.name}</span>
                            {item.id === "templates" && (
                              <span className="ml-auto text-xs bg-orange-500 px-1.5 py-0.5 rounded text-white">
                                SA
                              </span>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
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
              <h1 className="text-xl font-semibold">{getSectionTitle()}</h1>
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
