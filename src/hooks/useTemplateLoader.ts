
import { useState, useEffect } from 'react';

interface UseTemplateLoaderProps {
  templateSvgUrl: string;
}

export const useTemplateLoader = ({ templateSvgUrl }: UseTemplateLoaderProps) => {
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [templateError, setTemplateError] = useState(false);

  useEffect(() => {
    // Reset states when URL changes
    setTemplateLoaded(false);
    setTemplateError(false);

    if (!templateSvgUrl) {
      return;
    }

    console.log('Loading template:', templateSvgUrl);
    
    if (templateSvgUrl.startsWith('data:')) {
      console.log('✅ Template is data URL, marking as loaded');
      setTemplateLoaded(true);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Template image loaded successfully');
      setTemplateLoaded(true);
      setTemplateError(false);
    };
    
    img.onerror = (error) => {
      console.error('❌ Template failed to load:', error, templateSvgUrl);
      setTemplateLoaded(false);
      setTemplateError(true);
    };
    
    img.src = templateSvgUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [templateSvgUrl]);

  return {
    templateLoaded,
    templateError
  };
};
