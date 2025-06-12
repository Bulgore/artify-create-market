
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMainContent from "./AdminMainContent";

interface AdminLayoutProps {
  onSignOut: () => void;
}

const AdminLayout = ({ onSignOut }: AdminLayoutProps) => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const getSectionTitle = () => {
    const sidebarSections = [
      {
        title: "Contenu",
        items: [
          { id: "pages", name: "Pages" },
          { id: "products", name: "Produits" },
          { id: "blocks", name: "Blocs" },
          { id: "templates", name: "Gabarits" }
        ]
      },
      {
        title: "Apparence", 
        items: [
          { id: "menu", name: "Menu principal" },
          { id: "footer", name: "Pied de page" },
          { id: "theme", name: "Thème du site" }
        ]
      },
      {
        title: "Outils",
        items: [
          { id: "media", name: "Médias" },
          { id: "calendar", name: "Calendrier" },
          { id: "automation", name: "Automatisations" },
          { id: "maintenance", name: "Maintenance" }
        ]
      }
    ];

    if (activeSection === "dashboard") return "Dashboard";
    const allItems = sidebarSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.id === activeSection);
    return currentItem?.name || "Administration";
  };

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <AdminSidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onSignOut={onSignOut}
        />
        
        <div className="flex-1 overflow-auto">
          <AdminHeader sectionTitle={getSectionTitle()} />
          <AdminMainContent activeSection={activeSection} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
