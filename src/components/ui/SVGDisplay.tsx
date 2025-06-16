
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
        // Basic SVG validation
        if (!svgText.includes('<svg')) {
          throw new Error('Invalid SVG content - no <svg> tag found');
        }
        
        console.log('✅ SVG content loaded, length:', svgText.length);
        
        // Minimal processing for reliable display
        let processedSvg = svgText;
        
        // Ensure the SVG has proper viewBox and dimensions for full display
        if (!processedSvg.includes('viewBox=')) {
          // If no viewBox, try to extract width/height and create one
          const widthMatch = svgText.match(/width=["']([^"']+)["']/);
          const heightMatch = svgText.match(/height=["']([^"']+)["']/);
          
          if (widthMatch && heightMatch) {
            const width = parseFloat(widthMatch[1]);
            const height = parseFloat(heightMatch[1]);
            if (!isNaN(width) && !isNaN(height)) {
              processedSvg = processedSvg.replace(
                '<svg',
                `<svg viewBox="0 0 ${width} ${height}"`
              );
              console.log('✅ Added viewBox:', `0 0 ${width} ${height}`);
            }
          }
        }
        
        // Ensure proper scaling behavior
        processedSvg = processedSvg.replace(/preserveAspectRatio=["'][^"']*["']/g, '');
        processedSvg = processedSvg.replace(
          '<svg',
          '<svg preserveAspectRatio="xMidYMid meet"'
        );
        
        console.log('✅ SVG processed successfully');
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
          <div className="mt-2 text-xs text-gray-600">
            <p>Vérifiez que le fichier SVG est valide</p>
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div 
      className={className}
      style={{ minHeight: '300px' }}
    >
      <div 
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};
