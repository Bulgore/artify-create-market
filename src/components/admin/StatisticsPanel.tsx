
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const StatisticsPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    
    try {
      // Exemple de récupération de données pour les statistiques
      // Dans un environnement réel, vous devriez avoir des requêtes SQL appropriées
      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select('*');
      
      if (salesError) throw salesError;
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*');
      
      if (userError) throw userError;
      
      // Transformer les données pour les graphiques
      const processedSalesData = processSalesData(salesData || []);
      setSalesData(processedSalesData);
      
      const processedUserData = processUserData(userData || []);
      setUserData(processedUserData);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour transformer les données de ventes pour les graphiques
  const processSalesData = (data: any[]) => {
    // Exemple simplifié: compter les commandes par mois
    const months: Record<string, number> = {};
    
    data.forEach(order => {
      const date = new Date(order.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = 0;
      }
      
      months[monthYear] += 1;
    });
    
    return Object.keys(months).map(month => ({
      name: month,
      orders: months[month]
    }));
  };
  
  // Fonction pour transformer les données utilisateur pour les graphiques
  const processUserData = (data: any[]) => {
    // Exemple simplifié: compter les utilisateurs par rôle
    const roles: Record<string, number> = {};
    
    data.forEach(user => {
      const role = user.role || 'user';
      
      if (!roles[role]) {
        roles[role] = 0;
      }
      
      roles[role] += 1;
    });
    
    return Object.keys(roles).map(role => ({
      name: role,
      users: roles[role]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <CardTitle>Tableau de Bord des Statistiques</CardTitle>
            <CardDescription>Visualisez les performances de votre plateforme</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchStatistics}
            disabled={isLoading}
            className="mt-2 md:mt-0"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="sales" className="w-full">
          <TabsList>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution des Ventes</CardTitle>
              </CardHeader>
              <CardContent>
                {salesData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" name="Commandes" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      "Aucune donnée de vente disponible"
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Distribution des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" name="Utilisateurs" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      "Aucune donnée utilisateur disponible"
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
