
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductsGrid from '@/components/public/ProductsGrid';

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Produits en Vedette
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les dernières créations de nos designers
          </p>
        </div>
        
        <ProductsGrid 
          limit={8} 
          showFilters={false}
        />
        
        <div className="text-center mt-12">
          <Button 
            className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            onClick={() => window.location.href = '/products'}
          >
            Voir tous les produits
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
