
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import NewDesign from "@/components/creator/NewDesign";
import DesignList from "@/components/creator/DesignList";
import SalesPanel from "@/components/creator/SalesPanel";

const CreatorStudio: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("newDesign");
  const [userDesigns, setUserDesigns] = useState<any[]>([]);
  
  // Fetch user designs on component mount
  useEffect(() => {
    if (user) {
      fetchUserDesigns();
    }
  }, [user]);

  const fetchUserDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('creator_id', user?.id);
      
      if (error) throw error;
      setUserDesigns(data || []);
    } catch (error) {
      console.error("Error fetching user designs:", error);
    }
  };
  
  const handleDesignCreated = () => {
    fetchUserDesigns();
    setActiveTab("myDesigns");
  };

  const handleCreateDesignClick = () => {
    setActiveTab("newDesign");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mon Studio de Création</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="newDesign">Nouveau Design</TabsTrigger>
          <TabsTrigger value="myDesigns">Mes Designs</TabsTrigger>
          <TabsTrigger value="sales">Mes Ventes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="newDesign">
          <NewDesign onDesignCreated={handleDesignCreated} />
        </TabsContent>
        
        <TabsContent value="myDesigns">
          <Card>
            <CardHeader>
              <CardTitle>Mes Designs</CardTitle>
              <CardDescription>
                Tous vos designs téléchargés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignList 
                designs={userDesigns} 
                onDesignUpdated={fetchUserDesigns}
                onCreateDesign={handleCreateDesignClick}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <SalesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorStudio;
