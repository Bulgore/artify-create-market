
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, Users, Settings } from 'lucide-react';
import { SimplifiedProductCreation } from './SimplifiedProductCreation';
import DesignList from './DesignList';
import SalesPanel from './SalesPanel';
import OnboardingBanner from './onboarding/OnboardingBanner';

const CreatorWorkspace: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    productsCount: 0,
    publishedProducts: 0,
    totalSales: 0
  });
  const [creatorStatus, setCreatorStatus] = useState<string>('draft');
  const [isLoading, setIsLoading] = useState(true);
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    if (user) {
      loadCreatorData();
    }
  }, [user]);

  const loadCreatorData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Charger les statistiques du créateur
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('creator_status, products_count')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      setCreatorStatus(userData?.creator_status || 'draft');

      // Compter les produits
      const { count: totalProducts, error: countError } = await supabase
        .from('creator_products')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      if (countError) throw countError;

      const { count: publishedProducts, error: publishedError } = await supabase
        .from('creator_products')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)
        .eq('is_published', true);

      if (publishedError) throw publishedError;

      // Charger les produits/designs
      const { data: designsData, error: designsError } = await supabase
        .from('creator_products')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (designsError) throw designsError;

      setDesigns(designsData || []);
      setStats({
        productsCount: totalProducts || 0,
        publishedProducts: publishedProducts || 0,
        totalSales: 0 // À implémenter plus tard
      });

    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Profil approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En validation</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Corrections requises</Badge>;
      default:
        return <Badge variant="outline">Brouillon</Badge>;
    }
  };

  const handleProductCreate = async (productData: any) => {
    // Logic to handle product creation
    console.log('Creating product:', productData);
    // Refresh data after creation
    await loadCreatorData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bandeau d'onboarding */}
      <OnboardingBanner 
        productsCount={stats.productsCount}
        creatorStatus={creatorStatus}
      />

      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {getStatusBadge(creatorStatus)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits créés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedProducts} publiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              À venir
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              À venir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Mes Produits</TabsTrigger>
          <TabsTrigger value="create">Créer un Produit</TabsTrigger>
          <TabsTrigger value="designs">Mes Designs</TabsTrigger>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <DesignList 
            designs={designs}
            onDesignUpdated={loadCreatorData}
            onCreateDesign={() => {
              // Switch to create tab
              const createTab = document.querySelector('[data-state="inactive"][value="create"]') as HTMLElement;
              if (createTab) createTab.click();
            }}
          />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <SimplifiedProductCreation 
            printProducts={[]}
            onProductCreate={handleProductCreate}
          />
        </TabsContent>

        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bibliothèque de designs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gérez vos designs et créations ici. Fonctionnalité à venir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SalesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorWorkspace;
