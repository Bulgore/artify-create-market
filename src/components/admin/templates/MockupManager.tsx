
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductMockups } from '@/hooks/useProductMockups';
import { useSimpleFileUpload } from '@/hooks/useSimpleFileUpload';
import { Upload, Trash, Edit, Eye, Move } from 'lucide-react';
import { MockupPrintAreaEditor } from './MockupPrintAreaEditor';

interface MockupManagerProps {
  templateId: string;
}

export const MockupManager: React.FC<MockupManagerProps> = ({ templateId }) => {
  const { mockups, isLoading, addMockup, updateMockup, deleteMockup } = useProductMockups(templateId);
  const { uploadFile, isUploading } = useSimpleFileUpload();
  const [editingMockup, setEditingMockup] = useState<string | null>(null);
  const [newMockupName, setNewMockupName] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, 'mockups');
      await addMockup({
        product_template_id: templateId,
        mockup_url: url,
        mockup_name: newMockupName || file.name,
        display_order: mockups.length,
        is_primary: mockups.length === 0,
        print_area: null,
        has_print_area: false
      });
      setNewMockupName('');
    } catch (error) {
      console.error('Error uploading mockup:', error);
    }
  };

  const setPrimaryMockup = async (mockupId: string) => {
    // Reset all mockups to non-primary
    await Promise.all(
      mockups.map(mockup => 
        updateMockup(mockup.id, { is_primary: mockup.id === mockupId })
      )
    );
  };

  const reorderMockups = async (mockupId: string, direction: 'up' | 'down') => {
    const mockup = mockups.find(m => m.id === mockupId);
    if (!mockup) return;

    const newOrder = direction === 'up' 
      ? Math.max(0, mockup.display_order - 1)
      : mockup.display_order + 1;

    await updateMockup(mockupId, { display_order: newOrder });
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des mockups...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Mockups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="mockup-name">Nom du mockup</Label>
                <Input
                  id="mockup-name"
                  value={newMockupName}
                  onChange={(e) => setNewMockupName(e.target.value)}
                  placeholder="Vue face, Vue dos, Zoom détail..."
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="mockup-upload"
                />
                <Button
                  asChild
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <label htmlFor="mockup-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Upload...' : 'Ajouter mockup'}
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {mockups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Aucun mockup configuré pour ce produit.</p>
            <p className="text-sm text-gray-400 mt-2">
              Ajoutez des images mockup pour permettre l'aperçu des créations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockups.map((mockup) => (
            <Card key={mockup.id} className={`relative ${mockup.is_primary ? 'ring-2 ring-blue-500' : ''}`}>
              <CardContent className="p-4">
                <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={mockup.mockup_url}
                    alt={mockup.mockup_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-sm truncate" title={mockup.mockup_name}>
                    {mockup.mockup_name}
                    {mockup.is_primary && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </h3>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Ordre: {mockup.display_order}</span>
                    <span>{mockup.has_print_area ? '✅ Zone définie' : '⚪ Pas de zone'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-3 gap-2">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reorderMockups(mockup.id, 'up')}
                      title="Monter"
                    >
                      <Move className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPrimaryMockup(mockup.id)}
                      title="Définir comme principal"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMockup(mockup.id)}
                      title="Configurer la zone d'impression"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteMockup(mockup.id)}
                      title="Supprimer"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingMockup && (
        <MockupPrintAreaEditor
          mockup={mockups.find(m => m.id === editingMockup)!}
          onClose={() => setEditingMockup(null)}
        />
      )}
    </div>
  );
};
