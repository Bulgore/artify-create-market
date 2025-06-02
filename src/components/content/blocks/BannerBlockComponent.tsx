
import React from 'react';
import { ContentBlock, BannerBlock } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BannerBlockComponentProps {
  block: ContentBlock;
}

const BannerBlockComponent: React.FC<BannerBlockComponentProps> = ({ block }) => {
  const content = block.content as BannerBlock;

  // Vérifier si la bannière doit être affichée selon les dates
  const now = new Date();
  const startDate = content.startDate ? new Date(content.startDate) : null;
  const endDate = content.endDate ? new Date(content.endDate) : null;

  if (startDate && now < startDate) return null;
  if (endDate && now > endDate) return null;

  return (
    <section 
      className="relative py-12 px-6 text-center"
      style={{
        backgroundColor: content.backgroundColor,
        backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {content.backgroundImage && (
        <div className="absolute inset-0 bg-black/40"></div>
      )}
      <div className="relative z-10 container mx-auto">
        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${content.backgroundImage ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h2>
        {content.description && (
          <p className={`text-lg mb-6 ${content.backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
            {content.description}
          </p>
        )}
        {content.buttonText && content.buttonLink && (
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white">
            <Link to={content.buttonLink}>{content.buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default BannerBlockComponent;
