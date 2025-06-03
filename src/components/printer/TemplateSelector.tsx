
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface ProductTemplate {
  id: string;
  name: string;
  type: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
  technical_instructions: string;
}

interface TemplateSelectorProps {
  selectedTemplateId: string | null;
  onTemplateSelect: (templateId: string, template: ProductTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onTemplateSelect
}) => {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching active templates for printer...");
      
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }

      console.log("Templates fetched successfully:", data?.length || 0, "templates");
      setTemplates(data || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "Information",
          description: "Aucun gabarit actif disponible. Contactez l'administrateur pour en créer.",
        });
      }
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits disponibles. Vérifiez vos permissions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="template">Gabarit de produit *</Label>
        <Select
          value={selectedTemplateId || ""}
          onValueChange={(value) => {
            const template = templates.find(t => t.id === value);
            if (template) {
              console.log("Template selected:", template.name, template.id);
              onTemplateSelect(value, template);
            }
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue 
              placeholder={
                isLoading 
                  ? "Chargement des gabarits..." 
                  : templates.length === 0 
                    ? "Aucun gabarit disponible"
                    : "Sélectionnez un gabarit"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-sm text-gray-500">({template.type})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTemplate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {selectedTemplate.mockup_image_url ? (
                  <img
                    src={selectedTemplate.mockup_image_url}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", selectedTemplate.mockup_image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm">{selectedTemplate.name}</h4>
                <p className="text-xs text-gray-600">Type: {selectedTemplate.type}</p>
                <p className="text-xs text-gray-600">
                  Positions: {selectedTemplate.available_positions?.join(', ') || 'Non spécifié'}
                </p>
                <p className="text-xs text-gray-600">
                  Couleurs: {selectedTemplate.available_colors?.join(', ') || 'Non spécifié'}
                </p>
                {selectedTemplate.technical_instructions && (
                  <p className="text-xs text-gray-500 italic">
                    {selectedTemplate.technical_instructions}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateSelector;
