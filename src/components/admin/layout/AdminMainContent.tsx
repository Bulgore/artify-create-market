
import React from "react";
import AdminDashboard from "../AdminDashboard";
import TemplatesManagement from "../TemplatesManagement";
import OrdersManagement from "../OrdersManagement";
import PrinterMappingManagement from "../PrinterMappingManagement";
import OrderAutomation from "../automation/OrderAutomation";
import CreatorProductsOverview from "../products/CreatorProductsOverview";
import UsersManagement from "../UsersManagement";
import SiteSettings from "../SiteSettings";
import MediaManagement from "../MediaManagement";
import ContentManagement from "../content/ContentManagement";
import PagesManagement from "../PagesManagement";
import StatisticsPanel from "../StatisticsPanel";
import TechnicalDocumentation from "../TechnicalDocumentation";

interface AdminMainContentProps {
  activeTab: string;
}

const AdminMainContent: React.FC<AdminMainContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "gabarits":
        return <TemplatesManagement />;
      case "produits":
        return <CreatorProductsOverview />;
      case "commandes":
        return <OrdersManagement />;
      case "mapping":
        return <PrinterMappingManagement />;
      case "automatisation":
        return <OrderAutomation />;
      case "utilisateurs":
        return <UsersManagement />;
      case "parametres":
        return <SiteSettings />;
      case "media":
        return <MediaManagement />;
      case "contenu":
        return <ContentManagement />;
      case "pages":
        return <PagesManagement />;
      case "statistiques":
        return <StatisticsPanel />;
      case "documentation":
        return <TechnicalDocumentation />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

export default AdminMainContent;
