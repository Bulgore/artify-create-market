
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from "@/components/admin/UsersManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import DesignsManagement from "@/components/admin/DesignsManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import PricingManagement from "@/components/admin/pricing/PricingManagement";

interface AdminTabsProps {
  defaultTab?: string;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ defaultTab = "users" }) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="products">Produits</TabsTrigger>
        <TabsTrigger value="designs">Designs</TabsTrigger>
        <TabsTrigger value="pages">Pages du Site</TabsTrigger>
        <TabsTrigger value="pricing">Tarifs & Paiements</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <UsersManagement />
      </TabsContent>
      
      <TabsContent value="products">
        <ProductsManagement />
      </TabsContent>
      
      <TabsContent value="designs">
        <DesignsManagement />
      </TabsContent>
      
      <TabsContent value="pages">
        <PagesManagement />
      </TabsContent>
      
      <TabsContent value="pricing">
        <PricingManagement />
      </TabsContent>
      
      <TabsContent value="settings">
        <SiteSettings />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
