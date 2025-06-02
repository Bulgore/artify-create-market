
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BlocksManagement = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Blocs Réutilisables</CardTitle>
          <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un bloc
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <p>Aucun bloc réutilisable créé</p>
          <p className="text-sm mt-2">Créez des blocs pour les réutiliser sur plusieurs pages</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlocksManagement;
