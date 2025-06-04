
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ImageLoaderProps {
  imageUrl: string;
  onLoad: (loaded: boolean) => void;
  onError: (error: boolean) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ imageUrl, onLoad, onError }) => {
  const [processedUrl, setProcessedUrl] = useState<string>('');

  const getSignedImageUrl = async (url: string): Promise<string> => {
    try {
      console.log('Processing image URL:', url);
      
      // Si c'est déjà une URL publique ou signée, on la retourne
      if (url.includes('/storage/v1/object/public/') || url.includes('sign') || url.startsWith('data:')) {
        console.log('URL is already public/signed/data, using as is');
        return url;
      }

      // Extraire le chemin depuis l'URL Supabase
      const urlParts = url.split('/storage/v1/object/');
      if (urlParts.length < 2) {
        console.log('Not a storage URL, returning as is');
        return url;
      }

      const pathPart = urlParts[1];
      // Si c'est déjà public, on utilise directement
      if (pathPart.startsWith('public/')) {
        return url;
      }

      // Sinon on essaie de créer une URL signée
      const bucketAndPath = pathPart.split('/');
      const bucket = bucketAndPath[0];
      const filePath = bucketAndPath.slice(1).join('/');

      console.log('Creating signed URL for bucket:', bucket, 'path:', filePath);

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error creating signed URL:', error);
        // Fallback vers URL publique
        const { data: publicData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);
        return publicData.publicUrl;
      }

      console.log('Created signed URL successfully');
      return data.signedUrl;
    } catch (error) {
      console.error('Error in getSignedImageUrl:', error);
      return url;
    }
  };

  useEffect(() => {
    const processUrl = async () => {
      if (!imageUrl) {
        setProcessedUrl('');
        onLoad(false);
        onError(false);
        return;
      }

      try {
        const processed = await getSignedImageUrl(imageUrl);
        setProcessedUrl(processed);
        console.log('Final processed URL:', processed);
      } catch (error) {
        console.error('Error processing URL:', error);
        setProcessedUrl(imageUrl);
      }
    };

    processUrl();
  }, [imageUrl, onLoad, onError]);

  useEffect(() => {
    if (!processedUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Image loaded successfully:', {
        src: processedUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      onLoad(true);
      onError(false);
    };
    
    img.onerror = (error) => {
      console.error('❌ Image failed to load:', error, processedUrl);
      onLoad(false);
      onError(true);
    };
    
    img.src = processedUrl;
  }, [processedUrl, onLoad, onError]);

  return null;
};
