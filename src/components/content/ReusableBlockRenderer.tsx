
import React, { useEffect, useState } from 'react';
import { reusableBlocksService } from '@/services/reusableBlocksService';
import { ReusableBlock } from '@/types/reusableBlocks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface ReusableBlockRendererProps {
  placement: 'homepage' | 'footer' | 'sidebar' | 'product_page' | 'global';
}

const ReusableBlockRenderer: React.FC<ReusableBlockRendererProps> = ({ placement }) => {
  const [blocks, setBlocks] = useState<ReusableBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        setLoading(true);
        const data = await reusableBlocksService.getActiveBlocks(placement);
        setBlocks(data);
      } catch (error) {
        console.error('Erreur lors du chargement des blocs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [placement]);

  const renderBlock = (block: ReusableBlock) => {
    switch (block.type) {
      case 'hero':
        return (
          <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {block.content.title || block.title}
              </h1>
              {block.content.subtitle && (
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {block.content.subtitle}
                </p>
              )}
              {block.content.description && (
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
                  {block.content.description}
                </p>
              )}
              {block.button_text && block.link_url && (
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => window.location.href = block.link_url!}
                >
                  {block.button_text}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
            {block.image_url && (
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={block.image_url} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </section>
        );

      case 'banner':
        return (
          <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {block.content.title || block.title}
              </h2>
              {block.content.description && (
                <p className="text-lg mb-6 opacity-90">
                  {block.content.description}
                </p>
              )}
              {block.button_text && block.link_url && (
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600"
                  onClick={() => window.location.href = block.link_url!}
                >
                  {block.button_text}
                </Button>
              )}
            </div>
          </section>
        );

      case 'text':
        return (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {block.title}
                </h2>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.content.html || '' }}
                />
              </div>
            </div>
          </section>
        );

      case 'image':
        return (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {block.image_url && (
                  <img 
                    src={block.image_url} 
                    alt={block.title}
                    className="w-full h-auto rounded-lg shadow-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{block.title}</h3>
                {block.content.caption && (
                  <p className="text-gray-600">{block.content.caption}</p>
                )}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    {block.title}
                  </h2>
                  {block.content.description && (
                    <p className="text-lg text-gray-600 mb-6">
                      {block.content.description}
                    </p>
                  )}
                  {block.button_text && block.link_url && (
                    <Button 
                      size="lg"
                      className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
                      onClick={() => window.location.href = block.link_url!}
                    >
                      {block.button_text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33C3F0]"></div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default ReusableBlockRenderer;
