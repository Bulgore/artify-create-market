
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { getProductBySlug, getProductById } from "@/services/publicProductsService";
import type { PublicCreatorProduct } from "@/services/publicProductsService";
import { MockupPreview } from "@/components/creator/design-uploader/MockupPreview";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [product, setProduct] = useState<PublicCreatorProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentMockupIndex, setCurrentMockupIndex] = useState(0);
  
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Extract product ID from URL (format: name-id)
        const idMatch = id.match(/([a-f0-9-]{36})$/);
        
        if (idMatch) {
          const productId = idMatch[1];
          
          // First try to get by slug (URL format)
          let productData = await getProductBySlug(id);
          
          // If not found by slug, try by ID
          if (!productData) {
            console.log('Product not found by slug, trying direct ID lookup');
            productData = await getProductById(productId);
          }
          
          if (productData) {
            setProduct(productData);
            // Set default selections
            if (productData.print_product?.available_sizes?.length > 0) {
              setSelectedSize(productData.print_product.available_sizes[0]);
            }
            if (productData.print_product?.available_colors?.length > 0) {
              setSelectedColor(productData.print_product.available_colors[0]);
            }
          } else {
            setError("Produit non trouvé");
          }
        } else {
          setError("ID de produit invalide");
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une taille et une couleur.",
      });
      return;
    }
    
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      title: `${product.name} (${selectedSize}, ${selectedColor})`,
      price: product.final_price || 0,
      mockupUrl: getCurrentMockupUrl(),
      designUrl: product.original_design_url || '',
      printArea: product.design_data?.position
    });
    
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (${selectedSize}, ${selectedColor}) a été ajouté à votre panier.`,
    });
  };
  
  const getCurrentMockupUrl = () => {
    const mockups = product?.print_product?.product_templates?.product_mockups || [];
    return mockups[currentMockupIndex]?.mockup_url || '';
  };
  
  const handlePersonalize = () => {
    toast({
      title: "Personnalisation",
      description: "L'outil de personnalisation sera bientôt disponible!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "Produit non trouvé"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const mockups = product.print_product?.product_templates?.product_mockups || [];
  const hasMultipleMockups = mockups.length > 1;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galerie d'images du produit */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              {product.original_design_url && mockups.length > 0 ? (
                <MockupPreview
                  mockupUrl={mockups[currentMockupIndex]?.mockup_url}
                  designUrl={product.original_design_url}
                  designArea={mockups[currentMockupIndex]?.print_area}
                  designPosition={product.design_data?.position}
                />
              ) : (
                <img 
                  src={getCurrentMockupUrl() || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-contain min-h-[400px]"
                />
              )}
            </div>
            
            {/* Miniatures des mockups */}
            {hasMultipleMockups && (
              <div className="flex space-x-2 overflow-x-auto">
                {mockups.map((mockup, index) => (
                  <button
                    key={mockup.id}
                    onClick={() => setCurrentMockupIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      currentMockupIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={mockup.mockup_url}
                      alt={`Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Détails du produit */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">Par {product.creator?.full_name}</p>
            <p className="text-2xl font-medium text-gray-900 mb-6">
              {product.final_price?.toFixed(2)} €
            </p>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Sélection de taille */}
            {product.print_product?.available_sizes && product.print_product.available_sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Taille:</h3>
                <div className="flex space-x-2">
                  {product.print_product.available_sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={selectedSize === size ? "bg-[#33C3F0] hover:bg-[#0FA0CE]" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sélection de couleur */}
            {product.print_product?.available_colors && product.print_product.available_colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Couleur:</h3>
                <div className="flex space-x-2">
                  {product.print_product.available_colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={selectedColor === color ? "bg-[#33C3F0] hover:bg-[#0FA0CE]" : ""}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button 
                className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                Ajouter au panier
              </Button>
              <Button 
                variant="outline" 
                className="text-[#33C3F0] border-[#33C3F0]"
                onClick={handlePersonalize}
              >
                Personnaliser
              </Button>
            </div>
          </div>
        </div>
        
        {/* Onglets d'information supplémentaire */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis (0)</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 border rounded-b-lg">
              <p>{product.description}</p>
              <p className="mt-4">Ce produit est imprimé à la demande et expédié depuis notre partenaire imprimeur local le plus proche de votre adresse de livraison.</p>
            </TabsContent>
            <TabsContent value="specifications" className="p-4 border rounded-b-lg">
              <ul className="list-disc pl-5 space-y-2">
                <li>Matière: {product.print_product?.material || '100% coton'}</li>
                <li>Impression: Sublimation haute qualité</li>
                <li>Entretien: Lavable en machine à 30°C</li>
                <li>Origine: Fabriqué localement dans le Pacifique</li>
                {product.print_product?.available_sizes && (
                  <li>Tailles disponibles: {product.print_product.available_sizes.join(', ')}</li>
                )}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 border rounded-b-lg">
              <p>Aucun avis pour le moment. Soyez le premier à donner votre avis sur ce produit!</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
