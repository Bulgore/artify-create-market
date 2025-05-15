
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Dans une vraie application, vous récupéreriez les détails du produit 
  // depuis votre API en utilisant l'ID du produit
  const product = {
    name: id ? id.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Produit',
    artist: "Marts Dupant",
    image: "/placeholder.svg",
    price: "20 €",
    description: "Ce design unique exprime la créativité et l'originalité. Parfait pour ajouter une touche artistique à votre collection personnelle ou comme cadeau spécial.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blanc", "Noir", "Bleu"]
  };
  
  const [selectedSize, setSelectedSize] = React.useState("M");
  const [selectedColor, setSelectedColor] = React.useState("Blanc");
  
  const handleAddToCart = () => {
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} (${selectedSize}, ${selectedColor}) a été ajouté à votre panier.`,
    });
  };
  
  const handlePersonalize = () => {
    toast({
      title: "Personnalisation",
      description: "L'outil de personnalisation sera bientôt disponible!",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain min-h-[400px]"
            />
          </div>
          
          {/* Détails du produit */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">Par {product.artist}</p>
            <p className="text-2xl font-medium text-gray-900 mb-6">{product.price}</p>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Taille:</h3>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
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
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Couleur:</h3>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
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
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button 
                className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white"
                onClick={handleAddToCart}
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
                <li>Matière: 100% coton bio</li>
                <li>Impression: Sublimation haute qualité</li>
                <li>Entretien: Lavable en machine à 30°C</li>
                <li>Origine: Fabriqué localement dans le Pacifique</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="p-4 border rounded-b-lg">
              <p>Aucun avis pour le moment. Soyez le premier à donner votre avis sur ce produit!</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
