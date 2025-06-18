
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { MousePointer, Info } from 'lucide-react';

export const PrintAreaHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MousePointer className="h-5 w-5" />
        Configuration des zones d'impression
      </CardTitle>
      <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded">
        <Info className="h-4 w-4" />
        <span>Les zones SVG et mockup sont indépendantes. Seule la zone SVG sera utilisée pour l'impression.</span>
      </div>
    </CardHeader>
  );
};
