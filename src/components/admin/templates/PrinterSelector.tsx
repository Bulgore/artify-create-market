
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrinters } from "@/hooks/usePrinters";

interface PrinterSelectorProps {
  selectedPrinterId: string;
  onPrinterChange: (printerId: string) => void;
}

export const PrinterSelector: React.FC<PrinterSelectorProps> = ({
  selectedPrinterId,
  onPrinterChange
}) => {
  const { printers, loading } = usePrinters();

  console.log('🖨️ PrinterSelector render:', { 
    selectedPrinterId, 
    printersCount: printers.length,
    loading,
    printers: printers.map(p => ({ id: p.id, name: p.name }))
  });

  const handleValueChange = (value: string) => {
    console.log('🔄 PrinterSelector value change:', { oldValue: selectedPrinterId, newValue: value });
    if (value && value !== "loading" && value !== "no-printers") {
      onPrinterChange(value);
    }
  };

  return (
    <div>
      <Label>Imprimeur associé *</Label>
      <Select
        value={selectedPrinterId || undefined}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir un imprimeur" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="loading" disabled>
              Chargement des imprimeurs...
            </SelectItem>
          ) : printers.length === 0 ? (
            <SelectItem value="no-printers" disabled>
              Aucun imprimeur disponible
            </SelectItem>
          ) : (
            printers.map((printer) => (
              <SelectItem key={printer.id} value={printer.id}>
                {printer.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {selectedPrinterId && printers.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Imprimeur sélectionné: {printers.find(p => p.id === selectedPrinterId)?.name || 'Inconnu'}
        </p>
      )}
    </div>
  );
};
