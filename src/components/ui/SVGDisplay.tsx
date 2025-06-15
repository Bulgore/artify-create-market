
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

interface SVGDisplayProps {
  svgUrl: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  showError?: boolean;
}

export const SVGDisplay: React.FC<SVGDisplayProps> = ({
  svgUrl,
  className = "w-full h-full",
  onLoad,
  onError,
  showError = true
}) => {
  const [loadError, setLoadError] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!svgUrl) {
      setLoadError(true);
      setIsLoading(false);
      onError?.();
      return;
    }

    console.log('🖼️ Loading SVG from:', svgUrl);
    setIsLoading(true);
    setLoadError(false);

    // Fetch SVG content
    fetch(svgUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then(svgText => {
        // Validate SVG content
        if (!svgText.includes('<svg')) {
          throw new Error('Invalid SVG content');
        }
        
        console.log('✅ SVG loaded successfully');
        setSvgContent(svgText);
        setLoadError(false);
        setIsLoading(false);
        onLoad?.();
      })
      .catch(error => {
        console.error('❌ SVG loading failed:', error);
        setLoadError(true);
        setIsLoading(false);
        onError?.();
      });
  }, [svgUrl, onLoad, onError]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border border-gray-300 rounded`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Chargement SVG...</p>
        </div>
      </div>
    );
  }

  if (loadError || !svgContent) {
    return showError ? (
      <div className={`${className} flex items-center justify-center bg-red-50 border border-red-300 rounded`}>
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-600">Erreur chargement SVG</p>
          <p className="text-xs text-red-500 mt-1">{svgUrl.substring(0, 40)}...</p>
        </div>
      </div>
    ) : null;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
