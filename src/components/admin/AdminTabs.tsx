
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from "./UsersManagement";
import PagesManagement from "./PagesManagement";
import ProductsManagement from "./ProductsManagement";
import PricingManagement from "./pricing/PricingManagement";
import DesignsManagement from "./DesignsManagement";
import SiteSettings from "./SiteSettings";
import BuilderManagement from "./BuilderManagement";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="flex flex-wrap justify-between md:grid md:grid-cols-5 mb-6">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
        <TabsTrigger value="builder">Builder.io</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <SiteSettings />
        </div>
      </TabsContent>

      <TabsContent value="users" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <UsersManagement />
        </div>
      </TabsContent>

      <TabsContent value="statistics" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <PricingManagement />
        </div>
      </TabsContent>

      <TabsContent value="settings" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <PagesManagement />
        </div>
      </TabsContent>

      <TabsContent value="builder" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <BuilderManagement />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
