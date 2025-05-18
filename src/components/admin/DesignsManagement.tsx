
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

const DesignsManagement = () => {
  const { toast } = useToast();
  const [designs, setDesigns] = useState<any[]>([]);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
        .select('*');
      
      if (error) throw error;
      setDesigns(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des designs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des designs.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Designs</CardTitle>
        <CardDescription>Administrez tous les designs créés sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Créateur</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    Aucun design disponible
                  </TableCell>
                </TableRow>
              ) : (
                designs.map((design) => (
                  <TableRow key={design.id}>
                    <TableCell className="font-medium">{design.name}</TableCell>
                    <TableCell>{design.creator_id || 'Non assigné'}</TableCell>
                    <TableCell>{design.price} €</TableCell>
                    <TableCell>
                      <Badge variant={design.is_published ? "success" : "secondary"}>
                        {design.is_published ? 'Publié' : 'Brouillon'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignsManagement;
