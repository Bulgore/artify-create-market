
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, PlusCircle, Edit, Trash, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Automation {
  id: string;
  name: string;
  description: string;
  contentType: 'banner' | 'block' | 'product' | 'page';
  contentId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  conditions: {
    timeRange?: { start: string; end: string };
    userType?: string;
    pageUrl?: string;
  };
  actions: {
    show: boolean;
    hide: boolean;
    redirect?: string;
  };
}

const AutomationManagement = () => {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = () => {
    const saved = localStorage.getItem('automations');
    if (saved) {
      setAutomations(JSON.parse(saved));
    } else {
      // Exemples d'automatisations par défaut
      const defaultAutomations: Automation[] = [
        {
          id: '1',
          name: 'Banner Promo Été',
          description: 'Afficher la bannière de promotion été automatiquement',
          contentType: 'banner',
          contentId: 'summer-banner',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          isActive: true,
          conditions: {
            timeRange: { start: '09:00', end: '18:00' }
          },
          actions: {
            show: true,
            hide: false
          }
        },
        {
          id: '2',
          name: 'Produit en vedette',
          description: 'Mettre en avant les nouveaux produits pendant 2 semaines',
          contentType: 'product',
          contentId: 'new-tshirt-collection',
          startDate: '2024-06-15',
          endDate: '2024-06-30',
          isActive: false,
          conditions: {},
          actions: {
            show: true,
            hide: false
          }
        }
      ];
      setAutomations(defaultAutomations);
    }
  };

  const saveAutomations = (newAutomations: Automation[]) => {
    localStorage.setItem('automations', JSON.stringify(newAutomations));
    setAutomations(newAutomations);
  };

  const createNewAutomation = () => {
    const newAutomation: Automation = {
      id: Date.now().toString(),
      name: '',
      description: '',
      contentType: 'banner',
      contentId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      isActive: true,
      conditions: {},
      actions: {
        show: true,
        hide: false
      }
    };
    setEditingAutomation(newAutomation);
    setIsModalOpen(true);
  };

  const editAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
    setIsModalOpen(true);
  };

  const saveAutomation = () => {
    if (!editingAutomation) return;

    if (!editingAutomation.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de l'automatisation est obligatoire."
      });
      return;
    }

    let updatedAutomations;
    if (automations.find(a => a.id === editingAutomation.id)) {
      updatedAutomations = automations.map(a => a.id === editingAutomation.id ? editingAutomation : a);
    } else {
      updatedAutomations = [...automations, editingAutomation];
    }

    saveAutomations(updatedAutomations);
    setIsModalOpen(false);
    setEditingAutomation(null);

    toast({
      title: "Automatisation sauvegardée",
      description: "L'automatisation a été configurée avec succès."
    });
  };

  const toggleAutomation = (automationId: string, isActive: boolean) => {
    const updatedAutomations = automations.map(a => 
      a.id === automationId ? { ...a, isActive } : a
    );
    saveAutomations(updatedAutomations);
    
    toast({
      title: isActive ? "Automatisation activée" : "Automatisation désactivée",
      description: `L'automatisation a été ${isActive ? 'activée' : 'désactivée'}.`
    });
  };

  const deleteAutomation = (automationId: string) => {
    const updatedAutomations = automations.filter(a => a.id !== automationId);
    saveAutomations(updatedAutomations);
    
    toast({
      title: "Automatisation supprimée",
      description: "L'automatisation a été supprimée."
    });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'banner': return '🏷️';
      case 'block': return '🧩';
      case 'product': return '📦';
      case 'page': return '📄';
      default: return '⚙️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const isAutomationActive = (automation: Automation) => {
    if (!automation.isActive) return false;
    
    const now = new Date();
    const start = new Date(automation.startDate);
    const end = new Date(automation.endDate);
    
    return now >= start && now <= end;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automatisations
            </CardTitle>
            <Button 
              onClick={createNewAutomation}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouvelle automatisation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune automatisation configurée</p>
                <p className="text-sm">Créez votre première automatisation pour commencer</p>
              </div>
            ) : (
              automations.map((automation) => (
                <div key={automation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getContentTypeIcon(automation.contentType)}</span>
                        <h3 className="font-medium">{automation.name}</h3>
                        <div className="flex items-center gap-2">
                          {isAutomationActive(automation) ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
                              <Play className="h-3 w-3" />
                              Active
                            </span>
                          ) : automation.isActive ? (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1">
                              <Pause className="h-3 w-3" />
                              Programmée
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {automation.description && (
                        <p className="text-sm text-gray-600">{automation.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>
                          📅 Du {formatDate(automation.startDate)} au {formatDate(automation.endDate)}
                        </div>
                        <div>
                          🎯 Type: {automation.contentType} • ID: {automation.contentId}
                        </div>
                        {automation.conditions.timeRange && (
                          <div>
                            ⏰ Horaires: {automation.conditions.timeRange.start} - {automation.conditions.timeRange.end}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={automation.isActive}
                        onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editAutomation(automation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteAutomation(automation.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      {isModalOpen && editingAutomation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {automations.find(a => a.id === editingAutomation.id) ? "Modifier" : "Créer"} une automatisation
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom*</Label>
                <Input
                  id="name"
                  value={editingAutomation.name}
                  onChange={(e) => setEditingAutomation({ 
                    ...editingAutomation, 
                    name: e.target.value 
                  })}
                  placeholder="Nom de l'automatisation"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingAutomation.description}
                  onChange={(e) => setEditingAutomation({ 
                    ...editingAutomation, 
                    description: e.target.value 
                  })}
                  placeholder="Description de l'automatisation"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentType">Type de contenu</Label>
                  <select
                    id="contentType"
                    value={editingAutomation.contentType}
                    onChange={(e) => setEditingAutomation({ 
                      ...editingAutomation, 
                      contentType: e.target.value as Automation['contentType']
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="banner">Bannière</option>
                    <option value="block">Bloc</option>
                    <option value="product">Produit</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="contentId">ID du contenu</Label>
                  <Input
                    id="contentId"
                    value={editingAutomation.contentId}
                    onChange={(e) => setEditingAutomation({ 
                      ...editingAutomation, 
                      contentId: e.target.value 
                    })}
                    placeholder="ID ou slug du contenu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingAutomation.startDate}
                    onChange={(e) => setEditingAutomation({ 
                      ...editingAutomation, 
                      startDate: e.target.value 
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingAutomation.endDate}
                    onChange={(e) => setEditingAutomation({ 
                      ...editingAutomation, 
                      endDate: e.target.value 
                    })}
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Conditions (optionnel)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeStart">Heure de début</Label>
                    <Input
                      id="timeStart"
                      type="time"
                      value={editingAutomation.conditions.timeRange?.start || ''}
                      onChange={(e) => setEditingAutomation({ 
                        ...editingAutomation, 
                        conditions: {
                          ...editingAutomation.conditions,
                          timeRange: {
                            start: e.target.value,
                            end: editingAutomation.conditions.timeRange?.end || ''
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeEnd">Heure de fin</Label>
                    <Input
                      id="timeEnd"
                      type="time"
                      value={editingAutomation.conditions.timeRange?.end || ''}
                      onChange={(e) => setEditingAutomation({ 
                        ...editingAutomation, 
                        conditions: {
                          ...editingAutomation.conditions,
                          timeRange: {
                            start: editingAutomation.conditions.timeRange?.start || '',
                            end: e.target.value
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={editingAutomation.isActive}
                  onCheckedChange={(checked) => setEditingAutomation({ 
                    ...editingAutomation, 
                    isActive: checked 
                  })}
                />
                <Label htmlFor="isActive">Automatisation active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAutomation(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={saveAutomation}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationManagement;
