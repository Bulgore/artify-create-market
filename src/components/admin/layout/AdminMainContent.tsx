
import React from "react";
import { motion } from "framer-motion";
import TemplatesManagement from "@/components/admin/TemplatesManagement";
import CreatorProductsOverview from "@/components/admin/products/CreatorProductsOverview";
import OrdersManagement from "@/components/admin/OrdersManagement";
import PrinterMappingManagement from "@/components/admin/PrinterMappingManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import AdminDashboard from "@/components/admin/AdminDashboard";

interface AdminMainContentProps {
  activeSection: string;
}

const AdminMainContent = ({ activeSection }: AdminMainContentProps) => {
  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "templates":
        return <TemplatesManagement />;
      case "creator-products":
        return <CreatorProductsOverview />;
      case "orders":
        return <OrdersManagement />;
      case "printer-mapping":
        return <PrinterMappingManagement />;
      case "users":
        return <UsersManagement />;
      case "settings":
        return <SiteSettings />;
      default:
        return <AdminDashboard />;
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
