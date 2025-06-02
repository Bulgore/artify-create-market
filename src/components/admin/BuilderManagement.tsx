
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const BuilderManagement = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Constructeurs</CardTitle>
          <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Constructeur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <p>Fonctionnalité en développement</p>
          <p className="text-sm mt-2">La gestion des constructeurs sera bientôt disponible</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuilderManagement;
