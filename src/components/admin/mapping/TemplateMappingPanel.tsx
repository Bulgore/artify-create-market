
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link2, Unlink } from "lucide-react";

interface Template {
  id: string;
  name_fr: string;
  type: string;
  is_active: boolean;
}

interface PrinterData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  specialties: string[];
  notes?: string;
  is_active: boolean;
  created_at: string;
}

interface TemplateMappingPanelProps {
  templates: Template[];
  printers: PrinterData[];
  onMappingChange: (mapping: any) => void;
}

interface Mapping {
  id: string;
  template_id: string;
  printer_id: string;
  printer_name: string;
}

const TemplateMappingPanel: React.FC<TemplateMappingPanelProps> = ({
  templates,
  printers,
  onMappingChange
}) => {
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Charger les mappings existants
  useEffect(() => {
    loadMappings();
  }, []);

  const loadMappings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('template_printers')
        .select(`
          id,
          template_id,
          printer_id,
          printers!inner(name)
        `);

      if (error) {
        console.error('❌ Error loading mappings:', error);
        throw error;
      }

      const formattedMappings = (data || []).map((mapping: any) => ({
        id: mapping.id,
        template_id: mapping.template_id,
        printer_id: mapping.printer_id,
        printer_name: mapping.printers?.name || 'Inconnu'
      }));

      console.log('✅ Mappings loaded:', formattedMappings);
      setMappings(formattedMappings);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les mappings."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMapping = async () => {
    if (!selectedTemplate || !selectedPrinter) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un gabarit et un imprimeur."
      });
      return;
    }

    // Vérifier si le mapping existe déjà
    const existingMapping = mappings.find(
      m => m.template_id === selectedTemplate && m.printer_id === selectedPrinter
    );

    if (existingMapping) {
      toast({
        variant: "destructive",
        title: "Mapping existant",
        description: "Ce mapping existe déjà."
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('template_printers')
        .insert({
          template_id: selectedTemplate,
          printer_id: selectedPrinter
        });

      if (error) {
        console.error('❌ Error creating mapping:', error);
        throw error;
      }

      toast({
        title: "Mapping créé",
        description: "L'association gabarit-imprimeur a été créée."
      });

      // Recharger les mappings
      await loadMappings();
      
      // Reset des sélections
      setSelectedTemplate('');
      setSelectedPrinter('');
      
      onMappingChange({ created: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le mapping."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('template_printers')
        .delete()
        .eq('id', mappingId);

      if (error) {
        console.error('❌ Error deleting mapping:', error);
        throw error;
      }

      toast({
        title: "Mapping supprimé",
        description: "L'association a été supprimée."
      });

      await loadMappings();
      onMappingChange({ deleted: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le mapping."
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name_fr || 'Gabarit inconnu';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Attribution des Gabarits ({mappings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulaire de création */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Gabarit</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un gabarit" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name_fr} ({template.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Imprimeur</label>
              <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un imprimeur" />
                </SelectTrigger>
                <SelectContent>
                  {printers.filter(p => p.is_active).map(printer => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateMapping}
            disabled={loading || !selectedTemplate || !selectedPrinter}
            className="w-full"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Créer l'association
          </Button>
        </CardContent>
      </Card>

      {/* Liste des mappings existants */}
      <Card>
        <CardHeader>
          <CardTitle>Associations existantes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : mappings.length === 0 ? (
            <p className="text-center text-gray-500">Aucune association configurée</p>
          ) : (
            <div className="space-y-3">
              {mappings.map(mapping => (
                <div 
                  key={mapping.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {getTemplateName(mapping.template_id)}
                      </Badge>
                      <span className="text-gray-400">→</span>
                      <Badge variant="secondary">
                        {mapping.printer_name}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMapping(mapping.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Unlink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateMappingPanel;
