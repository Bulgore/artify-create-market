
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DesignUploader from './DesignUploader';
import DesignPositioner from './DesignPositioner';
import { Palette, Package, ArrowLeft } from 'lucide-react';

interface PrintProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  material: string;
  available_sizes: string[];
  available_colors: string[];
  template_id: string;
  product_templates: {
    id: string;
    name: string;
    svg_file_url: string;
    mockup_image_url: string;
    design_area: any;
  } | null;
}

interface CustomProductCreatorProps {
  onBack: () => void;
}

const CustomProductCreator: React.FC<CustomProductCreatorProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<PrintProduct | null>(null);
  const [designUrl, setDesignUrl] = useState('');
  const [designPosition, setDesignPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPositioner, setShowPositioner] = useState(false);
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    margin_percentage: 20
  });

  useEffect(() => {
    fetchPrintProducts();
  }, []);

  const fetchPrintProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates (
            id,
            name,
            svg_file_url,
            mockup_image_url,
            design_area
          )
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      setPrintProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching print products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits."
      });
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = printProducts.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setDesignUrl('');
    setDesignPosition(null);
    setShowPositioner(false);
  };

  const handleDesignUpload = (url: string) => {
    setDesignUrl(url);
    if (url && selectedProduct && selectedProduct.product_templates) {
      setShowPositioner(true);
    } else {
      setShowPositioner(false);
    }
  };

  const handlePositionChange = (position: any) => {
    setDesignPosition(position);
  };

  const calculateFinalPrice = () => {
    if (!selectedProduct) return 0;
    const marginAmount = (selectedProduct.base_price * productData.margin_percentage) / 100;
    return selectedProduct.base_price + marginAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedProduct.product_templates || !designUrl || !designPosition || !user) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs et positionner votre design."
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('creator_products')
        .insert({
          creator_id: user.id,
          print_product_id: selectedProduct.id,
          name: productData.name,
          description: productData.description,
          creator_margin_percentage: productData.margin_percentage,
          design_data: {
            design_image_url: designUrl,
            position: designPosition,
            template_svg_url: selectedProduct.product_templates.svg_file_url
          },
          preview_url: selectedProduct.product_templates.mockup_image_url,
          is_published: false
        });

      if (error) throw error;

      toast({
        title: "Produit créé",
        description: "Votre produit personnalisé a été créé avec succès."
      });

      onBack();
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le produit."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">Créer un produit personnalisé</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Sélection du produit de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                1. Choisir un produit de base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Produit d'impression</Label>
                  <Select onValueChange={handleProductSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un produit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {printProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.base_price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedProduct && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                    <p className="text-sm font-medium">Prix de base: {selectedProduct.base_price}€</p>
                    <p className="text-sm">Matériau: {selectedProduct.material}</p>
                    {!selectedProduct.product_templates && (
                      <p className="text-sm text-red-500 mt-2">⚠️ Ce produit n'a pas de gabarit configuré</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upload du design */}
          {selectedProduct && selectedProduct.product_templates && (
            <DesignUploader
              onDesignUpload={handleDesignUpload}
              currentDesignUrl={designUrl}
            />
          )}

          {/* Informations du produit */}
          {selectedProduct && selectedProduct.product_templates && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  3. Détails du produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du produit *</Label>
                    <Input
                      id="name"
                      value={productData.name}
                      onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                      placeholder="Ex: Mon T-shirt personnalisé"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productData.description}
                      onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                      placeholder="Description de votre création..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="margin">Marge créateur (%)</Label>
                    <Input
                      id="margin"
                      type="number"
                      value={productData.margin_percentage}
                      onChange={(e) => setProductData({ ...productData, margin_percentage: Number(e.target.value) })}
                      min={5}
                      max={100}
                    />
                    <div className="text-sm text-gray-500">
                      Prix final: {calculateFinalPrice().toFixed(2)}€
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
                    disabled={isLoading || !designPosition}
                  >
                    {isLoading ? "Création en cours..." : "Créer le produit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Interface de positionnement */}
        <div>
          {showPositioner && selectedProduct && selectedProduct.product_templates && designUrl && (
            <DesignPositioner
              templateSvgUrl={selectedProduct.product_templates.svg_file_url}
              designImageUrl={designUrl}
              designArea={selectedProduct.product_templates.design_area}
              onPositionChange={handlePositionChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomProductCreator;
