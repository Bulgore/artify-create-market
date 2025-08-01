
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { ProductMockup } from "@/types/templates";
import { buildImageUrl } from "@/utils/imageUrl";

interface SelectedTemplate {
  id: string;
  // Nouveaux champs multilingues
  name_fr: string;
  name_en?: string | null;
  name_ty?: string | null;
  technical_instructions_fr?: string | null;
  technical_instructions_en?: string | null;
  technical_instructions_ty?: string | null;
  // Anciens champs pour compatibilité
  name: string;
  technical_instructions?: string | null;
  type: string;
  primary_mockup_id?: string;
  product_mockups?: ProductMockup[];
  available_positions: string[];
  available_colors: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  base_price: number;
  material: string;
  stock_quantity: number;
  template_id: string | null;
  selectedTemplate: SelectedTemplate | null;
  available_sizes: string[];
  available_colors: string[];
}

export const useProductForm = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    base_price: 0,
    material: "",
    stock_quantity: 0,
    template_id: null,
    selectedTemplate: null,
    available_sizes: [],
    available_colors: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "base_price" || name === "stock_quantity" ? parseFloat(value) || 0 : value
    }));
  };

  const handleTemplateSelect = (templateId: string, template: SelectedTemplate) => {
    console.log("Template selected:", templateId, template);
    // Assurer la compatibilité avec les anciens champs
    const mappedTemplate = {
      ...template,
      name: template.name_fr || template.name || '',
      technical_instructions: template.technical_instructions_fr || template.technical_instructions || ''
    };
    
    setFormData(prev => ({
      ...prev,
      template_id: templateId,
      selectedTemplate: mappedTemplate,
      // Pré-remplir les couleurs disponibles du gabarit
      available_colors: template.available_colors || []
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      available_colors: prev.available_colors.includes(color)
        ? prev.available_colors.filter(c => c !== color)
        : [...prev.available_colors, color]
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.template_id) {
      return "Veuillez sélectionner un gabarit de produit.";
    }

    if (formData.available_sizes.length === 0) {
      return "Veuillez sélectionner au moins une taille.";
    }

    if (formData.available_colors.length === 0) {
      return "Veuillez sélectionner au moins une couleur.";
    }

    if (!formData.name.trim()) {
      return "Veuillez saisir un nom pour le produit.";
    }

    if (formData.base_price <= 0) {
      return "Le prix de base doit être supérieur à 0.";
    }

    return null;
  };

  const submitProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un produit."
      });
      return false;
    }

    const validationError = validateForm();
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: validationError
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const productData = {
        printer_id: user.id,
        template_id: formData.template_id,
        name_fr: formData.name.trim(),
        description_fr: formData.description?.trim() || null,
        base_price: formData.base_price,
        material: formData.material.trim(),
        stock_quantity: formData.stock_quantity,
        print_areas: { width: 20, height: 30, unit: "cm" },
        images: [
          Array.isArray(formData.selectedTemplate?.product_mockups)
            ? buildImageUrl(
                formData.selectedTemplate?.product_mockups.find(
                  m => m.id === formData.selectedTemplate?.primary_mockup_id
                )?.mockup_url
              )
            : "/placeholder.svg"
        ],
        available_sizes: formData.available_sizes,
        available_colors: formData.available_colors
      };
      
      console.log("Submitting print product data:", productData);
      
      const { data, error } = await supabase
        .from('print_products')
        .insert([productData])
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Print product created successfully:", data);
      
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté avec succès à votre catalogue."
      });
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        base_price: 0,
        material: "",
        stock_quantity: 0,
        template_id: null,
        selectedTemplate: null,
        available_sizes: [],
        available_colors: []
      });
      
      return true;
      
    } catch (error: any) {
      console.error("Error adding print product:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du produit."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleTemplateSelect,
    handleSizeToggle,
    handleColorToggle,
    submitProduct
  };
};
