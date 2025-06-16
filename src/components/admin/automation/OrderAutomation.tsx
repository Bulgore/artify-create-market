
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Zap, 
  FileText, 
  Mail, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationSettings {
  auto_generation: boolean;
  auto_send_email: boolean;
  auto_status_update: boolean;
  notification_email: string;
}

interface OrderQueue {
  id: string;
  order_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  printer_email?: string;
  error_message?: string;
}

const OrderAutomation = () => {
  const [settings, setSettings] = useState<AutomationSettings>({
    auto_generation: true,
    auto_send_email: true,
    auto_status_update: true,
    notification_email: 'admin@tahiticrea.com'
  });
  
  const [queue, setQueue] = useState<OrderQueue[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAutomationQueue();
  }, []);

  const loadAutomationQueue = async () => {
    // Simulation de la queue d'automatisation
    const mockQueue: OrderQueue[] = [
      {
        id: '1',
        order_id: 'ORDER-001',
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z',
        printer_email: 'orders@pacificprint.pf'
      },
      {
        id: '2',
        order_id: 'ORDER-002',
        status: 'processing',
        created_at: '2024-01-15T11:15:00Z',
        printer_email: 'print@oceaniagraphics.nc'
      },
      {
        id: '3',
        order_id: 'ORDER-003',
        status: 'failed',
        created_at: '2024-01-15T12:00:00Z',
        error_message: 'Fichier de production non généré'
      }
    ];
    
    setQueue(mockQueue);
  };

  const handleSettingsChange = (key: keyof AutomationSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Paramètre mis à jour",
      description: "La configuration d'automatisation a été sauvegardée."
    });
  };

  const retryFailedOrder = async (queueId: string) => {
    setLoading(true);
    
    // Simulation du retry
    setTimeout(() => {
      setQueue(prev => prev.map(item => 
        item.id === queueId 
          ? { ...item, status: 'processing' as const, error_message: undefined }
          : item
      ));
      
      toast({
        title: "Traitement relancé",
        description: "La commande a été remise en queue de traitement."
      });
      
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: OrderQueue['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: OrderQueue['status']) => {
    const config = {
      pending: { label: "En attente", variant: "secondary" as const },
      processing: { label: "En cours", variant: "default" as const },
      completed: { label: "Terminé", variant: "default" as const },
      failed: { label: "Échec", variant: "destructive" as const }
    };

    const { label, variant } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automatisation des Commandes</h2>
        <p className="text-gray-600">Configuration et suivi du processus automatisé</p>
      </div>

      {/* Paramètres d'automatisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres d'Automatisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-generation">Génération automatique des fichiers</Label>
                <p className="text-sm text-gray-500">
                  Générer automatiquement les fichiers de production (design + zone + specs)
                </p>
              </div>
              <Switch
                id="auto-generation"
                checked={settings.auto_generation}
                onCheckedChange={(checked) => handleSettingsChange('auto_generation', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-email">Envoi automatique par email</Label>
                <p className="text-sm text-gray-500">
                  Envoyer automatiquement les commandes aux imprimeurs par email
                </p>
              </div>
              <Switch
                id="auto-email"
                checked={settings.auto_send_email}
                onCheckedChange={(checked) => handleSettingsChange('auto_send_email', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-status">Mise à jour automatique des statuts</Label>
                <p className="text-sm text-gray-500">
                  Mettre à jour automatiquement les statuts de commande
                </p>
              </div>
              <Switch
                id="auto-status"
                checked={settings.auto_status_update}
                onCheckedChange={(checked) => handleSettingsChange('auto_status_update', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue de traitement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Queue de Traitement Automatique
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucune commande en cours de traitement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium">Commande {item.order_id}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString('fr-FR')}
                        </div>
                        {item.printer_email && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            {item.printer_email}
                          </div>
                        )}
                        {item.error_message && (
                          <p className="text-sm text-red-600 mt-1">{item.error_message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(item.status)}
                      {item.status === 'failed' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => retryFailedOrder(item.id)}
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Relancer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workflow automatisé */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Automatisé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
              </div>
              <div>
                <h5 className="font-medium">Détection nouvelle commande</h5>
                <p className="text-sm text-gray-600">Le système détecte automatiquement les nouvelles commandes payées</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              </div>
              <div>
                <h5 className="font-medium">Génération fichier de production</h5>
                <p className="text-sm text-gray-600">Création automatique du fichier avec design + zone d'impression + spécifications</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              </div>
              <div>
                <h5 className="font-medium">Routage vers imprimeur</h5>
                <p className="text-sm text-gray-600">Envoi automatique vers l'imprimeur assigné au gabarit utilisé</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
              </div>
              <div>
                <h5 className="font-medium">Suivi automatique</h5>
                <p className="text-sm text-gray-600">Mise à jour des statuts et notifications automatiques</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderAutomation;
