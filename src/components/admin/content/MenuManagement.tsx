
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { contentService } from '@/services/contentService';
import { MenuItem } from '@/types/content';
import { Plus, Edit, Trash2, GripVertical, ExternalLink } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const MenuManagement = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    isExternal: false,
    isActive: true
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const items = contentService.getMenuItems();
    setMenuItems(items.sort((a, b) => a.order - b.order));
  };

  const saveMenuItems = (items: MenuItem[]) => {
    contentService.saveMenuItems(items);
    loadMenuItems();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le titre et l\'URL sont obligatoires.'
      });
      return;
    }

    if (editingItem) {
      // Mise à jour
      const updatedItems = menuItems.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
      saveMenuItems(updatedItems);
      toast({
        title: 'Menu mis à jour',
        description: 'L\'élément de menu a été mis à jour avec succès.'
      });
    } else {
      // Création
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        order: menuItems.length
      };
      saveMenuItems([...menuItems, newItem]);
      toast({
        title: 'Menu créé',
        description: 'Le nouvel élément de menu a été créé avec succès.'
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      isExternal: false,
      isActive: true
    });
    setEditingItem(null);
    setIsCreating(false);
  };

  const editItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      isExternal: item.isExternal,
      isActive: item.isActive
    });
    setIsCreating(true);
  };

  const deleteItem = (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément de menu ?')) return;

    const updatedItems = menuItems.filter(item => item.id !== itemId);
    saveMenuItems(updatedItems);
    toast({
      title: 'Élément supprimé',
      description: 'L\'élément de menu a été supprimé avec succès.'
    });
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = menuItems.findIndex(item => item.id === itemId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === menuItems.length - 1)
    ) return;

    const newItems = [...menuItems];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];
    
    // Mettre à jour les ordres
    newItems.forEach((item, index) => {
      item.order = index;
    });

    saveMenuItems(newItems);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestion du Menu Principal</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Configurez les éléments de navigation de votre site
              </p>
            </div>
            {!isCreating && (
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel élément
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <Card className="mb-6 border-l-4 border-l-[#33C3F0]">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Titre du menu</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Accueil, À propos, Contact..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        placeholder="/about, https://example.com..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isExternal"
                        checked={formData.isExternal}
                        onCheckedChange={(checked) => setFormData({...formData, isExternal: checked})}
                      />
                      <Label htmlFor="isExternal">Lien externe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                      />
                      <Label htmlFor="isActive">Actif</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                      {editingItem ? 'Mettre à jour' : 'Créer'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucun élément de menu configuré</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer votre premier élément de menu
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Card key={item.id} className={`${item.isActive ? 'border-green-200' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.title}</span>
                            {item.isExternal && (
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            )}
                            {!item.isActive && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Inactif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={index === menuItems.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteItem(item.id)}
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
    </div>
  );
};

export default MenuManagement;
