
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { mapTemplateWithCompatibility } from '@/types/customProduct';

interface ProductTemplate {
  id: string;
  name?: string;
  name_fr: string;
  name_en?: string | null;
  name_ty?: string | null;
  type: string;
  mockup_image_url: string;
  design_area: any;
  available_positions: string[];
  available_colors: string[];
}

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string, template: ProductTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplateId, 
  onTemplateSelect 
}) => {
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .eq('is_active', true)
        .order('name_fr');

      if (error) throw error;

      const mappedTemplates = (data || []).map(template => {
        const mapped = mapTemplateWithCompatibility(template);
        return {
          ...mapped,
          name: template.name_fr || template.name || ''
        };
      });

      setTemplates(mappedTemplates);
    } catch (error: any) {
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
            Aucun gabarit de produit n'est actuellement disponible.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un gabarit de produit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTemplateId === template.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onTemplateSelect(template.id, template)}
            >
              <img
                src={template.mockup_image_url}
                alt={template.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <h3 className="font-medium mb-2">{template.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="secondary">{template.type}</Badge>
                <Badge variant="outline">
                  {template.available_positions?.length || 0} position(s)
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {template.available_colors?.length || 0} couleur(s) disponible(s)
              </div>
              {selectedTemplateId === template.id && (
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
