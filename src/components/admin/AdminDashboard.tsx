
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  File, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  CheckCircle,
  Plus,
  Eye,
  Settings
} from "lucide-react";

interface DashboardStats {
  templatesCount: number;
  productsCount: number;
  ordersCount: number;
  creatorsCount: number;
  pendingProductsCount: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    templatesCount: 0,
    productsCount: 0,
    ordersCount: 0,
    creatorsCount: 0,
    pendingProductsCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Charger les statistiques réelles
      const [templatesResult, productsResult, ordersResult, usersResult] = await Promise.all([
        supabase.from('product_templates').select('id', { count: 'exact' }),
        supabase.from('creator_products').select('id', { count: 'exact' }),
        supabase.from('orders').select('id', { count: 'exact' }),
        supabase.from('users').select('id, role, creator_status', { count: 'exact' })
      ]);

      // Compter les créateurs actifs
      const creators = usersResult.data?.filter(user => 
        user.role === 'créateur' || user.creator_status === 'approved'
      ) || [];

      // Compter les produits en attente
      const pendingProducts = await supabase
        .from('creator_products')
        .select('id', { count: 'exact' })
        .eq('status', 'pending');

      // Charger l'activité récente
      const recentOrders = await supabase
        .from('orders')
        .select('id, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentProducts = await supabase
        .from('creator_products')
        .select('id, name_fr, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        templatesCount: templatesResult.count || 0,
        productsCount: productsResult.count || 0,
        ordersCount: ordersResult.count || 0,
        creatorsCount: creators.length,
        pendingProductsCount: pendingProducts.count || 0
      });

      // Construire l'activité récente
      const activity = [
        ...(recentOrders.data || []).map(order => ({
          type: 'order',
          message: `Nouvelle commande #${order.id.slice(-8)}`,
          time: formatTimeAgo(order.created_at),
          status: order.status === 'completed' ? 'success' : 'info'
        })),
        ...(recentProducts.data || []).map(product => ({
          type: 'product',
          message: `Produit "${product.name_fr}" créé`,
          time: formatTimeAgo(product.created_at),
          status: product.status === 'published' ? 'success' : 'warning'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4);

      setRecentActivity(activity);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques du tableau de bord."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour(s)`;
  };

  const handleCreateTemplate = () => {
    // Naviguer vers la gestion des gabarits et ouvrir le dialog de création
    window.dispatchEvent(new CustomEvent('openCreateTemplateDialog'));
    // Vous pourriez aussi utiliser un store global ou un contexte pour cela
  };

  const handleValidateProducts = () => {
    // Naviguer vers la section des produits en attente de validation
    navigate('/admin?tab=produits&filter=pending');
  };

  const handleProcessOrders = () => {
    // Naviguer vers la gestion des commandes
    navigate('/admin?tab=commandes');
  };

  const statsData = [
    {
      title: "Gabarits Actifs",
      value: stats.templatesCount.toString(),
      change: `${stats.templatesCount > 0 ? '+' : ''}${stats.templatesCount} au total`,
      icon: File,
      color: "text-blue-600"
    },
    {
      title: "Produits Personnalisés",
      value: stats.productsCount.toString(),
      change: `${stats.pendingProductsCount} en attente`,
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Commandes",
      value: stats.ordersCount.toString(),
      change: `${stats.ordersCount} au total`,
      icon: ShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Créateurs Actifs",
      value: stats.creatorsCount.toString(),
      change: `${stats.creatorsCount} inscrits`,
      icon: Users,
      color: "text-purple-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
        <p className="text-gray-600">Vue d'ensemble de votre plateforme Podsleek V2</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              État du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Opérationnelle</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stockage média</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Produits en attente</span>
                <Badge variant={stats.pendingProductsCount > 0 ? "default" : "secondary"} 
                       className={stats.pendingProductsCount > 0 ? "bg-yellow-100 text-yellow-800" : ""}>
                  {stats.pendingProductsCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-start gap-2 hover:bg-blue-50 border-blue-200"
              onClick={handleCreateTemplate}
            >
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <File className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Nouveau Gabarit</h3>
                <p className="text-sm text-gray-600">Ajouter un gabarit produit</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-start gap-2 hover:bg-green-50 border-green-200"
              onClick={handleValidateProducts}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Valider Produits</h3>
                <p className="text-sm text-gray-600">
                  {stats.pendingProductsCount} produit(s) en attente
                </p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="p-6 h-auto flex flex-col items-start gap-2 hover:bg-orange-50 border-orange-200"
              onClick={handleProcessOrders}
            >
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Traiter Commandes</h3>
                <p className="text-sm text-gray-600">Gestion des commandes</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
