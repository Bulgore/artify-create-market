
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Settings } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import TemplatesGrid from "./templates/TemplatesGrid";
import TemplateDialog from "./templates/TemplateDialog";

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

const TemplatesManagement = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    svg_file_url: '',
    mockup_image_url: '',
    design_area: { x: 0, y: 0, width: 200, height: 200 },
    available_positions: ['face'],
    available_colors: ['white', 'black'],
    technical_instructions: '',
    is_active: true
  });

  useEffect(() => {
    if (!isSuperAdmin()) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent accéder aux gabarits.",
      });
      return;
    }
    fetchTemplates();
  }, [isSuperAdmin]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error fetching templates:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les gabarits.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user) return;

    try {
      const templateData = {
        ...formData,
        created_by: user.id,
        design_area: JSON.stringify(formData.design_area)
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('product_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);

        if (error) throw error;
        
        toast({
          title: "Gabarit mis à jour",
          description: "Le gabarit a été mis à jour avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('product_templates')
          .insert([templateData]);

        if (error) throw error;
        
        toast({
          title: "Gabarit créé",
          description: "Le nouveau gabarit a été créé avec succès.",
        });
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le gabarit.",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('product_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
      
      toast({
        title: "Gabarit supprimé",
        description: "Le gabarit a été supprimé avec succès.",
      });
      
      fetchTemplates();
    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le gabarit.",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      svg_file_url: '',
      mockup_image_url: '',
      design_area: { x: 0, y: 0, width: 200, height: 200 },
      available_positions: ['face'],
      available_colors: ['white', 'black'],
      technical_instructions: '',
      is_active: true
    });
  };

  const openEditDialog = (template: ProductTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      svg_file_url: template.svg_file_url,
      mockup_image_url: template.mockup_image_url,
      design_area: typeof template.design_area === 'string' 
        ? JSON.parse(template.design_area) 
        : template.design_area,
      available_positions: template.available_positions,
      available_colors: template.available_colors,
      technical_instructions: template.technical_instructions,
      is_active: template.is_active
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Accès refusé - Réservé aux super administrateurs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
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
            <Button onClick={openCreateDialog} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau gabarit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TemplatesGrid
            templates={templates}
            isLoading={isLoading}
            onEditTemplate={openEditDialog}
            onDeleteTemplate={handleDeleteTemplate}
          />
        </CardContent>
      </Card>

      <TemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingTemplate={editingTemplate}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplatesManagement;
