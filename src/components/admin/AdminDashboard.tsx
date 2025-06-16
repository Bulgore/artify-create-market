
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    templates: 0,
    creatorProducts: 0,
    orders: 0,
    creators: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Compter les gabarits
      const { count: templatesCount } = await supabase
        .from('product_templates')
        .select('id', { count: 'exact', head: true });
      
      // Compter les produits créateurs
      const { count: productsCount } = await supabase
        .from('creator_products')
        .select('id', { count: 'exact', head: true });
      
      // Compter les commandes
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true });
      
      // Compter les créateurs
      const { count: creatorsCount } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'créateur');

      setStats({
        templates: templatesCount || 0,
        creatorProducts: productsCount || 0,
        orders: ordersCount || 0,
        creators: creatorsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Gabarits",
      value: stats.templates,
      icon: File,
      description: "Gabarits disponibles"
    },
    {
      title: "Produits Personnalisés",
      value: stats.creatorProducts,
      icon: Package,
      description: "Créés par les créateurs"
    },
    {
      title: "Commandes",
      value: stats.orders,
      icon: ShoppingCart,
      description: "Commandes totales"
    },
    {
      title: "Créateurs",
      value: stats.creators,
      icon: Users,
      description: "Créateurs actifs"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Podsleek V2</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme centralisée</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : card.value}
              </div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workflow V2</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">1. Super Admin</h4>
              <p className="text-sm text-blue-700">Crée et gère les gabarits + zones d'impression</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">2. Créateurs</h4>
              <p className="text-sm text-green-700">Utilisent les gabarits pour créer des produits personnalisés</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900">3. Commandes Automatiques</h4>
              <p className="text-sm text-orange-700">Routage automatique vers l'imprimeur associé au gabarit</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
              📋 Créer un nouveau gabarit
            </button>
            <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
              📦 Voir les dernières commandes
            </button>
            <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
              🎨 Produits en attente de validation
            </button>
            <button className="w-full text-left p-3 rounded hover:bg-gray-50 border">
              🚚 Configurer le mapping imprimeurs
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
