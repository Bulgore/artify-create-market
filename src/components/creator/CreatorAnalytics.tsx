
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Package, Eye, DollarSign } from 'lucide-react';

interface CreatorStats {
  totalProducts: number;
  publishedProducts: number;
  totalViews: number;
  totalEarnings: number;
}

const CreatorAnalytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CreatorStats>({
    totalProducts: 0,
    publishedProducts: 0,
    totalViews: 0,
    totalEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Charger les statistiques des produits
      const { data: products, error: productsError } = await supabase
        .from('creator_products')
        .select('id, status, is_published')
        .eq('creator_id', user.id);

      if (productsError) throw productsError;

      const totalProducts = products?.length || 0;
      const publishedProducts = products?.filter(p => p.is_published).length || 0;

      // Charger les commandes pour calculer les gains
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_price, creator_products!inner(creator_id)')
        .eq('creator_products.creator_id', user.id);

      const totalEarnings = orders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

      setStats({
        totalProducts,
        publishedProducts,
        totalViews: 0, // À implémenter avec un système de tracking
        totalEarnings
      });

    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Produits Total",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-blue-600"
    },
    {
      title: "Produits Publiés",
      value: stats.publishedProducts.toString(),
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Vues Total",
      value: stats.totalViews.toString(),
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Gains Total",
      value: `${stats.totalEarnings.toFixed(2)}€`,
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Mes Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des Performances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p>Graphiques détaillés bientôt disponibles</p>
            <p className="text-sm">Suivez l'évolution de vos ventes et de votre audience</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
