
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Globe, ShoppingBag, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { buildImageUrl } from '@/utils/imageUrl';
import { Link } from 'react-router-dom';
import { generateProductPreviewUrl } from '@/utils/mockupGenerator';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Creator {
  id: string;
  full_name_fr: string;
  bio_fr: string;
  avatar_url: string | null;
  banner_url: string | null;
  products_count: number;
  social_links: any;
  website_url: string | null;
  keywords: string[] | null;
}

interface CreatorProduct {
  id: string;
  name_fr: string;
  description_fr: string;
  preview_url: string | null;
  created_at: string;
  creator_margin_percentage: number;
  design_data: any;
  original_design_url: string | null;
  print_product: any;
}

const CreatorProfile: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (creatorId) {
      fetchCreatorData();
    }
  }, [creatorId]);

  const fetchCreatorData = async () => {
    if (!creatorId) return;

    try {
      console.log('🔄 Fetching creator profile:', creatorId);

      // Fetch creator info
      const { data: creatorData, error: creatorError } = await supabase
        .from('users')
        .select(`
          id,
          full_name_fr,
          bio_fr,
          avatar_url,
          banner_url,
          products_count,
          social_links,
          website_url,
          keywords
        `)
        .eq('id', creatorId)
        .eq('is_public_profile', true)
        .single();

      if (creatorError) {
        console.error('❌ Error fetching creator:', creatorError);
        return;
      }

      setCreator(creatorData);

      // Fetch creator products with full data
      const { data: productsData, error: productsError } = await supabase
        .from('creator_products')
        .select(`
          id,
          name_fr,
          description_fr,
          preview_url,
          created_at,
          creator_margin_percentage,
          design_data,
          original_design_url,
          print_product:print_product_id(
            id,
            name_fr,
            base_price,
            available_sizes,
            available_colors,
            product_templates:template_id(
              id,
              product_mockups!product_mockups_product_template_id_fkey(
                id,
                mockup_url,
                is_primary,
                has_print_area,
                print_area
              )
            )
          )
        `)
        .eq('creator_id', creatorId)
        .eq('is_published', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('❌ Error fetching products:', productsError);
      } else {
        setProducts((productsData || []) as any);
      }

    } catch (error) {
      console.error('❌ Exception fetching creator data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = (product: CreatorProduct) => {
    const basePrice = product.print_product?.base_price || 0;
    const creatorMargin = (basePrice * product.creator_margin_percentage) / 100;
    return basePrice + creatorMargin;
  };

  const handleAddToCart = async (product: CreatorProduct) => {
    try {
      const primaryMockup = product.print_product?.product_templates?.product_mockups?.find(m => m.is_primary) ||
                           product.print_product?.product_templates?.product_mockups?.[0];
      
      if (!primaryMockup || !product.print_product) {
        toast.error('Impossible de générer l\'aperçu du produit');
        return;
      }

      let productImage = primaryMockup.mockup_url;
      
      // Try to get generated preview if available
      try {
        const generatedUrl = generateProductPreviewUrl(product as any);
        if (generatedUrl) {
          productImage = generatedUrl;
        }
      } catch (error) {
        console.log('Using original mockup as fallback');
      }

      const cartItem = {
        id: product.id,
        title: product.name_fr,
        price: calculatePrice(product),
        mockupUrl: buildImageUrl(productImage),
        designUrl: product.design_data?.designUrl || product.original_design_url || '',
        printArea: primaryMockup.print_area
      };

      addItem(cartItem);
      toast.success(`${product.name_fr} ajouté au panier !`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33C3F0] mx-auto mb-4"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Créateur introuvable</h1>
          <p className="text-gray-600 mb-4">Ce profil n'existe pas ou n'est pas public.</p>
          <Button asChild>
            <Link to="/creators">Retour aux créateurs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
        {creator.banner_url && (
          <img
            src={buildImageUrl(creator.banner_url)}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 pb-8">
          {/* Profil card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                  {creator.avatar_url ? (
                    <img
                      src={buildImageUrl(creator.avatar_url)}
                      alt={creator.full_name_fr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {creator.full_name_fr}
                  </h1>
                  
                  <p className="text-gray-600 mb-4">
                    {creator.bio_fr || 'Pas de description disponible'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ShoppingBag className="w-5 h-5" />
                      <span>{creator.products_count} produits</span>
                    </div>
                  </div>

                  {/* Keywords */}
                  {creator.keywords && creator.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {creator.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {creator.website_url && (
                      <Button asChild variant="outline">
                        <a 
                          href={creator.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Site web
                        </a>
                      </Button>
                    )}
                    
                    {creator.social_links && Object.keys(creator.social_links).length > 0 && (
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Réseaux sociaux
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produits */}
          <Card>
            <CardHeader>
              <CardTitle>Produits ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit disponible</h3>
                  <p className="text-gray-500">Ce créateur n'a pas encore publié de produits.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const primaryMockup = product.print_product?.product_templates?.product_mockups?.find(m => m.is_primary) ||
                                         product.print_product?.product_templates?.product_mockups?.[0];
                    const price = calculatePrice(product);
                    
                    return (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-200 relative group">
                          {primaryMockup ? (
                            <img
                              src={buildImageUrl(primaryMockup.mockup_url)}
                              alt={product.name_fr}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Overlay avec design si disponible */}
                          {product.design_data?.designUrl && primaryMockup?.has_print_area && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div 
                                className="absolute"
                                style={{
                                  left: `${((primaryMockup.print_area?.x || 0) / 600) * 100}%`,
                                  top: `${((primaryMockup.print_area?.y || 0) / 600) * 100}%`,
                                  width: `${((primaryMockup.print_area?.width || 100) / 600) * 100}%`,
                                  height: `${((primaryMockup.print_area?.height || 100) / 600) * 100}%`,
                                }}
                              >
                                <img
                                  src={buildImageUrl(product.design_data.designUrl)}
                                  alt="Design"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1">{product.name_fr}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description_fr || 'Pas de description'}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {price.toFixed(2)} €
                            </span>
                            
                            <div className="flex gap-2">
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/product/${product.id}`}>
                                  Voir
                                </Link>
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleAddToCart(product)}
                              >
                                Ajouter au panier
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
