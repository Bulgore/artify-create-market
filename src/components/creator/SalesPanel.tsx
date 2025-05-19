
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SalesPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Ventes</CardTitle>
        <CardDescription>
          Historique et statistiques de vos ventes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-gray-500">
          <p>Vous n'avez pas encore de ventes.</p>
          <p className="mt-2">Commencez par télécharger vos designs et les rendre publics.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPanel;
