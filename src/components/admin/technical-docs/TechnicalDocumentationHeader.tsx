
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TechnicalDocumentationHeaderProps {
  onExport: () => void;
}

const TechnicalDocumentationHeader = ({ onExport }: TechnicalDocumentationHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentation Technique Complète</h1>
        <p className="text-gray-600 mt-2">Documentation exhaustive pour maintenance, migration et reprise du projet Podsleek</p>
      </div>
      <Button onClick={onExport} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Exporter Documentation Complète
      </Button>
    </div>
  );
};

export default TechnicalDocumentationHeader;
