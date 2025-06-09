
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageData, mapPageWithCompatibility } from '@/types/pages';
import { fetchPageBySlug } from '@/services/pagesService';
import { Card, CardContent } from '@/components/ui/card';

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPage(slug);
    }
  }, [slug]);

  const loadPage = async (pageSlug: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await fetchPageBySlug(pageSlug);
      
      if (error) {
        console.error('Error loading page:', error);
        setError('Impossible de charger la page');
        return;
      }
      
      if (data) {
        // Mapper avec compatibilité
        const mappedPage = mapPageWithCompatibility(data);
        setPage(mappedPage);
      } else {
        setError('Page non trouvée');
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setError('Erreur lors du chargement de la page');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Page non trouvée'}
            </h1>
            <p className="text-gray-600">
              La page que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {page.title}
            </h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomPage;
