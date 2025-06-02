
import React from 'react';
import { ContentBlock } from '@/types/content';
import HeroBlockComponent from './blocks/HeroBlockComponent';
import BannerBlockComponent from './blocks/BannerBlockComponent';
import SliderBlockComponent from './blocks/SliderBlockComponent';
import ProductGridComponent from './blocks/ProductGridComponent';

interface ContentRendererProps {
  blocks: ContentBlock[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ blocks }) => {
  const activeBlocks = blocks
    .filter(block => block.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-full">
      {activeBlocks.map((block) => {
        switch (block.type) {
          case 'hero':
            return <HeroBlockComponent key={block.id} block={block} />;
          case 'banner':
            return <BannerBlockComponent key={block.id} block={block} />;
          case 'slider':
            return <SliderBlockComponent key={block.id} block={block} />;
          case 'product_grid':
            return <ProductGridComponent key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentRenderer;
