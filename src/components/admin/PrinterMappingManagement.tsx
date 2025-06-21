
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PrinterManagement from "./mapping/PrinterManagement";
import TemplateMappingPanel from "./mapping/TemplateMappingPanel";

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

interface Template {
  id: string;
  name_fr: string;
  type: string;
  is_active: boolean;
}

const PrinterMappingManagement = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [printers, setPrinters] = useState<PrinterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les gabarits depuis Supabase
      const { data: templatesData, error: templatesError } = await supabase
        .from('product_templates')
        .select('id, name_fr, type, is_active')
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      const { data: printersData, error: printersError } = await supabase
        .from('printers')
        .select('id, name, email, phone, address, specialties, notes, is_active, created_at');

      if (printersError) throw printersError;

      // Normaliser les données printer avec le bon type pour specialties
      const normalizedPrinters = (printersData || []).map((p: any) => ({
        ...p,
        specialties: Array.isArray(p.specialties) ? p.specialties : []
      }));

      setTemplates(templatesData || []);
      setPrinters(normalizedPrinters);

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

  const handlePrinterSelect = (printer: PrinterData) => {
    setSelectedPrinterId(printer.id);
  };

  const handleMappingChange = (mapping: any) => {
    console.log('Mapping changed:', mapping);
    // Ici on sauvegarderait le mapping en base de données
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mapping Imprimeurs</h1>
        <p className="text-gray-600">Gestion des imprimeurs et attribution des gabarits</p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Gestion des imprimeurs */}
          <div>
            <PrinterManagement 
              onPrinterSelect={handlePrinterSelect}
              selectedPrinterId={selectedPrinterId}
            />
          </div>

          {/* Attribution des gabarits */}
          <div>
            <TemplateMappingPanel
              templates={templates}
              printers={printers}
              onMappingChange={handleMappingChange}
            />
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">🚧 Priorité 4 - Automatisation à venir</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• <strong>Génération automatique</strong> des fichiers de production (design + zone + specs)</p>
          <p>• <strong>Envoi automatisé</strong> des commandes par email/API vers l'imprimeur assigné</p>
          <p>• <strong>Suivi des statuts</strong> et notifications automatiques</p>
          <p>• <strong>Dashboard optionnel</strong> ultra-light pour les imprimeurs</p>
        </div>
      </div>
    </div>
  );
};

export default PrinterMappingManagement;
