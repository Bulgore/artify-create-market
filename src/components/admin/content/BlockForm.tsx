
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { reusableBlocksService } from '@/services/reusableBlocksService';
import { ReusableBlock, CreateReusableBlockData } from '@/types/reusableBlocks';
import { ArrowLeft, Save } from 'lucide-react';

interface BlockFormProps {
  block?: ReusableBlock;
  onSave: () => void;
  onCancel: () => void;
}

const BlockForm: React.FC<BlockFormProps> = ({ block, onSave, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateReusableBlockData>({
    title: '',
    type: 'text',
    content: {},
    placement: 'homepage',
    display_order: 1,
    is_active: true,
    visibility: 'public'
  });

  useEffect(() => {
    if (block) {
      setFormData({
        title: block.title,
        type: block.type,
        content: block.content,
        image_url: block.image_url,
        link_url: block.link_url,
        button_text: block.button_text,
        placement: block.placement,
        display_order: block.display_order,
        is_active: block.is_active,
        visibility: block.visibility
      });
    }
  }, [block]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (block) {
        await reusableBlocksService.updateBlock(block.id, formData);
        toast({
          title: 'Bloc mis à jour',
          description: 'Le bloc a été mis à jour avec succès.'
        });
      } else {
        await reusableBlocksService.createBlock(formData);
        toast({
          title: 'Bloc créé',
          description: 'Le bloc a été créé avec succès.'
        });
      }
      onSave();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder le bloc.'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="subtitle">Sous-titre</Label>
              <Input
                id="subtitle"
                value={formData.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
                placeholder="Sous-titre du héros"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
                placeholder="Description du héros"
              />
            </div>
          </div>
        );

      case 'banner':
        return (
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              placeholder="Description de la bannière"
            />
          </div>
        );

      case 'text':
        return (
          <div>
            <Label htmlFor="html">Contenu HTML</Label>
            <Textarea
              id="html"
              value={formData.content.html || ''}
              onChange={(e) => updateContent('html', e.target.value)}
              placeholder="Contenu HTML du bloc"
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        );

      case 'image':
        return (
          <div>
            <Label htmlFor="caption">Légende</Label>
            <Input
              id="caption"
              value={formData.content.caption || ''}
              onChange={(e) => updateContent('caption', e.target.value)}
              placeholder="Légende de l'image"
            />
          </div>
        );

      case 'cta':
        return (
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              placeholder="Description du call-to-action"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {block ? 'Modifier le bloc' : 'Nouveau bloc réutilisable'}
          </CardTitle>
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre du bloc</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du bloc"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type de bloc</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Héro</SelectItem>
                  <SelectItem value="banner">Bannière</SelectItem>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="cta">Call-to-Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placement">Emplacement</Label>
              <Select
                value={formData.placement}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, placement: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Page d'accueil</SelectItem>
                  <SelectItem value="footer">Pied de page</SelectItem>
                  <SelectItem value="sidebar">Barre latérale</SelectItem>
                  <SelectItem value="product_page">Page produit</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="display_order">Ordre d'affichage</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
            <Input
              id="image_url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="button_text">Texte du bouton (optionnel)</Label>
              <Input
                id="button_text"
                value={formData.button_text || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                placeholder="Cliquez ici"
              />
            </div>
            <div>
              <Label htmlFor="link_url">URL du lien (optionnel)</Label>
              <Input
                id="link_url"
                value={formData.link_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                placeholder="/page-de-destination"
              />
            </div>
          </div>

          {renderTypeSpecificFields()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visibility">Visibilité</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, visibility: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="authenticated">Utilisateurs connectés</SelectItem>
                  <SelectItem value="guests">Visiteurs seulement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Bloc actif</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlockForm;
