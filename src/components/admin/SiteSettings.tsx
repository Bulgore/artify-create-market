
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SiteSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les paramètres ont été mis à jour avec succès."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres du Site</CardTitle>
        <CardDescription>Configurez les paramètres généraux de la plateforme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="email">E-mail</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Stripe</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Clé API Publique</label>
                  <Input placeholder="pk_test_..." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Clé API Secrète</label>
                  <Input type="password" placeholder="sk_test_..." />
                  <p className="text-xs text-gray-500">
                    La clé secrète ne sera stockée que dans un environnement sécurisé et ne sera pas visible après enregistrement.
                  </p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Mode</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="test">Test</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">PayPal</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">ID Client</label>
                  <Input />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Secret</label>
                  <Input type="password" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Mode</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Configuration SMTP</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Serveur SMTP</label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Port</label>
                  <Input type="number" placeholder="587" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Utilisateur</label>
                  <Input placeholder="user@example.com" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Mot de passe</label>
                  <Input type="password" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Adresse d'expéditeur</label>
                  <Input placeholder="noreply@votresite.com" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Notifications</h3>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="new-order" className="rounded" />
                  <label htmlFor="new-order" className="text-sm">Envoyer un email lors d'une nouvelle commande</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="new-user" className="rounded" />
                  <label htmlFor="new-user" className="text-sm">Envoyer un email lors d'une nouvelle inscription</label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={handleSaveSettings}
            className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteSettings;
