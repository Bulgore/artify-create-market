
import React, { useEffect, useState } from 'react';
import { ReusableBlock } from '@/types/reusableBlocks';
import { reusableBlocksService } from '@/services/reusableBlocksService';
import { useAuth } from '@/contexts/AuthContext';

interface ReusableBlockRendererProps {
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
  className?: string;
}

const ReusableBlockRenderer: React.FC<ReusableBlockRendererProps> = ({ placement, className = "" }) => {
  const [blocks, setBlocks] = useState<ReusableBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadBlocks();
  }, [placement, user]);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const data = await reusableBlocksService.getActiveBlocks(placement);
      
      // Filtrer selon la visibilité
      const filteredBlocks = data.filter(block => {
        if (block.visibility === 'public') return true;
        if (block.visibility === 'authenticated' && user) return true;
        if (block.visibility === 'guests' && !user) return true;
        return false;
      });

      setBlocks(filteredBlocks);
    } catch (error) {
      console.error('Error loading reusable blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBlock = (block: ReusableBlock) => {
    const { content, image_url, link_url, button_text } = block;

    switch (block.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p>{content.text}</p>
          </div>
        );

      case 'banner':
        return (
          <div 
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: content.backgroundColor || '#f8f9fa' }}
          >
            <p className="text-lg font-medium">{content.text}</p>
            {button_text && link_url && (
              <a 
                href={link_url}
                className="inline-block mt-4 px-6 py-2 bg-[#33C3F0] text-white rounded-lg hover:bg-[#0FA0CE] transition-colors"
              >
                {button_text}
              </a>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            {image_url && (
              <img 
                src={image_url} 
                alt={block.title}
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {content.caption && (
              <p className="mt-2 text-sm text-gray-600">{content.caption}</p>
            )}
          </div>
        );

      case 'cta':
        return (
          <div className="bg-gradient-to-r from-[#33C3F0] to-[#0FA0CE] text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{content.title || block.title}</h3>
            {content.description && (
              <p className="text-lg mb-6">{content.description}</p>
            )}
            {button_text && link_url && (
              <a 
                href={link_url}
                className="inline-block px-8 py-3 bg-white text-[#33C3F0] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {button_text}
              </a>
            )}
          </div>
        );

      case 'hero':
        return (
          <div className="relative bg-gradient-to-r from-[#33C3F0] to-[#0FA0CE] text-white py-20">
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{content.title || block.title}</h1>
              {content.subtitle && (
                <p className="text-xl md:text-2xl mb-8">{content.subtitle}</p>
              )}
              {content.description && (
                <p className="text-lg mb-8 max-w-2xl mx-auto">{content.description}</p>
              )}
              {button_text && link_url && (
                <a 
                  href={link_url}
                  className="inline-block px-8 py-4 bg-white text-[#33C3F0] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {button_text}
                </a>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{block.title}</h3>
            <p className="text-sm text-gray-600">Type de bloc non supporté: {block.type}</p>
          </div>
        );
    }
  };

  if (loading) {
    return null; // Ne pas afficher de loader pour ne pas perturber l'UI
  }

  if (blocks.length === 0) {
    return null; // Pas de blocs à afficher
  }

  return (
    <div className={`reusable-blocks-${placement} ${className}`}>
      {blocks.map((block) => (
        <div key={block.id} className="mb-6">
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default ReusableBlockRenderer;
