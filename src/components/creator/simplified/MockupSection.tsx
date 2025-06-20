
import React from 'react';
import { MockupPreview } from '../design-uploader/MockupPreview';
import type { PrintArea } from '@/types/printArea';

interface MockupSectionProps {
  mockupUrl?: string;
  designUrl?: string;
  designArea?: PrintArea;
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
