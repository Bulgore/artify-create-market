
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from "./UsersManagement";
import PagesManagement from "./PagesManagement";
import PricingManagement from "./pricing/PricingManagement";
import StatisticsPanel from "./StatisticsPanel";
import SiteSettings from "./SiteSettings";
import ContentManagement from "./content/ContentManagement";
import MenuManagement from "./content/MenuManagement";
import BlocksManagement from "./content/BlocksManagement";
import TechnicalDocumentation from "./TechnicalDocumentation";

const NewAdminTabs = () => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="flex flex-wrap justify-between md:grid md:grid-cols-5 mb-6">
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="pricing">Prix et Marges</TabsTrigger>
        <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
        <TabsTrigger value="documentation">Documentation</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="w-full">
        <UsersManagement />
      </TabsContent>
      
      <TabsContent value="pricing" className="w-full">
        <PricingManagement />
      </TabsContent>

      <TabsContent value="statistics" className="w-full">
        <StatisticsPanel />
      </TabsContent>

      <TabsContent value="settings" className="w-full">
        <div className="grid grid-cols-1 gap-6">
          <SiteSettings />
        </div>
      </TabsContent>

      <TabsContent value="documentation" className="w-full">
        <TechnicalDocumentation />
      </TabsContent>
    </Tabs>
  );
};

export default NewAdminTabs;
