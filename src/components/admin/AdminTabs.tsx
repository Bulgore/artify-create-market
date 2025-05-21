
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersManagement from "@/components/admin/UsersManagement";
import ProductsManagement from "@/components/admin/ProductsManagement";
import DesignsManagement from "@/components/admin/DesignsManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import SiteSettings from "@/components/admin/SiteSettings";
import PricingManagement from "@/components/admin/pricing/PricingManagement";
import { Card } from "@/components/ui/card";

interface AdminTabsProps {
  defaultTab?: string;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ defaultTab = "users" }) => {
  return (
    <div className="w-full col-span-full">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-6 bg-white border p-1 rounded-md">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Produits
          </TabsTrigger>
          <TabsTrigger 
            value="designs" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Designs
          </TabsTrigger>
          <TabsTrigger 
            value="pages" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Pages du Site
          </TabsTrigger>
          <TabsTrigger 
            value="pricing" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Tarifs & Paiements
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <TabsContent value="users" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <UsersManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <ProductsManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="designs" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <DesignsManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="pages" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <PagesManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <PricingManagement />
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="col-span-full">
            <Card className="p-6 shadow-sm border rounded-lg">
              <SiteSettings />
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminTabs;
