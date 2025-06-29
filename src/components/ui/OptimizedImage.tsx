
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { buildDesignUrl } from '@/utils/imageUrl';

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
  const imgRef = useRef<HTMLImageElement>(null);
  const MAX_RETRIES = 2;

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setRetryCount(0);
    
    // Process the URL to handle signed URLs
    const processedSrc = buildDesignUrl(src);
    setCurrentSrc(processedSrc);
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
  }, [lazy, isInView]);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('✅ OptimizedImage loaded successfully:', currentSrc);
    setIsLoaded(true);
    setIsError(false);
    setRetryCount(0);
    onLoad?.();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ OptimizedImage failed to load:', currentSrc);
    
    // Si c'est une URL signée qui a échoué, essayer de la convertir en publique
    if (currentSrc.includes('/sign/') && retryCount < MAX_RETRIES) {
      console.log('🔄 OptimizedImage retry with public URL, attempt:', retryCount + 1);
      setRetryCount(prev => prev + 1);
      
      const publicUrl = buildDesignUrl(currentSrc);
      if (publicUrl !== currentSrc) {
        setCurrentSrc(publicUrl);
        setIsError(false);
        return;
      }
    }
    
    // Try fallback if not already using it
    if (currentSrc !== fallbackSrc && retryCount < MAX_RETRIES) {
      console.log('🔄 OptimizedImage trying fallback image:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setRetryCount(prev => prev + 1);
      setIsError(false);
    } else {
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

      {/* Error state with specific message for expired tokens */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400 p-4">
            <div className="w-12 h-12 bg-gray-200 rounded mb-2 mx-auto flex items-center justify-center">
              <span className="text-gray-400">❌</span>
            </div>
            {currentSrc.includes('/sign/') ? (
              <div>
                <p className="text-xs font-medium text-red-500">Token expiré</p>
                <p className="text-xs">Image inaccessible</p>
              </div>
            ) : (
              <p className="text-xs">Image non disponible</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
