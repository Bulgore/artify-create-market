
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
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('SVG image loaded successfully');
        svgImageRef.current = img;
        setSvgImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Error loading SVG image:', error);
        setSvgImageLoaded(false);
      };
      img.src = svgUrl;
    } else {
      setSvgImageLoaded(false);
    }
  }, [svgUrl]);

  // Load mockup image
  useEffect(() => {
    if (mockupUrl) {
      console.log('Loading mockup image:', mockupUrl);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Mockup image loaded successfully');
        mockupImageRef.current = img;
        setMockupImageLoaded(true);
      };
      img.onerror = (error) => {
        console.error('Error loading mockup image:', error);
        setMockupImageLoaded(false);
      };
      img.src = mockupUrl;
    } else {
      setMockupImageLoaded(false);
    }
  }, [mockupUrl]);

  return {
    svgImageRef,
    mockupImageRef,
    svgImageLoaded,
    mockupImageLoaded
  };
};
