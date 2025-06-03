
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProductForm } from "@/hooks/useProductForm";
import PrinterTabs from "@/components/printer/PrinterTabs";

interface PrintProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  template_id: string | null;
  is_active: boolean;
}

const PrinterStudio: React.FC = () => {
  const { user } = useAuth();
  const [printProducts, setPrintProducts] = useState<PrintProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  const {
    formData,
    isLoading: formLoading,
    handleInputChange,
    handleTemplateSelect,
    handleSizeToggle,
    handleColorToggle,
    submitProduct
  } = useProductForm();

  // Fetch print products on component mount
  useEffect(() => {
    if (user) {
      fetchPrintProducts();
    }
  }, [user]);

  const fetchPrintProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('print_products')
        .select('*')
        .eq('printer_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Printer's products loaded:", data?.length || 0, "products");
      setPrintProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching print products:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos produits."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitProduct();
    if (success) {
      await fetchPrintProducts();
      setActiveTab("products");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Imprimeur</h1>
      
      <PrinterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        printProducts={printProducts}
        isLoading={isLoading || formLoading}
        onRefreshProducts={fetchPrintProducts}
        formData={formData}
        onInputChange={handleInputChange}
        onTemplateSelect={handleTemplateSelect}
        onSizeToggle={handleSizeToggle}
        onColorToggle={handleColorToggle}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PrinterStudio;
