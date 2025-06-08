
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { reusableBlocksService } from '@/services/reusableBlocksService';
import { ReusableBlock } from '@/types/reusableBlocks';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import BlockForm from './BlockForm';

const BlocksManagement = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<ReusableBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ReusableBlock | null>(null);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const data = await reusableBlocksService.getBlocks();
      setBlocks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des blocs:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les blocs.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockStatus = async (blockId: string, currentStatus: boolean) => {
    try {
      await reusableBlocksService.updateBlock(blockId, { is_active: !currentStatus });
      toast({
        title: 'Statut mis à jour',
        description: `Le bloc a été ${!currentStatus ? 'activé' : 'désactivé'}.`
      });
      loadBlocks();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut du bloc.'
      });
    }
  };

  const deleteBlock = async (blockId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) return;

    try {
      await reusableBlocksService.deleteBlock(blockId);
      toast({
        title: 'Bloc supprimé',
        description: 'Le bloc a été supprimé avec succès.'
      });
      loadBlocks();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer le bloc.'
      });
    }
  };

  const handleEdit = (block: ReusableBlock) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingBlock(null);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingBlock(null);
    loadBlocks();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBlock(null);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hero: 'bg-blue-100 text-blue-800',
      banner: 'bg-orange-100 text-orange-800',
      text: 'bg-green-100 text-green-800',
      image: 'bg-purple-100 text-purple-800',
      cta: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getPlacementColor = (placement: string) => {
    const colors: Record<string, string> = {
      homepage: 'bg-blue-100 text-blue-700',
      footer: 'bg-gray-100 text-gray-700',
      sidebar: 'bg-green-100 text-green-700',
      product_page: 'bg-purple-100 text-purple-700',
      global: 'bg-yellow-100 text-yellow-700'
    };
    return colors[placement] || 'bg-gray-100 text-gray-700';
  };

  if (showForm) {
    return (
      <BlockForm
        block={editingBlock || undefined}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#33C3F0]"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des Blocs Réutilisables</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Créez et gérez des blocs de contenu réutilisables pour votre site
            </p>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Bloc
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {blocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun bloc créé pour le moment</p>
            <Button 
              onClick={handleCreate}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer votre premier bloc
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => (
              <Card key={block.id} className="border-l-4 border-l-[#33C3F0]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{block.title}</h3>
                        <Badge className={getTypeColor(block.type)}>
                          {block.type}
                        </Badge>
                        <Badge className={getPlacementColor(block.placement)}>
                          {block.placement}
                        </Badge>
                        {block.is_active ? (
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Inactif
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Ordre d'affichage: {block.display_order} • 
                        Visibilité: {block.visibility} • 
                        Créé le {new Date(block.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBlockStatus(block.id, block.is_active)}
                      >
                        {block.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(block)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlocksManagement;
