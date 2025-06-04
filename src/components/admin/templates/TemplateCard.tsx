
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, FileImage, MapPin, Palette } from "lucide-react";
import { ProductTemplate } from "@/types/templates";

interface TemplateCardProps {
  template: ProductTemplate;
  onEdit: (template: ProductTemplate) => void;
  onDelete: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le gabarit "${template.name}" ? Cette action est irréversible.`)) {
      return;
    }

    console.log(`Attempting to delete template: ${template.id}`);
    onDelete(template.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(template);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {template.mockup_image_url ? (
            <img
              src={template.mockup_image_url}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileImage className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{template.name}</h3>
            <Badge variant="outline" className="text-xs">
              {template.type}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{template.available_positions.join(', ')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Palette className="h-3 w-3" />
            <span>{template.available_colors.join(', ')}</span>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            type="button"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
            type="button"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
