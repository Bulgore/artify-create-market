
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Template, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeCreators: 23,
    totalTemplates: 12,
    publishedProducts: 89,
    pendingOrders: 7,
    completedOrders: 234,
    automationStatus: 'active' as 'active' | 'paused' | 'error',
    lastAutomation: '2024-01-15T14:30:00Z'
  });

  const quickActions = [
    {
      title: "Nouveau Gabarit",
      description: "Créer un nouveau gabarit de produit",
      icon: Template,
      action: "gabarits",
      color: "bg-blue-500"
    },
    {
      title: "Gérer Commandes",
      description: "Voir les commandes en attente",
      icon: ShoppingCart,
      action: "commandes",
      color: "bg-green-500"
    },
    {
      title: "Configuration Mapping",
      description: "Attribuer gabarits aux imprimeurs",
      icon: Users,
      action: "mapping",
      color: "bg-purple-500"
    },
    {
      title: "Automatisation",
      description: "Gérer le workflow automatisé",
      icon: Zap,
      action: "automatisation",
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "order",
      message: "Nouvelle commande #ORDER-156 reçue",
      time: "Il y a 5 minutes",
      status: "new"
    },
    {
      id: 2,
      type: "automation",
      message: "Fichier de production généré pour #ORDER-155",
      time: "Il y a 12 minutes",
      status: "success"
    },
    {
      id: 3,
      type: "user",
      message: "Nouveau créateur inscrit: Marie Dupont",
      time: "Il y a 1 heure",
      status: "info"
    },
    {
      id: 4,
      type: "automation",
      message: "Commande #ORDER-154 envoyée à Pacific Print Co.",
      time: "Il y a 2 heures",
      status: "success"
    }
  ];

  const getAutomationStatusBadge = () => {
    switch (stats.automationStatus) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'paused':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pausé</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Erreur</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme Podsleek V2</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créateurs Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCreators}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTemplates} gabarits disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits Publiés</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedProducts}</div>
            <p className="text-xs text-muted-foreground">
              +5 nouveaux cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              En attente • {stats.completedOrders} terminées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statut automatisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Statut de l'Automatisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Workflow Automatisé</span>
                {getAutomationStatusBadge()}
              </div>
              <p className="text-sm text-gray-600">
                Dernière exécution: {new Date(stats.lastAutomation).toLocaleString('fr-FR')}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Voir Détails
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-medium mb-1">{action.title}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'new' ? 'bg-blue-500' : 'bg-gray-500'
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
    </div>
  );
};

export default AdminDashboard;
