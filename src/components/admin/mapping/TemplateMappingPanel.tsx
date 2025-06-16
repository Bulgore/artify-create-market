
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link2, AlertCircle, CheckCircle2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  specialties: string[];
  is_active: boolean;
}

interface TemplateMapping {
  template_id: string;
  printer_id: string;
  template_name: string;
  printer_name: string;
}

interface TemplateMappingPanelProps {
  templates: Template[];
  printers: PrinterData[];
  onMappingChange?: (mapping: TemplateMapping) => void;
}

const TemplateMappingPanel: React.FC<TemplateMappingPanelProps> = ({
  templates,
  printers,
  onMappingChange
}) => {
  const [mappings, setMappings] = useState<TemplateMapping[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les mappings existants (simulation)
    const mockMappings: TemplateMapping[] = templates.slice(0, 2).map((template, index) => ({
      template_id: template.id,
      printer_id: printers[index]?.id || '',
      template_name: template.name_fr,
      printer_name: printers[index]?.name || ''
    }));
    setMappings(mockMappings);
  }, [templates, printers]);

  const handleMappingChange = (templateId: string, printerId: string) => {
    const template = templates.find(t => t.id === templateId);
    const printer = printers.find(p => p.id === printerId);
    
    if (!template || !printer) return;

    const newMapping: TemplateMapping = {
      template_id: templateId,
      printer_id: printerId,
      template_name: template.name_fr,
      printer_name: printer.name
    };

    setMappings(prev => {
      const existing = prev.findIndex(m => m.template_id === templateId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newMapping;
        return updated;
      }
      return [...prev, newMapping];
    });

    onMappingChange?.(newMapping);
    
    toast({
      title: "Mapping mis à jour",
      description: `${template.name_fr} → ${printer.name}`
    });
  };

  const removeMappingForTemplate = (templateId: string) => {
    setMappings(prev => prev.filter(m => m.template_id !== templateId));
    toast({
      title: "Mapping supprimé",
      description: "L'association a été supprimée."
    });
  };

  const getMappingForTemplate = (templateId: string) => {
    return mappings.find(m => m.template_id === templateId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Attribution Gabarits → Imprimeurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucun gabarit disponible</p>
              <p className="text-sm text-gray-400">Créez d'abord des gabarits pour les attribuer</p>
            </div>
          ) : (
            templates.map((template) => {
              const currentMapping = getMappingForTemplate(template.id);
              
              return (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{template.name_fr}</h4>
                      <p className="text-sm text-gray-500">{template.type}</p>
                    </div>
                    <Badge variant={template.is_active ? "default" : "secondary"}>
                      {template.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Select
                        value={currentMapping?.printer_id || ""}
                        onValueChange={(printerId) => handleMappingChange(template.id, printerId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un imprimeur..." />
                        </SelectTrigger>
                        <SelectContent>
                          {printers
                            .filter(p => p.is_active)
                            .map((printer) => (
                              <SelectItem key={printer.id} value={printer.id}>
                                <div className="flex items-center gap-2">
                                  <span>{printer.name}</span>
                                  <div className="flex gap-1">
                                    {printer.specialties.slice(0, 2).map((specialty, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {currentMapping ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      
                      {currentMapping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMappingForTemplate(template.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {currentMapping && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                      <strong>Attribution active:</strong> {currentMapping.printer_name}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Comment ça fonctionne</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Chaque gabarit doit être associé à un imprimeur</p>
            <p>• Les commandes sont automatiquement routées vers l'imprimeur correspondant</p>
            <p>• Vous pouvez modifier l'attribution à tout moment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateMappingPanel;
