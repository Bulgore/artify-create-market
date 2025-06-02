
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FooterColumn {
  id: string;
  title: string;
  links: {
    title: string;
    url: string;
    isExternal: boolean;
  }[];
  order: number;
}

interface FooterSettings {
  columns: FooterColumn[];
  copyrightText: string;
}

const FooterManagement = () => {
  const { toast } = useToast();
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    columns: [],
    copyrightText: "© 2024 Podsleek. Tous droits réservés."
  });
  const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadFooterSettings();
  }, []);

  const loadFooterSettings = () => {
    const saved = localStorage.getItem('footer_settings');
    if (saved) {
      setFooterSettings(JSON.parse(saved));
    } else {
      // Configuration par défaut
      const defaultFooter: FooterSettings = {
        columns: [
          {
            id: '1',
            title: 'Produits',
            links: [
              { title: 'T-shirts', url: '/products', isExternal: false },
              { title: 'Créateurs', url: '/artists', isExternal: false }
            ],
            order: 1
          },
          {
            id: '2',
            title: 'Support',
            links: [
              { title: 'Contact', url: '/contact', isExternal: false },
              { title: 'FAQ', url: '/faq', isExternal: false }
            ],
            order: 2
          }
        ],
        copyrightText: "© 2024 Podsleek. Tous droits réservés."
      };
      setFooterSettings(defaultFooter);
    }
  };

  const saveFooterSettings = (settings: FooterSettings) => {
    localStorage.setItem('footer_settings', JSON.stringify(settings));
    setFooterSettings(settings);
    toast({
      title: "Pied de page mis à jour",
      description: "Les modifications ont été sauvegardées."
    });
  };

  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: Date.now().toString(),
      title: "Nouvelle colonne",
      links: [],
      order: footerSettings.columns.length + 1
    };
    setEditingColumn(newColumn);
    setIsModalOpen(true);
  };

  const editColumn = (column: FooterColumn) => {
    setEditingColumn(column);
    setIsModalOpen(true);
  };

  const deleteColumn = (columnId: string) => {
    const updatedColumns = footerSettings.columns.filter(col => col.id !== columnId);
    saveFooterSettings({ ...footerSettings, columns: updatedColumns });
  };

  const saveColumn = (column: FooterColumn) => {
    let updatedColumns;
    if (footerSettings.columns.find(col => col.id === column.id)) {
      updatedColumns = footerSettings.columns.map(col => 
        col.id === column.id ? column : col
      );
    } else {
      updatedColumns = [...footerSettings.columns, column];
    }
    saveFooterSettings({ ...footerSettings, columns: updatedColumns });
    setIsModalOpen(false);
    setEditingColumn(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion du Pied de Page</CardTitle>
            <Button 
              onClick={addColumn}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une colonne
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {footerSettings.columns.map((column) => (
              <div key={column.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move mt-1" />
                  <div>
                    <h3 className="font-medium">{column.title}</h3>
                    <p className="text-sm text-gray-500">
                      {column.links.length} lien(s)
                    </p>
                    <div className="mt-2 space-y-1">
                      {column.links.map((link, index) => (
                        <div key={index} className="text-xs text-gray-600">
                          • {link.title} → {link.url}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => editColumn(column)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteColumn(column.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Texte de Copyright</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={footerSettings.copyrightText}
              onChange={(e) => setFooterSettings({ 
                ...footerSettings, 
                copyrightText: e.target.value 
              })}
              placeholder="Texte de copyright..."
            />
            <Button 
              onClick={() => saveFooterSettings(footerSettings)}
              className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
            >
              Enregistrer le copyright
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      {isModalOpen && editingColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {footerSettings.columns.find(col => col.id === editingColumn.id) ? "Modifier" : "Créer"} une colonne
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre de la colonne</label>
                <Input
                  value={editingColumn.title}
                  onChange={(e) => setEditingColumn({ 
                    ...editingColumn, 
                    title: e.target.value 
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Liens</label>
                {editingColumn.links.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Titre du lien"
                      value={link.title}
                      onChange={(e) => {
                        const updatedLinks = [...editingColumn.links];
                        updatedLinks[index] = { ...link, title: e.target.value };
                        setEditingColumn({ ...editingColumn, links: updatedLinks });
                      }}
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const updatedLinks = [...editingColumn.links];
                        updatedLinks[index] = { ...link, url: e.target.value };
                        setEditingColumn({ ...editingColumn, links: updatedLinks });
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedLinks = editingColumn.links.filter((_, i) => i !== index);
                        setEditingColumn({ ...editingColumn, links: updatedLinks });
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newLink = { title: "", url: "", isExternal: false };
                    setEditingColumn({ 
                      ...editingColumn, 
                      links: [...editingColumn.links, newLink] 
                    });
                  }}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter un lien
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingColumn(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => saveColumn(editingColumn)}
                className="bg-[#33C3F0] hover:bg-[#0FA0CE]"
              >
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterManagement;
