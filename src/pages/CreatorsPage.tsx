
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Eye, ShoppingBag, Search } from 'lucide-react';
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

const CreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(creator =>
        creator.full_name_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio_fr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCreators(filtered);
    }
  }, [searchTerm, creators]);

  const fetchCreators = async () => {
    try {
      console.log('🔄 Fetching all public creators...');
      
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
        .order('products_count', { ascending: false });

      if (error) {
        console.error('❌ Error fetching creators:', error);
        return;
      }

      console.log('✅ Creators fetched:', data?.length || 0);
      setCreators(data || []);
      setFilteredCreators(data || []);
    } catch (error) {
      console.error('❌ Exception fetching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Créateurs</h1>
          <p className="text-lg text-gray-600 mb-8">
            Découvrez les talents de notre communauté créative
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un créateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#33C3F0] mx-auto mb-4"></div>
            <p>Chargement des créateurs...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun créateur trouvé' : 'Aucun créateur disponible'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Les créateurs apparaîtront ici une fois qu\'ils auront publié leurs profils'
              }
            </p>
          </div>
        )}

        {/* Creators grid */}
        {!isLoading && filteredCreators.length > 0 && (
          <>
            <div className="mb-6 text-sm text-gray-600">
              {filteredCreators.length} créateur{filteredCreators.length > 1 ? 's' : ''} trouvé{filteredCreators.length > 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Banner */}
                  <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    {creator.banner_url && (
                      <img
                        src={buildImageUrl(creator.banner_url)}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <CardContent className="p-4 relative">
                    {/* Avatar */}
                    <div className="absolute -top-6 left-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        {creator.avatar_url ? (
                          <img
                            src={buildImageUrl(creator.avatar_url)}
                            alt={creator.full_name_fr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {creator.full_name_fr || 'Créateur'}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {creator.bio_fr || 'Pas de description disponible'}
                      </p>

                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{creator.products_count} produits</span>
                      </div>

                      {/* Keywords */}
                      {creator.keywords && creator.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {creator.keywords.slice(0, 2).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button 
                        asChild 
                        className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE]"
                        size="sm"
                      >
                        <Link to={`/creator/${creator.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir le profil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;
