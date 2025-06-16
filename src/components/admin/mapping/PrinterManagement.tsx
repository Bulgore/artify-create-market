
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Truck, Plus, Edit, Mail, Phone, MapPin, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface PrinterManagementProps {
  onPrinterSelect?: (printer: PrinterData) => void;
  selectedPrinterId?: string;
}

const PrinterManagement: React.FC<PrinterManagementProps> = ({ 
  onPrinterSelect, 
  selectedPrinterId 
}) => {
  const [printers, setPrinters] = useState<PrinterData[]>([]);
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
    fetchPrinters();
  }, []);

  const fetchPrinters = async () => {
    try {
      setLoading(true);
      
      // Simulation de données - à remplacer par vraie API Supabase
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
        },
        {
          id: '3',
          name: 'Atoll Creations',
          email: 'contact@atollcreations.com',
          phone: '+689 87 65 43 21',
          address: 'Moorea, Polynésie Française',
          specialties: ['Mugs', 'Objets personnalisés'],
          notes: 'Spécialiste objets publicitaires',
          is_active: true,
          created_at: '2024-01-15'
        }
      ];

      setPrinters(mockPrinters);
    } catch (error: any) {
      console.error('Error fetching printers:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les imprimeurs."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrinter = async () => {
    try {
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

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Imprimeurs ({printers.length})</h3>
        <Button onClick={openCreateDialog} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {printers.map((printer) => (
            <Card 
              key={printer.id} 
              className={`cursor-pointer transition-colors ${
                selectedPrinterId === printer.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => onPrinterSelect?.(printer)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{printer.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={printer.is_active ? "default" : "secondary"}>
                      {printer.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(printer);
                      }}
                    >
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Save className="h-4 w-4 mr-2" />
              {editingPrinter ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrinterManagement;
