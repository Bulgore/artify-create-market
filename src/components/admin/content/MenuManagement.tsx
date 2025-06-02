
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuItem } from "@/types/content";
import { PlusCircle, Edit, Trash, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MenuManagement = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = () => {
    const savedItems = localStorage.getItem('header_menu');
    if (savedItems) {
      setMenuItems(JSON.parse(savedItems));
    } else {
      // Menu par défaut
      const defaultMenu: MenuItem[] = [
        { id: '1', title: 'Accueil', url: '/', order: 1, isExternal: false, isActive: true },
        { id: '2', title: 'Produits', url: '/products', order: 2, isExternal: false, isActive: true },
        { id: '3', title: 'Créateurs', url: '/artists', order: 3, isExternal: false, isActive: true },
        { id: '4', title: 'Imprimeurs', url: '/printers', order: 4, isExternal: false, isActive: true }
      ];
      setMenuItems(defaultMenu);
      localStorage.setItem('header_menu', JSON.stringify(defaultMenu));
    }
  };

  const saveMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem('header_menu', JSON.stringify(items));
    toast({
      title: "Menu mis à jour",
      description: "Les modifications ont été sauvegardées."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion du Menu Principal</CardTitle>
          <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un lien
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.url}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuManagement;
