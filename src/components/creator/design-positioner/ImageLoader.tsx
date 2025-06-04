
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ImageLoaderProps {
  imageUrl: string;
  onLoad: (loaded: boolean) => void;
  onError: (error: boolean) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ imageUrl, onLoad, onError }) => {
  const [processedUrl, setProcessedUrl] = useState<string>('');

  const getProcessedImageUrl = async (url: string): Promise<string> => {
    try {
      console.log('🔍 Processing image URL:', url);
      
      if (!url || url.trim() === '') {
        console.log('❌ Empty URL provided');
        return '';
      }
      
      // Si c'est déjà une URL publique, signée ou data URL, on la retourne
      if (url.includes('/storage/v1/object/public/') || url.includes('sign') || url.startsWith('data:')) {
        console.log('✅ URL is already public/signed/data, using as is');
        return url;
      }

      // Si l'URL contient le domaine Supabase, on l'utilise directement
      if (url.includes('riumhqlxdmsxwsjstqgl.supabase.co')) {
        console.log('✅ URL contains Supabase domain, using as is');
        return url;
      }

      // Si c'est un chemin relatif qui commence par /storage/
      if (url.startsWith('/storage/v1/object/')) {
        const fullUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co${url}`;
        console.log('🔧 Converting relative path to full URL:', fullUrl);
        return fullUrl;
      }

      // Essayer de créer une URL signée si nécessaire
      const urlParts = url.split('/storage/v1/object/');
      if (urlParts.length >= 2) {
        const pathPart = urlParts[1];
        
        if (pathPart.startsWith('public/')) {
          console.log('✅ Using public URL as is');
          return url;
        }

        // Pour les buckets privés, créer une URL signée
        const bucketAndPath = pathPart.split('/');
        const bucket = bucketAndPath[0];
        const filePath = bucketAndPath.slice(1).join('/');

        console.log('🔑 Creating signed URL for bucket:', bucket, 'path:', filePath);

        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, 3600);

        if (error) {
          console.error('❌ Error creating signed URL:', error);
          // Fallback vers URL publique
          const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
          console.log('🔄 Fallback to public URL:', publicData.publicUrl);
          return publicData.publicUrl;
        }

        console.log('✅ Created signed URL successfully');
        return data.signedUrl;
      }

      console.log('🔄 Using original URL as fallback');
      return url;
    } catch (error) {
      console.error('❌ Error in getProcessedImageUrl:', error);
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
        const processed = await getProcessedImageUrl(imageUrl);
        setProcessedUrl(processed);
        console.log('🎯 Final processed URL:', processed);
      } catch (error) {
        console.error('❌ Error processing URL:', error);
        setProcessedUrl(imageUrl);
      }
    };

    processUrl();
  }, [imageUrl, onLoad, onError]);

  useEffect(() => {
    if (!processedUrl) return;

    console.log('📸 Testing image load for:', processedUrl);
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
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [processedUrl, onLoad, onError]);

  return null;
};
