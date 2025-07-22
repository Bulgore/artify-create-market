
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, Info, X } from 'lucide-react';

interface DesignPreviewProps {
  designUrl: string;
  onRemove: () => void;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  designUrl,
  onRemove
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log('✅ [DesignPreview] Design chargé avec succès:', designUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (error: any) => {
    console.error('❌ [DesignPreview] Erreur chargement design:', designUrl, error);
    setImageError(true);
    setImageLoaded(false);
  };

  if (!designUrl) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Design uploadé
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Informations techniques</h4>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="font-medium">Type:</span> URL Signée
                    </div>
                    <div>
                      <span className="font-medium">Chemin:</span>
                      <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                        {designUrl}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Chargé:</span>
                      {imageLoaded ? '✅ Oui' : imageError ? '❌ Erreur' : '⏳ En cours'}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              onClick={onRemove} 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              <div className="text-center">
                <X className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Erreur de chargement</p>
              </div>
            </div>
          ) : (
            <img
              src={designUrl}
              alt="Design uploadé"
              className="w-full h-full object-contain"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
