
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useProductForm } from "@/hooks/useProductForm";
import PrinterTabs from "@/components/printer/PrinterTabs";

interface ProductTemplate {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  material: string;
  stock_quantity: number;
  images: string[];
  available_sizes: string[];
  template_id: string | null;
}

const PrinterStudio: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ProductTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  
  const {
    formData,
    isLoading: formLoading,
    handleInputChange,
    handleTemplateSelect,
    handleSizeToggle,
    submitProduct
  } = useProductForm();

  // Fetch templates on component mount
  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tshirt_templates')
        .select('*')
        .eq('printer_id', user?.id);
      
      if (error) throw error;
      
      console.log("Printer's products loaded:", data?.length || 0, "products");
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
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
      await fetchTemplates();
      setActiveTab("products");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Imprimeur</h1>
      
      <PrinterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        templates={templates}
        isLoading={isLoading || formLoading}
        onRefreshTemplates={fetchTemplates}
        formData={formData}
        onInputChange={handleInputChange}
        onTemplateSelect={handleTemplateSelect}
        onSizeToggle={handleSizeToggle}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default PrinterStudio;
