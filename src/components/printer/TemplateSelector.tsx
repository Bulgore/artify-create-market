
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProductTemplate {
  id: string;
  name: string;
  technical_instructions?: string | null;
  type: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
}

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string, template: ProductTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .eq('is_active', true)
        .order('name_fr');

      if (error) throw error;

      // Mapper avec compatibilité
      const mappedTemplates = (data || []).map((template: any) => ({
        ...template,
        name: template.name_fr ?? template.name ?? '',
        technical_instructions: template.technical_instructions_fr ?? template.technical_instructions ?? null
      }));

      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: ProductTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect(template.id, template);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des gabarits...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun gabarit disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucun gabarit de produit n'est actuellement disponible. Contactez l'administrateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un gabarit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <img
                src={template.mockup_image_url}
                alt={template.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-medium mb-2">{template.name}</h3>
              <Badge variant="secondary" className="mb-2">{template.type}</Badge>
              {template.technical_instructions && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.technical_instructions}
                </p>
              )}
              {selectedTemplate?.id === template.id && (
                <Button size="sm" className="w-full mt-2">
                  Sélectionné
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
