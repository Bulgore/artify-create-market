import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Mail, Phone, MapPin, Save } from "lucide-react";
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
    // eslint-disable-next-line
  }, []);

  const fetchPrinters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('printers')
        .select('id, name, email, phone, address, specialties, notes, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fixedData = (data || []).map((p: any) => ({
        ...p,
        specialties: Array.isArray(p.specialties)
          ? p.specialties
          : (typeof p.specialties === "string" && p.specialties.startsWith("{")) // old array format
            ? p.specialties.replace(/^{|}$/g, "").split(",").map((s: string) => s.trim()).filter(Boolean)
            : p.specialties
              ? String(p.specialties).split(",").map((s: string) => s.trim()).filter(Boolean)
              : [],
      }));

      setPrinters(fixedData);
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
      const specialtiesArr = printerForm.specialties
        ? printerForm.specialties.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      if (editingPrinter) {
        // UPDATE
        const { error } = await supabase
          .from('printers')
          .update({
            name: printerForm.name,
            email: printerForm.email,
            phone: printerForm.phone,
            address: printerForm.address,
            specialties: specialtiesArr,
            notes: printerForm.notes,
            is_active: printerForm.is_active,
          })
          .eq('id', editingPrinter.id);

        if (error) throw error;
        toast({
          title: "Imprimeur modifié",
          description: "Les informations ont été mises à jour."
        });
      } else {
        // INSERT
        const { error } = await supabase
          .from('printers')
          .insert([{
            name: printerForm.name,
            email: printerForm.email,
            phone: printerForm.phone,
            address: printerForm.address,
            specialties: specialtiesArr,
            notes: printerForm.notes,
            is_active: printerForm.is_active,
          }]);
        if (error) throw error;
        toast({
          title: "Imprimeur ajouté",
          description: "Le nouvel imprimeur a été créé."
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchPrinters();
    } catch (error: any) {
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
      name: printer.name || '',
      email: printer.email || '',
      phone: printer.phone || '',
      address: printer.address || '',
      specialties: (printer.specialties || []).join(', '),
      notes: printer.notes || '',
      is_active: printer.is_active,
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
