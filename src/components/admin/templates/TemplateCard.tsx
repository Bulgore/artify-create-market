
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, FileImage, MapPin, Palette } from "lucide-react";

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
            onClick={() => onEdit(template)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(template.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
