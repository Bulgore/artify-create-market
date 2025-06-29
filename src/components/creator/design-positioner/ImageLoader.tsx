
import { useState, useEffect } from 'react';
import { buildDesignUrl } from '@/utils/imageUrl';

interface ImageLoaderProps {
  imageUrl: string;
  onLoad: (loaded: boolean) => void;
  onError: (error: boolean) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ imageUrl, onLoad, onError }) => {
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const getProcessedImageUrl = async (url: string): Promise<string> => {
    try {
      console.log('🔍 Processing image URL:', url);
      
      if (!url || url.trim() === '') {
        console.log('❌ Empty URL provided');
        return '';
      }
      
      // Utiliser la nouvelle fonction buildDesignUrl qui gère les URLs signées
      const processedUrl = buildDesignUrl(url);
      console.log('🎯 Processed URL:', processedUrl);
      
      return processedUrl;
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
    setRetryCount(0); // Reset retry count when URL changes
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
      setRetryCount(0);
    };
    
    img.onerror = (error) => {
      console.error('❌ Image failed to load:', error, processedUrl);
      
      // Si c'est une URL signée qui a échoué et qu'on n'a pas encore fait de retry
      if (processedUrl.includes('/sign/') && retryCount < MAX_RETRIES) {
        console.log('🔄 Retry with public URL conversion, attempt:', retryCount + 1);
        setRetryCount(prev => prev + 1);
        
        // Force reconversion en URL publique
        const publicUrl = buildDesignUrl(processedUrl);
        if (publicUrl !== processedUrl) {
          setProcessedUrl(publicUrl);
          return;
        }
      }
      
      onLoad(false);
      onError(true);
    };
    
    img.src = processedUrl;
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [processedUrl, onLoad, onError, retryCount]);

  return null;
};
