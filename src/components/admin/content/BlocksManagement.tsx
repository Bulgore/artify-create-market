
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { reusableBlocksService } from "@/services/reusableBlocksService";
import { ReusableBlock, CreateReusableBlockData } from "@/types/reusableBlocks";
import BlockForm from "./BlockForm";

const BlocksManagement = () => {
  const [blocks, setBlocks] = useState<ReusableBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ReusableBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const data = await reusableBlocksService.getBlocks();
      setBlocks(data);
    } catch (error) {
      console.error('Error loading blocks:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les blocs"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlock = async (data: CreateReusableBlockData) => {
    try {
      setFormLoading(true);
      await reusableBlocksService.createBlock(data);
      await loadBlocks();
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: "Bloc créé avec succès"
      });
    } catch (error) {
      console.error('Error creating block:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le bloc"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateBlock = async (data: CreateReusableBlockData) => {
    if (!editingBlock) return;

    try {
      setFormLoading(true);
      await reusableBlocksService.updateBlock(editingBlock.id, data);
      await loadBlocks();
      setEditingBlock(null);
      setIsDialogOpen(false);
      toast({
        title: "Succès",
        description: "Bloc modifié avec succès"
      });
    } catch (error) {
      console.error('Error updating block:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le bloc"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bloc ?")) return;

    try {
      await reusableBlocksService.deleteBlock(id);
      await loadBlocks();
      toast({
        title: "Succès",
        description: "Bloc supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting block:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le bloc"
      });
    }
  };

  const handleToggleActive = async (block: ReusableBlock) => {
    try {
      await reusableBlocksService.updateBlock(block.id, {
        is_active: !block.is_active
      });
      await loadBlocks();
      toast({
        title: "Succès",
        description: `Bloc ${block.is_active ? 'désactivé' : 'activé'} avec succès`
      });
    } catch (error) {
      console.error('Error toggling block status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut du bloc"
      });
    }
  };

  const filteredBlocks = blocks.filter(block => {
    if (filter === 'all') return true;
    return block.placement === filter;
  });

  const getPlacementLabel = (placement: string) => {
    const labels = {
      homepage: 'Page d\'accueil',
      footer: 'Pied de page',
      sidebar: 'Barre latérale',
      product_page: 'Page produit',
      global: 'Global'
    };
    return labels[placement as keyof typeof labels] || placement;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      hero: 'Hero Section',
      banner: 'Bannière',
      text: 'Texte',
      image: 'Image',
      slider: 'Slider',
      testimonials: 'Témoignages',
      cta: 'Call to Action'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const openCreateDialog = () => {
    setEditingBlock(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (block: ReusableBlock) => {
    setEditingBlock(block);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Blocs Réutilisables</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]" onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un bloc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBlock ? "Modifier le bloc" : "Créer un nouveau bloc"}
                </DialogTitle>
              </DialogHeader>
              <BlockForm
                block={editingBlock || undefined}
                onSubmit={editingBlock ? handleUpdateBlock : handleCreateBlock}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={formLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtres */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={filter === 'homepage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('homepage')}
            >
              Page d'accueil
            </Button>
            <Button
              variant={filter === 'footer' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('footer')}
            >
              Pied de page
            </Button>
            <Button
              variant={filter === 'sidebar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('sidebar')}
            >
              Sidebar
            </Button>
            <Button
              variant={filter === 'product_page' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('product_page')}
            >
              Page produit
            </Button>
            <Button
              variant={filter === 'global' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('global')}
            >
              Global
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Chargement des blocs...</p>
          </div>
        ) : filteredBlocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun bloc réutilisable trouvé</p>
            <p className="text-sm mt-2">
              {filter === 'all' 
                ? "Créez des blocs pour les réutiliser sur plusieurs pages"
                : `Aucun bloc trouvé pour "${getPlacementLabel(filter)}"`
              }
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead>Visibilité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell className="font-medium">{block.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getTypeLabel(block.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPlacementLabel(block.placement)}</TableCell>
                  <TableCell>{block.display_order}</TableCell>
                  <TableCell>
                    <Badge variant={block.visibility === 'public' ? 'default' : 'outline'}>
                      {block.visibility === 'public' ? 'Public' : 
                       block.visibility === 'authenticated' ? 'Connectés' : 'Invités'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={block.is_active ? 'default' : 'secondary'}>
                      {block.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(block)}
                        title={block.is_active ? "Désactiver" : "Activer"}
                      >
                        {block.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(block)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBlock(block.id)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default BlocksManagement;
