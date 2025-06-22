
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Eye, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { buildImageUrl } from '@/utils/imageUrl';
import { Link } from 'react-router-dom';

interface Creator {
  id: string;
  full_name_fr: string;
  bio_fr: string;
  avatar_url: string | null;
  banner_url: string | null;
  products_count: number;
  social_links: any;
  website_url: string | null;
  keywords: string[] | null;
}

const FeaturedCreators: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      console.log('🔄 Fetching public creators...');
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name_fr,
          bio_fr,
          avatar_url,
          banner_url,
          products_count,
          social_links,
          website_url,
          keywords
        `)
        .eq('is_public_profile', true)
        .eq('creator_status', 'approved')
        .gt('products_count', 0)
        .order('products_count', { ascending: false })
        .limit(6);

      if (error) {
        console.error('❌ Error fetching creators:', error);
        return;
      }

      console.log('✅ Creators fetched:', data?.length || 0);
      setCreators(data || []);
    } catch (error) {
      console.error('❌ Exception fetching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Créateurs</h2>
            <p className="text-lg text-gray-600">Chargement des créateurs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (creators.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Créateurs</h2>
            <p className="text-lg text-gray-600">Aucun créateur public disponible pour le moment</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Créateurs</h2>
          <p className="text-lg text-gray-600">Découvrez les talents de notre communauté</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {creator.banner_url && (
                  <img
                    src={buildImageUrl(creator.banner_url)}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <CardContent className="p-6 relative">
                {/* Avatar */}
                <div className="absolute -top-8 left-6">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    {creator.avatar_url ? (
                      <img
                        src={buildImageUrl(creator.avatar_url)}
                        alt={creator.full_name_fr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {creator.full_name_fr || 'Créateur'}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {creator.bio_fr || 'Pas de description disponible'}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{creator.products_count} produits</span>
                    </div>
                  </div>

                  {/* Keywords */}
                  {creator.keywords && creator.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {creator.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      asChild 
                      className="flex-1 bg-[#33C3F0] hover:bg-[#0FA0CE]"
                      size="sm"
                    >
                      <Link to={`/creator/${creator.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Voir le profil
                      </Link>
                    </Button>
                    
                    {creator.website_url && (
                      <Button 
                        asChild
                        variant="outline" 
                        size="sm"
                      >
                        <a 
                          href={creator.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Site web
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/creators">
              Voir tous les créateurs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCreators;
