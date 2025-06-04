
import { useState } from 'react';

export const useDesignManagement = () => {
  const [designUrl, setDesignUrl] = useState('');
  const [designPosition, setDesignPosition] = useState(null);
  const [showPositioner, setShowPositioner] = useState(false);

  const handleDesignUpload = (url: string) => {
    setDesignUrl(url);
    setShowPositioner(!!url);
  };

  const handlePositionChange = (position: any) => {
    setDesignPosition(position);
  };

  const resetDesign = () => {
    setDesignUrl('');
    setDesignPosition(null);
    setShowPositioner(false);
  };

  return {
    designUrl,
    designPosition,
    showPositioner,
    handleDesignUpload,
    handlePositionChange,
    resetDesign
  };
};
