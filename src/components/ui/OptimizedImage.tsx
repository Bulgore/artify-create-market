
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  blur?: boolean;
  aspectRatio?: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  lazy = true,
  blur = true,
  aspectRatio,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(true);
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
          src={isError ? fallbackSrc : src}
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
      {!isLoaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#33C3F0] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
