import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Edit, 
  Trash, 
  Plus, 
  Save, 
  X,
  FileImage,
  Settings,
  Palette,
  MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import TemplateFileUpload from "./content/TemplateFileUpload";
import PrintAreaSelector from "./content/PrintAreaSelector";

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

  // Vérifier que l'utilisateur est bien superAdmin
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau gabarit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTemplate ? 'Modifier le gabarit' : 'Créer un nouveau gabarit'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom du produit</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="T-shirt classique"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        placeholder="T-shirt, Mug, Sac..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TemplateFileUpload
                      label="Fichier SVG du produit"
                      accept=".svg,image/svg+xml"
                      currentUrl={formData.svg_file_url}
                      onUrlChange={(url) => setFormData({...formData, svg_file_url: url})}
                      fileType="svg"
                    />
                    
                    <TemplateFileUpload
                      label="Image mockup du produit"
                      accept="image/*"
                      currentUrl={formData.mockup_image_url}
                      onUrlChange={(url) => setFormData({...formData, mockup_image_url: url})}
                      fileType="image"
                    />
                  </div>

                  <PrintAreaSelector
                    svgUrl={formData.svg_file_url}
                    printArea={formData.design_area}
                    onPrintAreaChange={(area) => setFormData({...formData, design_area: area})}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Positions disponibles (séparées par des virgules)</Label>
                      <Input
                        value={formData.available_positions.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData, 
                          available_positions: e.target.value.split(',').map(s => s.trim())
                        })}
                        placeholder="face, dos, manche"
                      />
                    </div>
                    <div>
                      <Label>Couleurs disponibles (séparées par des virgules)</Label>
                      <Input
                        value={formData.available_colors.join(', ')}
                        onChange={(e) => setFormData({
                          ...formData, 
                          available_colors: e.target.value.split(',').map(s => s.trim())
                        })}
                        placeholder="white, black, red"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="instructions">Instructions techniques</Label>
                    <Textarea
                      id="instructions"
                      value={formData.technical_instructions}
                      onChange={(e) => setFormData({...formData, technical_instructions: e.target.value})}
                      placeholder="Instructions pour les créateurs..."
                      className="h-24"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button onClick={handleSaveTemplate} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                      <Save className="h-4 w-4 mr-2" />
                      {editingTemplate ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Chargement des gabarits...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-10">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">Aucun gabarit créé</p>
              <p className="text-sm text-gray-400">Créez votre premier gabarit pour commencer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="group hover:shadow-md transition-shadow">
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
                        onClick={() => openEditDialog(template)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesManagement;
