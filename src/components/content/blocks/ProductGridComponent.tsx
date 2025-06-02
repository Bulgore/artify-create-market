
import React from 'react';
import { ContentBlock } from '@/types/content';
import FeaturedProducts from '@/components/FeaturedProducts';

interface ProductGridComponentProps {
  block: ContentBlock;
}

const ProductGridComponent: React.FC<ProductGridComponentProps> = ({ block }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          {block.title || 'Produits Populaires'}
        </h2>
        <FeaturedProducts />
      </div>
    </section>
  );
};

export default ProductGridComponent;
