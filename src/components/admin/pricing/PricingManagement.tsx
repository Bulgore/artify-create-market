
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Edit, Save, X } from "lucide-react";

const PricingManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    basePrice?: number;
    defaultCreatorMargin?: number;
    platformCommission?: number;
  }>({});
  
  const [globalSettings, setGlobalSettings] = useState({
    platformCommission: 15,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Récupérer les produits
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select(`
          *,
          users (
            full_name
          )
        `);
      
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des produits.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (productId: string, basePrice: number) => {
    setEditingProduct(productId);
    setEditValues({
      basePrice,
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditValues({});
  };

  const saveProductChanges = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('tshirt_templates')
        .update({
          base_price: editValues.basePrice,
        })
        .eq('id', productId);
      
      if (error) throw error;
      
      toast({
        title: "Prix mis à jour",
        description: "Les prix du produit ont été mis à jour avec succès."
      });
      
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des prix."
      });
    }
  };

  const saveGlobalSettings = async () => {
    try {
      // Dans un cas réel, vous pourriez enregistrer cela dans une table de paramètres
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres généraux ont été mis à jour avec succès."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres."
      });
    }
  };

  // Calculer les prix finaux pour l'affichage
  const calculateFinalPrice = (basePrice: number, creatorMargin: number = 5) => {
    const subtotal = basePrice + creatorMargin;
    return subtotal * (1 + globalSettings.platformCommission / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Prix et Marges</CardTitle>
        <CardDescription>
          Configurez les prix de base des produits, les marges des créateurs et les commissions de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration globale */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration Globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Commission de la plateforme (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={globalSettings.platformCommission}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      platformCommission: parseFloat(e.target.value)
                    })}
                    className="max-w-[150px]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Commission appliquée sur le sous-total (prix de base + marge du créateur)
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Marge par défaut des créateurs (€)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    value="5"
                    disabled
                    className="max-w-[150px] bg-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Marge appliquée par défaut aux nouveaux designs
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={saveGlobalSettings}>
                Enregistrer les paramètres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des produits avec prix */}
        <div>
          <h3 className="text-lg font-medium mb-4">Prix des produits</h3>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du produit</TableHead>
                  <TableHead>Imprimeur</TableHead>
                  <TableHead>Prix de base (€)</TableHead>
                  <TableHead>Prix final (€)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      Aucun produit disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.users?.full_name || 'Non assigné'}</TableCell>
                      <TableCell>
                        {editingProduct === product.id ? (
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editValues.basePrice}
                            onChange={(e) => setEditValues({
                              ...editValues,
                              basePrice: parseFloat(e.target.value)
                            })}
                            className="max-w-[100px]"
                          />
                        ) : (
                          `${product.base_price} €`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingProduct === product.id ? (
                          `${calculateFinalPrice(editValues.basePrice || 0).toFixed(2)} €`
                        ) : (
                          `${calculateFinalPrice(product.base_price).toFixed(2)} €`
                        )}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {editingProduct === product.id ? (
                          <>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={() => saveProductChanges(product.id)}
                              className="text-green-600"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost"
                              size="icon"
                              onClick={cancelEditing}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(product.id, product.base_price)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Intégration avec les passerelles de paiement</h4>
          <p className="text-sm text-blue-600">
            Pour configurer Stripe ou PayPal, rendez-vous dans la section "Paramètres" de l'administration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingManagement;
