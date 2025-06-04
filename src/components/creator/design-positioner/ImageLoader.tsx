
import { useState, useEffect } from 'react';

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
      
      // Si c'est déjà une URL publique complète, on la retourne
      if (url.includes('riumhqlxdmsxwsjstqgl.supabase.co') && url.includes('/storage/v1/object/public/')) {
        console.log('✅ URL is already public, using as is');
        return url;
      }

      // Si c'est une URL signée ou data URL, on la retourne
      if (url.includes('sign') || url.startsWith('data:')) {
        console.log('✅ URL is signed/data, using as is');
        return url;
      }

      // Si c'est un chemin relatif qui commence par /storage/
      if (url.startsWith('/storage/v1/object/public/')) {
        const fullUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co${url}`;
        console.log('🔧 Converting relative path to full URL:', fullUrl);
        return fullUrl;
      }

      // Si l'URL semble être un fichier direct sans domaine
      if (url.includes('designs/') && !url.includes('http')) {
        const fullUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co/storage/v1/object/public/${url}`;
        console.log('🔧 Building full public URL:', fullUrl);
        return fullUrl;
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
