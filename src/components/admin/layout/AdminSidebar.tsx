
import React from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Search,
  LogOut,
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

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSignOut: () => void;
}

const AdminSidebar = ({ activeSection, setActiveSection, onSignOut }: AdminSidebarProps) => {
  const { isSuperAdmin } = useAuth();

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

  return (
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
          onClick={onSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
