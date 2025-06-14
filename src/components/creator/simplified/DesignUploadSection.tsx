
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleDesignUploader } from '../design-uploader/SimpleDesignUploader';
import { DesignPreview } from '../design-uploader/DesignPreview';

interface DesignUploadSectionProps {
  onDesignUpload: (url: string) => void;
  designUrl: string;
  autoDesignPosition: any;
  onDesignRemove: () => void;
}

export const DesignUploadSection: React.FC<DesignUploadSectionProps> = ({
  onDesignUpload,
  designUrl,
  autoDesignPosition,
  onDesignRemove
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload du design</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleDesignUploader onDesignUpload={onDesignUpload} />
          {designUrl && autoDesignPosition && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              ✅ Design uploadé et positionné automatiquement dans la zone d'impression
              <div className="text-xs mt-1">
                Taille optimale calculée: {Math.round(autoDesignPosition.width)}×{Math.round(autoDesignPosition.height)}px
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DesignPreview 
        designUrl={designUrl} 
        onRemove={onDesignRemove} 
      />
    </div>
  );
};
