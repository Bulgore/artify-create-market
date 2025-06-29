
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { buildDesignUrl, diagnoseImageUrl } from '@/utils/imageUrl';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  blur?: boolean;
  aspectRatio?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  lazy = true,
  blur = true,
  aspectRatio,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const MAX_RETRIES = 3;

  // Reset states when src changes
  useEffect(() => {
    console.log('🔄 [OptimizedImage] Source changed:', src);
    setIsLoaded(false);
    setIsError(false);
    setRetryCount(0);
    setDiagnosticInfo(null);
    
    // Process the URL to handle signed URLs
    const processedSrc = buildDesignUrl(src);
    console.log('🎯 [OptimizedImage] Processed source:', processedSrc);
    setCurrentSrc(processedSrc);
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('👁️ [OptimizedImage] Image entered viewport:', currentSrc);
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView, currentSrc]);

  // Diagnostic automatique en cas d'erreur
  const performDiagnostic = async (url: string) => {
    console.log('🔬 [OptimizedImage] Diagnostic pour:', url);
    const diagnostic = await diagnoseImageUrl(url);
    setDiagnosticInfo(diagnostic);
    
    console.log('📊 [OptimizedImage] Diagnostic:', diagnostic);
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('✅ [OptimizedImage] Image loaded successfully:', currentSrc);
    setIsLoaded(true);
    setIsError(false);
    setRetryCount(0);
    setDiagnosticInfo({ isAccessible: true, status: 200, suggestions: [] });
    onLoad?.();
  };

  const handleError = async (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ [OptimizedImage] Image failed to load:', currentSrc);
    
    // Diagnostic au premier échec
    if (retryCount === 0) {
      await performDiagnostic(currentSrc);
    }
    
    // Si c'est une URL signée qui a échoué, essayer de la convertir en publique
    if (currentSrc.includes('/sign/') && retryCount < MAX_RETRIES) {
      console.log('🔄 [OptimizedImage] Retry with public URL, attempt:', retryCount + 1);
      setRetryCount(prev => prev + 1);
      
      const publicUrl = buildDesignUrl(currentSrc);
      if (publicUrl !== currentSrc) {
        setCurrentSrc(publicUrl);
        setIsError(false);
        return;
      }
    }
    
    // Essayer avec une URL publique explicite
    if (retryCount < MAX_RETRIES && !currentSrc.includes('/public/')) {
      console.log('🔄 [OptimizedImage] Retry with explicit public URL, attempt:', retryCount + 1);
      setRetryCount(prev => prev + 1);
      
      const explicitPublicUrl = buildDesignUrl(src);
      if (explicitPublicUrl !== currentSrc) {
        setCurrentSrc(explicitPublicUrl);
        setIsError(false);
        return;
      }
    }
    
    // Try fallback if not already using it
    if (currentSrc !== fallbackSrc && retryCount < MAX_RETRIES) {
      console.log('🔄 [OptimizedImage] Trying fallback image:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setRetryCount(prev => prev + 1);
      setIsError(false);
    } else {
      console.log('💥 [OptimizedImage] All options exhausted for:', src);
      setIsError(true);
      setIsLoaded(true);
    }
    onError?.();
  };

  const imageStyle: React.CSSProperties = {
    aspectRatio: aspectRatio || 'auto',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
  };

  const blurStyle: React.CSSProperties = blur ? {
    filter: isLoaded ? 'none' : 'blur(10px)',
    transform: isLoaded ? 'scale(1)' : 'scale(1.1)',
    transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out',
  } : {};

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{ aspectRatio: aspectRatio || 'auto' }}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            ...imageStyle,
            ...blurStyle
          }}
          {...props}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#33C3F0] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state with diagnostic info */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400 p-4 max-w-xs">
            <div className="w-12 h-12 bg-gray-200 rounded mb-2 mx-auto flex items-center justify-center">
              <span className="text-gray-400">❌</span>
            </div>
            
            {diagnosticInfo && diagnosticInfo.status === 404 ? (
              <div>
                <p className="text-xs font-medium text-red-500">Fichier introuvable</p>
                <p className="text-xs">Le fichier n'existe pas dans le storage</p>
              </div>
            ) : diagnosticInfo && diagnosticInfo.status === 403 ? (
              <div>
                <p className="text-xs font-medium text-orange-500">Accès refusé</p>
                <p className="text-xs">Problème de permissions</p>
              </div>
            ) : currentSrc.includes('/sign/') ? (
              <div>
                <p className="text-xs font-medium text-red-500">Token expiré</p>
                <p className="text-xs">Image inaccessible</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500">Image non disponible</p>
                {diagnosticInfo?.error && (
                  <p className="text-xs text-red-400 mt-1">{diagnosticInfo.error}</p>
                )}
              </div>
            )}
            
            {/* URL debug info en mode développement */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-gray-200 rounded text-xs text-left">
                <p className="font-mono text-xs break-all">{currentSrc}</p>
                <p className="text-gray-600 mt-1">Tentatives: {retryCount}/{MAX_RETRIES}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
