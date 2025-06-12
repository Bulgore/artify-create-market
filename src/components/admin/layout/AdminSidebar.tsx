import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Menu,
  Palette,
  Images,
  Calendar,
  Wrench,
  Layers,
  LifeBuoy,
  LogOut,
  Zap,
  FileTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSignOut: () => void;
}

const AdminSidebar = ({ activeSection, setActiveSection, onSignOut }: AdminSidebarProps) => {
  const sidebarSections = [
    {
      title: "Contenu",
      items: [
        { id: "pages", name: "Pages", icon: FileText },
        { id: "products", name: "Produits", icon: Package },
        { id: "blocks", name: "Blocs", icon: Layers },
        { id: "templates", name: "Gabarits", icon: FileTemplate }
      ]
    },
    {
      title: "Apparence", 
      items: [
        { id: "menu", name: "Menu principal", icon: Menu },
        { id: "footer", name: "Pied de page", icon: LifeBuoy },
        { id: "theme", name: "Thème du site", icon: Palette }
      ]
    },
    {
      title: "Outils",
      items: [
        { id: "media", name: "Médias", icon: Images },
        { id: "calendar", name: "Calendrier", icon: Calendar },
        { id: "automation", name: "Automatisations", icon: Zap },
        { id: "maintenance", name: "Maintenance", icon: Wrench }
      ]
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">Administration</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveSection("dashboard")}
                  isActive={activeSection === "dashboard"}
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sidebarSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          onClick={onSignOut}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
