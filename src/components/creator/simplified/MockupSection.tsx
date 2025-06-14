
import React from 'react';
import { MockupPreview } from '../design-uploader/MockupPreview';
import type { DesignArea } from '@/types/designArea';

interface MockupSectionProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: DesignArea;
  designPosition?: any;
}

export const MockupSection: React.FC<MockupSectionProps> = ({
  mockupUrl,
  designUrl,
  designArea,
  designPosition
}) => {
  return (
    <MockupPreview
      mockupUrl={mockupUrl}
      designUrl={designUrl}
      designArea={designArea}
      designPosition={designPosition}
    />
  );
};
