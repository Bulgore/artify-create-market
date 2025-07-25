
import React from 'react';
import ProductsGrid from '@/components/public/ProductsGrid';
import CreatorsGrid from '@/components/public/CreatorsGrid';
import { Separator } from '@/components/ui/separator';

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Produits Personnalisés
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Découvrez une sélection unique de produits créés par notre communauté de designers talentueux.
          </p>
        </div>

        <ProductsGrid showFilters={true} />
        
        <Separator className="my-16" />
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos Créateurs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Rencontrez les artistes et designers talentueux qui créent ces produits uniques.
          </p>
        </div>

        <CreatorsGrid limit={8} />
      </div>
    </div>
  );
};

export default Products;
