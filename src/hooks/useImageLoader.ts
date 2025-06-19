
import { useState, useEffect, useRef } from 'react';

interface UseImageLoaderProps {
  svgUrl: string;
  mockupUrl?: string;
}

export const useImageLoader = ({ svgUrl, mockupUrl }: UseImageLoaderProps) => {
  const [svgImageLoaded, setSvgImageLoaded] = useState(false);
  const [mockupImageLoaded, setMockupImageLoaded] = useState(false);
  
  const svgImageRef = useRef<HTMLImageElement>(null);
  const mockupImageRef = useRef<HTMLImageElement>(null);

  // Load SVG image
  useEffect(() => {
    if (svgUrl) {
      console.log('Loading SVG image:', svgUrl);
      setSvgImageLoaded(false);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('SVG image loaded successfully', {
          width: img.naturalWidth,
          height: img.naturalHeight,
          src: img.src
        });
        svgImageRef.current = img;
        setSvgImageLoaded(true);
      };
      
      img.onerror = (error) => {
        console.error('Error loading SVG image:', error, 'URL:', svgUrl);
        setSvgImageLoaded(false);
        svgImageRef.current = null;
      };
      
      img.src = svgUrl;
    } else {
      console.log('No SVG URL provided');
      setSvgImageLoaded(false);
      svgImageRef.current = null;
    }
  }, [svgUrl]);

  // Load mockup image
  useEffect(() => {
    if (mockupUrl) {
      console.log('Loading mockup image:', mockupUrl);
      setMockupImageLoaded(false);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('Mockup image loaded successfully', {
          width: img.naturalWidth,
          height: img.naturalHeight,
          src: img.src
        });
        mockupImageRef.current = img;
        setMockupImageLoaded(true);
      };
      
      img.onerror = (error) => {
        console.error('Error loading mockup image:', error, 'URL:', mockupUrl);
        setMockupImageLoaded(false);
        mockupImageRef.current = null;
      };
      
      img.src = mockupUrl;
    } else {
      console.log('No mockup URL provided');
      setMockupImageLoaded(false);
      mockupImageRef.current = null;
    }
  }, [mockupUrl]);

  return {
    svgImageRef,
    mockupImageRef,
    svgImageLoaded,
    mockupImageLoaded
  };
};
