
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Settings } from 'lucide-react';

interface TemplatesHeaderProps {
  onCreateTemplate: () => void;
}

const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({ onCreateTemplate }) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestion des Gabarits
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Créez et gérez les modèles de produits utilisables par les imprimeurs
          </p>
        </div>
        <Button onClick={onCreateTemplate} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau gabarit
        </Button>
      </div>
    </CardHeader>
  );
};

export default TemplatesHeader;
