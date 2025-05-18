
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const SiteSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du Site</CardTitle>
        <CardDescription>Configurez les paramètres généraux de la plateforme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Informations du Site</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom du site</label>
              <Input defaultValue="Podsleek" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Input defaultValue="Plateforme de création et d'impression à la demande" />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Configurations Avancées</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Commission par vente (%)</label>
              <Input type="number" defaultValue="10" min="0" max="100" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Délai de traitement maximum (jours)</label>
              <Input type="number" defaultValue="5" min="1" />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;
