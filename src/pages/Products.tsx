
import React from 'react';
import ProductsGrid from '@/components/public/ProductsGrid';

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
      </div>
    </div>
  );
};

export default Products;
