
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MaintenanceManagement = () => {
  const { toast } = useToast();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger l'état de maintenance depuis localStorage
    const savedState = localStorage.getItem('maintenance_mode');
    setIsMaintenanceMode(savedState === 'true');
  }, []);

  const toggleMaintenanceMode = async () => {
    setIsLoading(true);
    
    try {
      const newState = !isMaintenanceMode;
      
      // Sauvegarder l'état dans localStorage
      localStorage.setItem('maintenance_mode', newState.toString());
      
      setIsMaintenanceMode(newState);
      
      toast({
        title: newState ? "Mode maintenance activé" : "Mode maintenance désactivé",
        description: newState 
          ? "Le site affiche maintenant la page de maintenance pour tous les visiteurs."
          : "Le site est de nouveau accessible normalement.",
        variant: newState ? "destructive" : "default"
      });
      
      // Recharger la page après un court délai pour appliquer le changement
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors du changement de mode:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le mode de maintenance.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Mode Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {isMaintenanceMode ? (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
            <div>
              <h3 className="font-medium">
                {isMaintenanceMode ? "Mode maintenance ACTIVÉ" : "Site en ligne"}
              </h3>
              <p className="text-sm text-gray-600">
                {isMaintenanceMode 
                  ? "Les visiteurs voient la page de maintenance"
                  : "Le site fonctionne normalement"
                }
              </p>
            </div>
          </div>
          
          <Switch
            checked={isMaintenanceMode}
            onCheckedChange={toggleMaintenanceMode}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Informations</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Quand le mode maintenance est activé, tous les visiteurs voient une page d'information.</p>
            <p>• Les super administrateurs peuvent toujours accéder au site normalement.</p>
            <p>• Le changement est immédiat et affecte tous les utilisateurs.</p>
          </div>
        </div>

        <Button 
          onClick={toggleMaintenanceMode}
          disabled={isLoading}
          variant={isMaintenanceMode ? "default" : "destructive"}
          className="w-full"
        >
          {isLoading ? "Traitement..." : isMaintenanceMode ? "Désactiver la maintenance" : "Activer la maintenance"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MaintenanceManagement;
