
import React from "react";
import { Settings } from "lucide-react";
import TemplateCard from "./TemplateCard";

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
  svg_file_url: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
  is_active: boolean;
  created_at: string;
}

interface TemplatesGridProps {
  templates: ProductTemplate[];
  isLoading: boolean;
  onEditTemplate: (template: ProductTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  templates,
  isLoading,
  onEditTemplate,
  onDeleteTemplate
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Chargement des gabarits...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-10">
        <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 mb-2">Aucun gabarit créé</p>
        <p className="text-sm text-gray-400">Créez votre premier gabarit pour commencer</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEditTemplate}
          onDelete={onDeleteTemplate}
        />
      ))}
    </div>
  );
};

export default TemplatesGrid;
