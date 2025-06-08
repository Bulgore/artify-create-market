
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Package } from 'lucide-react';
import { usePublicCreators } from '@/hooks/usePublicCreators';
import { PublicCreator } from '@/services/publicProductsService';

interface CreatorsGridProps {
  limit?: number;
}

const CreatorCard: React.FC<{ creator: PublicCreator }> = ({ creator }) => {
  const handleVisitProfile = () => {
    // Naviguer vers le profil du créateur
    window.location.href = `/creators/${creator.id}`;
  };

  const handleVisitWebsite = () => {
    if (creator.website_url) {
      window.open(creator.website_url, '_blank');
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="relative mx-auto w-20 h-20 mb-4">
          <img 
            src={creator.avatar_url || "/placeholder.svg"} 
            alt={creator.full_name || 'Créateur'}
            className="w-full h-full rounded-full object-cover border-2 border-gray-100"
          />
        </div>
        
        <h3 className="font-semibold text-lg mb-2">
          {creator.full_name || 'Créateur anonyme'}
        </h3>
        
        {creator.bio && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {creator.bio}
          </p>
        )}
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {creator.products_count} produit{creator.products_count > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleVisitProfile}
            className="flex-1"
          >
            Voir le profil
          </Button>
          {creator.website_url && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleVisitWebsite}
              className="p-2"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        {creator.social_links && Object.keys(creator.social_links).length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-center gap-2">
              {Object.entries(creator.social_links).map(([platform, url]) => (
                <Button
                  key={platform}
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(url as string, '_blank')}
                  className="p-1"
                >
                  <span className="text-xs">{platform}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CreatorsGrid: React.FC<CreatorsGridProps> = ({ limit = 12 }) => {
  const { creators, loading, error } = usePublicCreators(limit);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Créateurs</h2>
          <Badge variant="outline">
            {creators.length} créateur{creators.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Aucun créateur public trouvé.
          </p>
          <Button variant="outline">
            Devenir créateur
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreatorsGrid;
