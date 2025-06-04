
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface DesignPreviewProps {
  designUrl: string;
  onRemove: () => void;
}

export const DesignPreview: React.FC<DesignPreviewProps> = ({
  designUrl,
  onRemove
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (designUrl) {
      console.log('🖼️ DesignPreview - Loading image:', designUrl);
      setImageError(false);
      setImageLoaded(false);
      
      // Analyser l'URL pour le debug
      const debugData = {
        url: designUrl,
        isSignedUrl: designUrl.includes('token='),
        isPublicUrl: designUrl.includes('/storage/v1/object/public/'),
        bucketPath: designUrl.split('/designs/')[1] || 'N/A'
      };
      
      setDebugInfo(debugData);
      console.log('🔍 URL Analysis:', debugData);
    }
  }, [designUrl]);

  const handleImageLoad = () => {
    console.log('✅ DesignPreview - Image loaded successfully');
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: any) => {
    console.error('❌ DesignPreview - Image failed to load:', {
      url: designUrl,
      error: e,
      debugInfo
    });
    setImageError(true);
    setImageLoaded(false);
  };

  const refreshSignedUrl = async () => {
    if (!designUrl || !designUrl.includes('/designs/')) return;
    
    try {
      // Extraire le chemin du fichier à partir de l'URL
      const pathMatch = designUrl.match(/\/designs\/(.+?)(?:\?|$)/);
      if (!pathMatch) {
        console.error('❌ Cannot extract file path from URL:', designUrl);
        return;
      }
      
      const filePath = pathMatch[1];
      console.log('🔄 Refreshing signed URL for path:', filePath);
      
      const { data, error } = await supabase.storage
        .from('designs')
        .createSignedUrl(filePath, 3600);
      
      if (error) {
        console.error('❌ Error refreshing signed URL:', error);
        return;
      }
      
      console.log('✅ New signed URL generated:', data.signedUrl);
      // Note: Dans un vrai cas, il faudrait mettre à jour l'URL dans le parent
      // Pour le moment, on affiche juste l'info en console
      
    } catch (error) {
      console.error('❌ Exception refreshing signed URL:', error);
    }
  };

  if (!designUrl) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">Aucun design uploadé</p>
            <p className="text-sm text-gray-400 mt-2">
              Uploadez un fichier PNG, SVG ou JPEG
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Design uploadé</h3>
            <div className="flex gap-2">
              {imageError && (
                <button
                  onClick={refreshSignedUrl}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Actualiser URL
                </button>
              )}
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            {imageError ? (
              <div className="w-full h-48 flex items-center justify-center text-red-500 bg-red-50 rounded border-2 border-red-200">
                <div className="text-center">
                  <p className="font-medium">❌ Erreur de chargement</p>
                  <p className="text-sm mt-1">L'image n'est pas accessible</p>
                  <p className="text-xs mt-2 break-all">{designUrl.substring(0, 60)}...</p>
                </div>
              </div>
            ) : (
              <img
                src={designUrl}
                alt="Design uploadé"
                className="w-full h-48 object-contain rounded"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
          
          {/* Debug info in development */}
          {debugInfo && (
            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
              <div>🔗 Type: {debugInfo.isSignedUrl ? 'URL Signée' : debugInfo.isPublicUrl ? 'URL Publique' : 'URL Inconnue'}</div>
              <div>📂 Chemin: {debugInfo.bucketPath}</div>
              <div>✅ Chargé: {imageLoaded ? 'Oui' : 'En cours...'}</div>
              <div>❌ Erreur: {imageError ? 'Oui' : 'Non'}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
