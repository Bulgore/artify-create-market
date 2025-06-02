
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentBlock } from "@/types/content";
import { PlusCircle, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContentManagement = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = () => {
    const savedBlocks = localStorage.getItem('homepage_blocks');
    if (savedBlocks) {
      setBlocks(JSON.parse(savedBlocks));
    }
  };

  const toggleBlockVisibility = (blockId: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, isActive: !block.isActive } : block
    );
    setBlocks(updatedBlocks);
    localStorage.setItem('homepage_blocks', JSON.stringify(updatedBlocks));
    toast({
      title: "Bloc mis à jour",
      description: "La visibilité du bloc a été modifiée."
    });
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
    localStorage.setItem('homepage_blocks', JSON.stringify(updatedBlocks));
    toast({
      title: "Bloc supprimé",
      description: "Le bloc a été supprimé avec succès."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion du Contenu - Page d'Accueil</CardTitle>
          <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Bloc
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun bloc de contenu trouvé</p>
          ) : (
            blocks.map((block) => (
              <div key={block.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{block.title || `Bloc ${block.type}`}</h3>
                  <p className="text-sm text-gray-500">Type: {block.type} • Ordre: {block.order}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleBlockVisibility(block.id)}
                  >
                    {block.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteBlock(block.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
