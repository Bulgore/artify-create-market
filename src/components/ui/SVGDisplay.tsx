
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
        
        // Process SVG to ensure proper full display
        let processedSvg = svgText;
        
        // Remove fixed width/height attributes that might constrain the display
        processedSvg = processedSvg.replace(/\s(width|height)=["'][^"']*["']/g, '');
        
        // Ensure proper viewBox for full display
        if (!processedSvg.includes('viewBox=')) {
          // Try to extract original dimensions and create appropriate viewBox
          const originalWidthMatch = svgText.match(/width=["']([^"']+)["']/);
          const originalHeightMatch = svgText.match(/height=["']([^"']+)["']/);
          
          if (originalWidthMatch && originalHeightMatch) {
            const width = parseFloat(originalWidthMatch[1]);
            const height = parseFloat(originalHeightMatch[1]);
            if (!isNaN(width) && !isNaN(height)) {
              processedSvg = processedSvg.replace(
                '<svg',
                `<svg viewBox="0 0 ${width} ${height}"`
              );
            }
          }
        }
        
        // Ensure preserveAspectRatio for proper full scaling
        processedSvg = processedSvg.replace(/preserveAspectRatio=["'][^"']*["']/g, '');
        processedSvg = processedSvg.replace(
          '<svg',
          '<svg preserveAspectRatio="xMidYMid meet"'
        );
        
        // Add CSS to ensure full display
        processedSvg = processedSvg.replace(
          '<svg',
          '<svg style="width: 100%; height: 100%; max-width: 100%; max-height: 100%;"'
        );
        
        console.log('✅ SVG processed for full display');
        setSvgContent(processedSvg);
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
      className={`${className} w-full h-full overflow-hidden`}
      style={{ minHeight: '300px', maxHeight: '600px' }}
    >
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};
