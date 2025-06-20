
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMainContent from "./AdminMainContent";
import { useSearchParams } from "react-router-dom";

interface AdminLayoutProps {
  onSignOut: () => void;
}

const AdminLayout = ({ onSignOut }: AdminLayoutProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    const urlTab = searchParams.get("tab") || "dashboard";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
  };

  const getSectionTitle = () => {
    const sectionTitles: { [key: string]: string } = {
      "dashboard": "Tableau de bord",
      "gabarits": "Gestion des Gabarits",
      "produits": "Produits Personnalisés",
      "commandes": "Gestion des Commandes",
      "mapping": "Mapping Imprimeurs",
      "automatisation": "Automatisation",
      "utilisateurs": "Gestion des Utilisateurs",
      "parametres": "Paramètres",
      "media": "Gestion des Médias",
      "contenu": "Gestion du Contenu",
      "pages": "Gestion des Pages",
      "statistiques": "Statistiques",
      "documentation": "Documentation"
    };

    return sectionTitles[activeTab] || "Administration";
  };

  return (
    <SidebarProvider>
      <div className="flex h-full w-full">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOut={onSignOut}
        />
        
        <div className="flex-1 overflow-auto">
          <AdminHeader sectionTitle={getSectionTitle()} />
          <AdminMainContent activeTab={activeTab} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
