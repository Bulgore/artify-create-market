
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createDesign } from '@/services/designsService';

interface TemplateType {
  id: string;
  name: string;
  images: string[];
  base_price: number;
}

const NewDesign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    creator_margin: 5
  });
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('id, name_fr, name, images, base_price, stock_quantity')
        .neq('stock_quantity', 0);
      
      if (error) throw error;
      
      // Mapper avec compatibilité
      const mappedTemplates = (data || []).map((template: any) => ({
        ...template,
        name: template.name ?? template.name_fr ?? '',
        id: template.id,
        images: template.images || [],
        base_price: template.base_price || 0
      }));
      
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits."
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'creator_margin' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour créer un design."
      });
      return;
    }

    if (!selectedTemplate) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un gabarit."
      });
      return;
    }

    setIsLoading(true);

    try {
      const designData = {
        name_fr: formData.name,
        description_fr: formData.description,
        creator_id: user.id,
        price: formData.price,
        creator_margin: formData.creator_margin,
        preview_url: '/placeholder.svg',
        canvas_data: JSON.stringify({ template_id: selectedTemplate }),
        is_published: false
      };

      const { error } = await createDesign(designData);
      
      if (error) throw error;

      toast({
        title: "Design créé",
        description: "Votre design a été créé avec succès."
      });

      navigate('/studio');
    } catch (error: any) {
      console.error('Error creating design:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le design."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un nouveau design</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nom du design</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="template">Gabarit</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un gabarit" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} - {template.base_price}€
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="creator_margin">Marge créateur (€)</Label>
                <Input
                  id="creator_margin"
                  name="creator_margin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.creator_margin}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Création...' : 'Créer le design'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewDesign;
