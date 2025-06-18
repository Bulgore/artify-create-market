import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  File, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  CheckCircle
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Gabarits Actifs",
      value: "12",
      change: "+2 ce mois",
      icon: File,
      color: "text-blue-600"
    },
    {
      title: "Produits Personnalisés",
      value: "145",
      change: "+23 cette semaine",
      icon: Package,
      color: "text-green-600"
    },
    {
      title: "Commandes Aujourd'hui",
      value: "8",
      change: "+3 vs hier",
      icon: ShoppingCart,
      color: "text-orange-600"
    },
    {
      title: "Créateurs Actifs",
      value: "34",
      change: "+5 ce mois",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const recentActivity = [
    {
      type: "order",
      message: "Nouvelle commande #ORD-2024-001",
      time: "Il y a 2 min",
      status: "success"
    },
    {
      type: "product",
      message: "Produit personnalisé publié par Marie D.",
      time: "Il y a 15 min",
      status: "info"
    },
    {
      type: "template",
      message: "Nouveau gabarit T-shirt ajouté",
      time: "Il y a 1h",
      status: "success"
    },
    {
      type: "alert",
      message: "Stock faible pour gabarit Mug Standard",
      time: "Il y a 2h",
      status: "warning"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
        <p className="text-gray-600">Vue d'ensemble de votre plateforme Podsleek V2</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              {recentActivity.map((activity, index) => (
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
              ))}
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
                <span className="text-sm">Automatisation des commandes</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mapping imprimeurs</span>
                <Badge variant="default" className="bg-green-100 text-green-800">Configuré</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sécurité RLS</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En cours</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sauvegarde données</span>
                <Badge variant="default" className="bg-green-100 text-green-800">OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides V2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <File className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium">Nouveau Gabarit</h3>
              <p className="text-sm text-gray-600">Ajouter un gabarit produit</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Package className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium">Valider Produits</h3>
              <p className="text-sm text-gray-600">Réviser les créations</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <ShoppingCart className="h-6 w-6 text-orange-600 mb-2" />
              <h3 className="font-medium">Traiter Commandes</h3>
              <p className="text-sm text-gray-600">Gestion manuelle</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
