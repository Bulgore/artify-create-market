
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Edit, Mail, Phone, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface TemplateMapping {
  template_id: string;
  printer_id: string;
  template_name: string;
  printer_name: string;
}

const PrinterMappingManagement = () => {
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [mappings, setMappings] = useState<TemplateMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterData | null>(null);
  const { toast } = useToast();

  const [printerForm, setPrinterForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialties: '',
    notes: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Note: En attendant la table printers, on simule des données
      const mockPrinters: PrinterData[] = [
        {
          id: '1',
          name: 'Pacific Print Co.',
          email: 'orders@pacificprint.pf',
          phone: '+689 40 50 60 70',
          address: 'Papeete, Tahiti',
          specialties: ['T-shirts', 'Hoodies', 'Tote bags'],
          notes: 'Spécialisé textile, livraison 3-5 jours',
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Oceania Graphics',
          email: 'print@oceaniagraphics.nc',
          phone: '+687 25 30 40',
          address: 'Nouméa, Nouvelle-Calédonie',
          specialties: ['Posters', 'Stickers', 'Cartes'],
          notes: 'Impression papier haute qualité',
          is_active: true,
          created_at: '2024-01-01'
        }
      ];

      // Récupérer les gabarits
      const { data: templatesData, error: templatesError } = await supabase
        .from('product_templates')
        .select('id, name_fr, type, is_active');

      if (templatesError) throw templatesError;

      setPrinters(mockPrinters);
      setTemplates(templatesData || []);

      // Simuler les mappings (à remplacer par de vraies données)
      const mockMappings: TemplateMapping[] = [
        {
          template_id: templatesData?.[0]?.id || '',
          printer_id: '1',
          template_name: templatesData?.[0]?.name_fr || '',
          printer_name: 'Pacific Print Co.'
        }
      ];
      setMappings(mockMappings);

    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrinter = async () => {
    try {
      // Simulation de sauvegarde (à remplacer par vraie API)
      const newPrinter: PrinterData = {
        id: editingPrinter?.id || Date.now().toString(),
        ...printerForm,
        specialties: printerForm.specialties.split(',').map(s => s.trim()),
        created_at: editingPrinter?.created_at || new Date().toISOString()
      };

      if (editingPrinter) {
        setPrinters(prev => prev.map(p => p.id === editingPrinter.id ? newPrinter : p));
        toast({
          title: "Imprimeur modifié",
          description: "Les informations ont été mises à jour."
        });
      } else {
        setPrinters(prev => [...prev, newPrinter]);
        toast({
          title: "Imprimeur ajouté",
          description: "Le nouvel imprimeur a été créé."
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'imprimeur."
      });
    }
  };

  const resetForm = () => {
    setPrinterForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialties: '',
      notes: '',
      is_active: true
    });
    setEditingPrinter(null);
  };

  const openEditDialog = (printer: PrinterData) => {
    setEditingPrinter(printer);
    setPrinterForm({
      name: printer.name,
      email: printer.email,
      phone: printer.phone || '',
      address: printer.address || '',
      specialties: printer.specialties.join(', '),
      notes: printer.notes || '',
      is_active: printer.is_active
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mapping Imprimeurs</h1>
          <p className="text-gray-600">Gestion des imprimeurs et attribution des gabarits</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Imprimeur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPrinter ? 'Modifier' : 'Ajouter'} un imprimeur
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={printerForm.name}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Pacific Print Co."
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={printerForm.email}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="orders@imprimeur.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={printerForm.phone}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+689 40 50 60 70"
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={printerForm.address}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Papeete, Tahiti"
                />
              </div>
              <div>
                <Label htmlFor="specialties">Spécialités (séparées par des virgules)</Label>
                <Input
                  id="specialties"
                  value={printerForm.specialties}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, specialties: e.target.value }))}
                  placeholder="T-shirts, Hoodies, Posters"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={printerForm.notes}
                  onChange={(e) => setPrinterForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Informations supplémentaires..."
                />
              </div>
              <Button 
                onClick={handleSavePrinter} 
                className="w-full"
                disabled={!printerForm.name || !printerForm.email}
              >
                {editingPrinter ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des imprimeurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Imprimeurs ({printers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500">Chargement...</p>
            ) : (
              <div className="space-y-4">
                {printers.map((printer) => (
                  <div key={printer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{printer.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={printer.is_active ? "default" : "secondary"}>
                          {printer.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(printer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{printer.email}</span>
                      </div>
                      {printer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{printer.phone}</span>
                        </div>
                      )}
                      {printer.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{printer.address}</span>
                        </div>
                      )}
                    </div>
                    {printer.specialties.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {printer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mapping gabarits → imprimeurs */}
        <Card>
          <CardHeader>
            <CardTitle>Attribution Gabarits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">🚧 En développement</h4>
                <p className="text-sm text-orange-700">
                  Le système d'attribution automatique des gabarits aux imprimeurs sera implémenté dans la priorité 3.
                </p>
              </div>
              
              {/* Simulation du futur mapping */}
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Mappings actuels simulés :</p>
                {mappings.map((mapping, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{mapping.template_name}</span>
                    <span>→</span>
                    <span>{mapping.printer_name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrinterMappingManagement;
