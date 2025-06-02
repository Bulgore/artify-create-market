
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Image as ImageIcon } from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage
}) => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadMediaFiles();
    }
  }, [isOpen, user]);

  const loadMediaFiles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('media_files')
        .select('*')
        .eq('file_type', 'image/jpeg')
        .or('file_type.eq.image/png,file_type.eq.image/gif,file_type.eq.image/webp');
      
      // Si ce n'est pas un superAdmin, ne montrer que ses fichiers
      if (!isSuperAdmin()) {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setMediaFiles(data || []);
    } catch (error: any) {
      console.error('Error loading media files:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les images.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = mediaFiles.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectImage = (imageUrl: string) => {
    onSelectImage(imageUrl);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choisir une image de la médiathèque</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher une image..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Chargement des images...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucune image trouvée</p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => handleSelectImage(file.file_url)}
                >
                  <img
                    src={file.file_url}
                    alt={file.filename}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Sélectionner
                    </Button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate" title={file.filename}>
                      {file.filename}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibraryModal;
