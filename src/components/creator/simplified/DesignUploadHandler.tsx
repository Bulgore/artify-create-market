
import React from 'react';
import { DesignUploadSection } from './DesignUploadSection';
import type { PrintProduct } from '@/types/customProduct';

interface DesignUploadHandlerProps {
  selectedProduct: PrintProduct | null;
  designUrl: string;
  autoDesignPosition: any;
  onDesignUpload: (url: string) => Promise<void>;
  onDesignRemove: () => void;
}

export const DesignUploadHandler: React.FC<DesignUploadHandlerProps> = ({
  selectedProduct,
  designUrl,
  autoDesignPosition,
  onDesignUpload,
  onDesignRemove
}) => {
  if (!selectedProduct) return null;

  return (
    <DesignUploadSection
      onDesignUpload={onDesignUpload}
      designUrl={designUrl}
      autoDesignPosition={autoDesignPosition}
      onDesignRemove={onDesignRemove}
    />
  );
};
