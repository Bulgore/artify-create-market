
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DesignUploader from './DesignUploader';
import DesignPositioner from './DesignPositioner';
import ProductSelector from './ProductSelector';
import ProductDetailsForm from './ProductDetailsForm';
import { ArrowLeft } from 'lucide-react';

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
    mockup_area?: any;
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
      console.log("Fetching print products with templates...");
      
      const { data, error } = await supabase
        .from('print_products')
        .select(`
          *,
          product_templates (
            id,
            name,
            svg_file_url,
            mockup_image_url,
            design_area,
            mockup_area
          )
        `)
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching print products:", error);
        throw error;
      }

      console.log("Raw data from database:", data);

      // Séparer les produits avec et sans gabarits pour le debug
      const allProducts = data || [];
      const productsWithTemplates = allProducts.filter(product => product.template_id && product.product_templates);
      const productsWithoutTemplates = allProducts.filter(product => !product.template_id || !product.product_templates);

      console.log(`Total products found: ${allProducts.length}`);
      console.log(`Products with templates: ${productsWithTemplates.length}`);
      console.log(`Products without templates: ${productsWithoutTemplates.length}`);

      if (productsWithoutTemplates.length > 0) {
        console.log("Products missing templates:", productsWithoutTemplates.map(p => p.name));
      }

      // Filter out products without valid templates and design areas
      const validProducts = productsWithTemplates.filter(product => {
        const hasDesignArea = product.product_templates?.design_area;
        
        if (!hasDesignArea) {
          console.log(`Product ${product.name} has no design_area in template`);
          return false;
        }
        
        return true;
      });

      console.log(`Valid products for customization: ${validProducts.length}`);
      
      setPrintProducts(validProducts);
      
      if (validProducts.length === 0 && allProducts.length > 0) {
        toast({
          title: "Configuration requise",
          description: `${allProducts.length} produit(s) trouvé(s) mais aucun n'est configuré pour la personnalisation. L'imprimeur doit assigner des gabarits à ses produits.`,
        });
      } else if (allProducts.length === 0) {
        toast({
          title: "Aucun produit disponible",
          description: "Aucun produit d'impression actif trouvé. Les imprimeurs doivent d'abord créer des produits.",
        });
      }
    } catch (error: any) {
      console.error('Error fetching print products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits disponibles."
      });
    }
  };

  const handleProductSelect = (productId: string) => {
    console.log("Selecting product:", productId);
    
    const product = printProducts.find(p => p.id === productId);
    
    if (!product) {
      console.error("Product not found:", productId);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Produit non trouvé."
      });
      return;
    }

    if (!product.product_templates) {
      console.error("Product has no template:", product);
      toast({
        variant: "destructive",
        title: "Gabarit non trouvé",
        description: "Ce produit n'est pas encore configuré pour la personnalisation. L'imprimeur doit d'abord lui assigner un gabarit valide avec une zone d'impression définie."
      });
      return;
    }

    if (!product.product_templates.design_area) {
      console.error("Template has no design area:", product.product_templates);
      toast({
        variant: "destructive",
        title: "Zone d'impression manquante",
        description: "Le gabarit de ce produit n'a pas de zone d'impression définie."
      });
      return;
    }

    console.log("Product selected successfully:", product.name);
    setSelectedProduct(product);
    setDesignUrl('');
    setDesignPosition(null);
    setShowPositioner(false);

    toast({
      title: "Produit sélectionné",
      description: `${product.name} est prêt pour la personnalisation.`
    });
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
          <ProductSelector
            printProducts={printProducts}
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
          />

          {selectedProduct && selectedProduct.product_templates && (
            <DesignUploader
              onDesignUpload={handleDesignUpload}
              currentDesignUrl={designUrl}
            />
          )}

          {selectedProduct && selectedProduct.product_templates && (
            <ProductDetailsForm
              productData={productData}
              setProductData={setProductData}
              finalPrice={calculateFinalPrice()}
              isLoading={isLoading}
              canSubmit={!!designPosition}
              onSubmit={handleSubmit}
            />
          )}
        </div>

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
