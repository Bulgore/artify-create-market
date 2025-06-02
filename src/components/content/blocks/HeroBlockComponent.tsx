
import React from 'react';
import { ContentBlock, HeroBlock } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroBlockComponentProps {
  block: ContentBlock;
}

const HeroBlockComponent: React.FC<HeroBlockComponentProps> = ({ block }) => {
  const content = block.content as HeroBlock;

  return (
    <section 
      className="relative py-20 px-6 text-center"
      style={{
        backgroundColor: content.backgroundColor || '#f8f9fa',
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {content.backgroundImage && (
        <div className="absolute inset-0 bg-black/40"></div>
      )}
      <div className="relative z-10 container mx-auto">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${content.backgroundImage ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h1>
        <p className={`text-xl mb-4 ${content.backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
          {content.subtitle}
        </p>
        <p className={`text-lg mb-8 ${content.backgroundImage ? 'text-white/80' : 'text-gray-600'}`}>
          {content.description}
        </p>
        {content.buttonText && content.buttonLink && (
          <Button asChild size="lg" className="bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
            <Link to={content.buttonLink}>{content.buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default HeroBlockComponent;
