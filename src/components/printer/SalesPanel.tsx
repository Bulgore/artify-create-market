
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const SalesPanel: React.FC = () => {
  // Mock data for sales statistics display
  const salesStats = [
    { month: "Mai", sales: 0, revenue: "0.00 €" },
    { month: "Juin", sales: 0, revenue: "0.00 €" },
    { month: "Juillet", sales: 0, revenue: "0.00 €" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Ventes</CardTitle>
        <CardDescription>
          Historique et statistiques de vos ventes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {salesStats.some(stat => stat.sales > 0) ? (
          <>
            <h4 className="text-lg font-medium mb-4">Statistiques récentes</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Période</TableHead>
                  <TableHead>Ventes</TableHead>
                  <TableHead>Revenus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell>{stat.month}</TableCell>
                    <TableCell>{stat.sales}</TableCell>
                    <TableCell>{stat.revenue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Vous n'avez pas encore de ventes.</p>
            <p className="mt-2">Commencez par télécharger vos designs et les rendre publics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPanel;
