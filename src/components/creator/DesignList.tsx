
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Design {
  id: string;
  name: string;
  description?: string;
  preview_url: string;
  is_published: boolean;
  creator_margin_percentage: number;
}

interface DesignListProps {
  designs: Design[];
  onDesignUpdated: () => void;
  onCreateDesign: () => void;
  onEditDesign: (id: string) => void;
}

const DesignList: React.FC<DesignListProps> = ({
  designs,
  onDesignUpdated,
  onCreateDesign,
  onEditDesign
}) => {
  const handlePublishToggle = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('creator_products')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: currentStatus ? "Produit retiré" : "Produit publié",
        description: currentStatus 
          ? "Votre produit a été retiré de la boutique" 
          : "Votre produit est maintenant disponible dans la boutique"
      });
      
      // Refresh products list
      onDesignUpdated();
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du produit."
      });
    }
  };

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Vous n'avez pas encore créé de produits personnalisés.</p>
        <Button 
          className="mt-4 bg-[#33C3F0] hover:bg-[#0FA0CE]"
          onClick={onCreateDesign}
        >
          Créer mon premier produit
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map(design => (
        <Card key={design.id} className="overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={design.preview_url || "/placeholder.svg"} 
              alt={design.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-1">{design.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{design.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#33C3F0]">
                Marge: {design.creator_margin_percentage}%
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                design.is_published 
                  ? "bg-green-100 text-green-700" 
                  : "bg-amber-100 text-amber-700"
              }`}>
                {design.is_published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onEditDesign(design.id)}
            >
              Modifier
            </Button>
            <Button 
              variant={design.is_published ? "outline" : "default"}
              className={design.is_published ? "flex-1" : "flex-1 bg-[#33C3F0] hover:bg-[#0FA0CE]"}
              onClick={() => handlePublishToggle(design.id, design.is_published)}
            >
              {design.is_published ? "Retirer" : "Publier"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DesignList;

