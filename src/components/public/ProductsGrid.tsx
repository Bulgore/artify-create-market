
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { usePublicProducts, useProductCategories } from '@/hooks/usePublicProducts';
import { PublicCreatorProduct } from '@/services/publicProductsService';
import { ProductPreviewImage } from './ProductPreviewImage';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

interface ProductsGridProps {
  category?: string;
  limit?: number;
  showFilters?: boolean;
}

const ProductCard: React.FC<{ product: PublicCreatorProduct }> = ({ product }) => {
  const productSlug = product.slug || `${product.name?.toLowerCase().replace(/ /g, '-')}-${product.id}`;
  const { addItem } = useCart();
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
      <Link to={`/product/${productSlug}`} className="block">
        <div className="aspect-square overflow-hidden">
          <ProductPreviewImage 
            product={product}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={(e) => {
              e.preventDefault();
              toast({
                title: "Ajouté aux favoris",
                description: `${product.name} a été ajouté à votre wishlist.`
              });
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <Link to={`/product/${productSlug}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-[#33C3F0] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-sm text-gray-600">
              {product.creator?.full_name || 'Créateur'}
            </span>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#33C3F0]">
              {product.final_price?.toFixed(2) || product.print_product?.base_price}€
            </span>
            {product.creator_margin_percentage > 0 && (
              <span className="text-xs text-gray-500">
                +{product.creator_margin_percentage}% créateur
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            onClick={(e) => {
              e.preventDefault();
              
              // Calculer le prix final
              const finalPrice = product.final_price || 
                ((product.print_product?.base_price || 0) * (1 + (product.creator_margin_percentage || 0) / 100));
              
              // Ajouter au panier
              addItem({
                id: product.id,
                title: product.name || 'Produit',
                price: finalPrice,
                mockupUrl: product.print_product?.images?.[0] || '',
                designUrl: product.original_design_url || product.design_data?.designUrl || '',
                printArea: product.design_data?.position || {},
              });

              toast({
                title: "Ajouté au panier",
                description: `${product.name} a été ajouté à votre panier.`,
              });
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Acheter
          </Button>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  category,
  limit = 12,
  showFilters = true 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const { products, loading, error } = usePublicProducts(
    selectedCategory === 'all' ? undefined : selectedCategory, 
    limit
  );
  const { categories } = useProductCategories();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Produits</h2>
            <Badge variant="outline">
              {products.length} produit{products.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Aucun produit trouvé dans cette catégorie.
          </p>
          <Button 
            variant="outline"
            onClick={() => setSelectedCategory('all')}
          >
            Voir tous les produits
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
