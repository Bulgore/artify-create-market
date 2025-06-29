
import { useState, useEffect } from 'react';
import { buildDesignUrl, diagnoseImageUrl } from '@/utils/imageUrl';

interface ImageLoaderProps {
  imageUrl: string;
  onLoad: (loaded: boolean) => void;
  onError: (error: boolean) => void;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({ imageUrl, onLoad, onError }) => {
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const MAX_RETRIES = 3;

  const getProcessedImageUrl = async (url: string): Promise<string> => {
    try {
      console.log('🔍 [ImageLoader] Processing image URL:', url);
      
      if (!url || url.trim() === '') {
        console.log('❌ [ImageLoader] Empty URL provided');
        return '';
      }
      
      // Utiliser la nouvelle fonction buildDesignUrl qui gère les URLs signées
      const processedUrl = buildDesignUrl(url);
      console.log('🎯 [ImageLoader] Processed URL:', processedUrl);
      
      return processedUrl;
    } catch (error) {
      console.error('❌ [ImageLoader] Error in getProcessedImageUrl:', error);
      return url;
    }
  };

  // Diagnostic automatique en cas d'erreur répétée
  const performDiagnostic = async (url: string) => {
    console.log('🔬 [ImageLoader] Lancement du diagnostic pour:', url);
    const diagnostic = await diagnoseImageUrl(url);
    setDiagnosticInfo(diagnostic);
    
    console.log('📊 [ImageLoader] Résultat du diagnostic:', diagnostic);
    
    if (diagnostic.suggestions.length > 0) {
      console.log('💡 [ImageLoader] Suggestions:');
      diagnostic.suggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }
  };

  useEffect(() => {
    const processUrl = async () => {
      if (!imageUrl) {
        setProcessedUrl('');
        setDiagnosticInfo(null);
        onLoad(false);
        onError(false);
        return;
      }

      try {
        const processed = await getProcessedImageUrl(imageUrl);
        setProcessedUrl(processed);
        console.log('🎯 [ImageLoader] Final processed URL:', processed);
      } catch (error) {
        console.error('❌ [ImageLoader] Error processing URL:', error);
        setProcessedUrl(imageUrl);
      }
    };

    processUrl();
    setRetryCount(0); // Reset retry count when URL changes
    setDiagnosticInfo(null); // Reset diagnostic info
  }, [imageUrl, onLoad, onError]);

  useEffect(() => {
    if (!processedUrl) return;

    console.log('📸 [ImageLoader] Testing image load for:', processedUrl);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ [ImageLoader] Image loaded successfully:', {
        src: processedUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      });
      onLoad(true);
      onError(false);
      setRetryCount(0);
      setDiagnosticInfo({ isAccessible: true, status: 200, suggestions: [] });
    };
    
    img.onerror = async (error) => {
      console.error('❌ [ImageLoader] Image failed to load:', error, processedUrl);
      
      // Effectuer un diagnostic après le premier échec
      if (retryCount === 0) {
        await performDiagnostic(processedUrl);
      }
      
      // Si c'est une URL signée qui a échoué et qu'on n'a pas encore fait tous les retries
      if (processedUrl.includes('/sign/') && retryCount < MAX_RETRIES) {
        console.log('🔄 [ImageLoader] Retry with public URL conversion, attempt:', retryCount + 1);
        setRetryCount(prev => prev + 1);
        
        // Force reconversion en URL publique
        const publicUrl = buildDesignUrl(processedUrl);
        if (publicUrl !== processedUrl) {
          setProcessedUrl(publicUrl);
          return;
        }
      }
      
      // Dernier recours : essayer avec buildDesignUrl si pas encore fait
      if (retryCount < MAX_RETRIES && !processedUrl.includes('/public/')) {
        console.log('🔄 [ImageLoader] Retry with explicit public URL, attempt:', retryCount + 1);
        setRetryCount(prev => prev + 1);
        
        const explicitPublicUrl = buildDesignUrl(imageUrl);
        if (explicitPublicUrl !== processedUrl) {
          setProcessedUrl(explicitPublicUrl);
          return;
        }
      }
      
      console.log('💥 [ImageLoader] All retries exhausted for:', processedUrl);
      onLoad(false);
      onError(true);
    };
    
    img.src = processedUrl;
    
    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [processedUrl, onLoad, onError, retryCount, imageUrl]);

  // Log diagnostic info périodiquement
  useEffect(() => {
    if (diagnosticInfo && !diagnosticInfo.isAccessible) {
      console.group('🚨 [ImageLoader] Diagnostic d\'erreur');
      console.log('URL:', processedUrl);
      console.log('Statut:', diagnosticInfo.status || 'N/A');
      console.log('Erreur:', diagnosticInfo.error || 'N/A');
      console.log('Suggestions:', diagnosticInfo.suggestions);
      console.groupEnd();
    }
  }, [diagnosticInfo, processedUrl]);

  return null;
};
