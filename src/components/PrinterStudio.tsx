
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProductTemplate {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
}

const PrinterStudio: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: 0,
    material: "",
    stock_quantity: 0,
    print_area: { width: 20, height: 30, unit: "cm" },
    images: ["/placeholder.svg"],
    available_sizes: ["S", "M", "L", "XL"]
  });

  // Fetch templates on component mount
  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('*')
        .eq('printer_id', user?.id);
      
      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos produits."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "base_price" || name === "stock_quantity" ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tshirt_templates')
        .insert([
          {
            printer_id: user?.id,
            name: formData.name,
            description: formData.description,
            base_price: formData.base_price,
            material: formData.material,
            stock_quantity: formData.stock_quantity,
            print_area: formData.print_area,
            images: formData.images,
            available_sizes: formData.available_sizes
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès."
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        base_price: 0,
        material: "",
        stock_quantity: 0,
        print_area: { width: 20, height: 30, unit: "cm" },
        images: ["/placeholder.svg"],
        available_sizes: ["S", "M", "L", "XL"]
      });
      
      // Refresh the templates list
      fetchTemplates();
      
    } catch (error: any) {
      console.error("Error adding template:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du produit."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Imprimeur</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Mes Produits</TabsTrigger>
          <TabsTrigger value="addProduct">Ajouter un Produit</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Mes Produits</CardTitle>
              <CardDescription>
                Gérez les produits que vous proposez aux créateurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8">Chargement des produits...</p>
              ) : templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(template => (
                    <Card key={template.id}>
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={template.images[0] || "/placeholder.svg"} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-medium mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{template.material}</p>
                        <p className="text-sm text-gray-600 mb-2">Stock: {template.stock_quantity}</p>
                        <p className="font-medium mb-4">{template.base_price} €</p>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">Modifier</Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Fonctionnalité à venir",
                                description: "La suppression de produits sera bientôt disponible."
                              });
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Vous n'avez pas encore ajouté de produits.</p>
                  <Button 
                    className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
                    onClick={() => document.querySelector('[data-value="addProduct"]')?.dispatchEvent(new MouseEvent('click'))}
                  >
                    Ajouter mon premier produit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="addProduct">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau produit</CardTitle>
              <CardDescription>
                Créez un nouveau produit disponible pour les créateurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: T-shirt coton bio"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description détaillée du produit"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Matériau</Label>
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="Ex: 100% coton bio"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Prix de base (€)</Label>
                    <Input
                      id="base_price"
                      name="base_price"
                      type="number"
                      value={formData.base_price}
                      onChange={handleInputChange}
                      min={0}
                      step={0.01}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Quantité en stock</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tailles disponibles</Label>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
                      <Button
                        key={size}
                        type="button"
                        variant={formData.available_sizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (formData.available_sizes.includes(size)) {
                            setFormData(prev => ({
                              ...prev,
                              available_sizes: prev.available_sizes.filter(s => s !== size)
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              available_sizes: [...prev.available_sizes, size]
                            }));
                          }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
                  disabled={isLoading}
                >
                  {isLoading ? "Ajout en cours..." : "Ajouter le produit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Commandes à imprimer</CardTitle>
              <CardDescription>
                Consultez et gérez les commandes à produire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>Vous n'avez pas encore de commandes à imprimer.</p>
                <p className="mt-2">Les nouvelles commandes apparaîtront ici.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrinterStudio;
