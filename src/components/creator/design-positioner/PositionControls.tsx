
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Info } from 'lucide-react';

interface DesignPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DesignArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PositionControlsProps {
  position: DesignPosition;
  designArea: DesignArea;
  imageLoaded: boolean;
  onInputChange: (field: keyof DesignPosition, value: string) => void;
  onSizeChange: (dimension: 'width' | 'height', value: number[]) => void;
  onRotationChange: (rotation: number[]) => void;
  onReset: () => void;
}

export const PositionControls: React.FC<PositionControlsProps> = ({
  position,
  designArea,
  imageLoaded,
  onReset
}) => {
  return (
    <div className="mt-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Positionnement automatique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-3">
              🎯 <strong>Nouvelle expérience simplifiée :</strong>
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Votre design s'affiche automatiquement au centre</li>
              <li>• Taille optimisée pour la zone d'impression</li>
              <li>• Plus besoin de déplacer ou redimensionner</li>
              <li>• Conformité garantie avec le gabarit imprimeur</li>
            </ul>
          </div>

          {imageLoaded && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-600">Position X :</label>
                <p className="font-medium">{Math.round(position.x)}px</p>
              </div>
              <div>
                <label className="text-gray-600">Position Y :</label>
                <p className="font-medium">{Math.round(position.y)}px</p>
              </div>
              <div>
                <label className="text-gray-600">Largeur :</label>
                <p className="font-medium">{Math.round(position.width)}px</p>
              </div>
              <div>
                <label className="text-gray-600">Hauteur :</label>
                <p className="font-medium">{Math.round(position.height)}px</p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Recentrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
