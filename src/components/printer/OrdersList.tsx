
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const OrdersList: React.FC = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <p>Vous n'avez pas encore de commandes à imprimer.</p>
      <p className="mt-2">Les nouvelles commandes apparaîtront ici.</p>
    </div>
  );
};

export default OrdersList;
