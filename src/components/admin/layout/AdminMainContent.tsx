
import React from "react";
import { motion } from "framer-motion";
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
import MaintenanceManagement from "@/components/admin/MaintenanceManagement";
import UsersManagement from "@/components/admin/UsersManagement";

interface AdminMainContentProps {
  activeSection: string;
}

const AdminMainContent = ({ activeSection }: AdminMainContentProps) => {
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
      case "maintenance":
        return <MaintenanceManagement />;
      case "users":
        return <UsersManagement />;
      default:
        return <NewAdminTabs />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      {renderMainContent()}
    </motion.div>
  );
};

export default AdminMainContent;
