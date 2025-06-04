
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, FileImage, MapPin, Palette } from "lucide-react";
import { ProductTemplate } from "@/types/templates";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le gabarit "${template.name}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      console.log(`Attempting to delete template: ${template.id}`);
      
      // D'abord, vérifier s'il y a des produits qui utilisent ce gabarit
      const { data: productsUsingTemplate, error: checkError } = await supabase
        .from('print_products')
        .select('id, name')
        .eq('template_id', template.id);

      if (checkError) {
        console.error('Error checking template usage:', checkError);
        throw checkError;
      }

      if (productsUsingTemplate && productsUsingTemplate.length > 0) {
        const productNames = productsUsingTemplate.map(p => p.name).join(', ');
        toast({
          variant: "destructive",
          title: "Impossible de supprimer",
          description: `Ce gabarit est utilisé par ces produits : ${productNames}. Veuillez d'abord les modifier pour retirer le gabarit.`
        });
        return;
      }

      const { error } = await supabase
        .from('product_templates')
        .delete()
        .eq('id', template.id);

      if (error) {
        console.error('Error deleting template:', error);
        throw error;
      }

      console.log(`Template ${template.id} deleted successfully`);
      
      toast({
        title: "Gabarit supprimé",
        description: `Le gabarit "${template.name}" a été supprimé avec succès.`
      });

      onDelete(template.id);
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de supprimer le gabarit : ${error.message || 'Erreur inconnue'}`
      });
    }
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
            onClick={() => onEdit(template)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
