
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplatesManagement from './TemplatesManagement';
import ProductsManagement from './ProductsManagement';
import CreatorProductsOverview from './products/CreatorProductsOverview';
import { CreatorProductValidation } from './products/CreatorProductValidation';
import UsersManagement from './UsersManagement';
import OrdersManagement from './OrdersManagement';
import StatisticsPanel from './StatisticsPanel';
import ContentManagement from './content/ContentManagement';
import MediaManagement from './MediaManagement';
import PagesManagement from './PagesManagement';
import SiteSettings from './SiteSettings';
import TechnicalDocumentation from './TechnicalDocumentation';
import { SecurityMonitoring } from './SecurityMonitoring';

const NewAdminTabs = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="templates">Gabarits</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="creator-products">Créateurs</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <StatisticsPanel />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityMonitoring />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesManagement />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsManagement />
        </TabsContent>

        <TabsContent value="creator-products" className="space-y-4">
          <CreatorProductsOverview />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <CreatorProductValidation />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrdersManagement />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <MediaManagement />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <PagesManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SiteSettings />
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <TechnicalDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewAdminTabs;
