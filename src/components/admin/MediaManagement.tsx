
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash, Search, Image, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MediaFile {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  user_id: string;
}

const MediaManagement = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadMediaFiles();
    }
  }, [user]);

  const loadMediaFiles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Toujours filtrer par utilisateur actuel, même pour les super admins
      // Dans la médiathèque personnelle
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Loaded media files for user:', user.id, data);
      setMediaFiles(data || []);
    } catch (error: any) {
      console.error('Error loading media files:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les fichiers médias.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        // Save file info to database
        const { error: dbError } = await supabase
          .from('media_files')
          .insert([{
            user_id: user.id,
            filename: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size
          }]);

        if (dbError) throw dbError;

        toast({
          title: "Fichier uploadé",
          description: `${file.name} a été ajouté à votre médiathèque.`
        });

      } catch (error: any) {
        console.error('Error uploading file:', error);
        toast({
          variant: "destructive",
          title: "Erreur d'upload",
          description: `Impossible d'uploader ${file.name}: ${error.message}`,
        });
      }
    });

    await Promise.all(uploadPromises);
    loadMediaFiles();
    
    // Reset input
    event.target.value = '';
  };

  const deleteFile = async (fileId: string, fileName: string) => {
    try {
      const { error } = await supabase
        .from('media_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', user?.id); // Security: only delete own files

      if (error) throw error;
      
      toast({
        title: "Fichier supprimé",
        description: `${fileName} a été retiré de votre médiathèque.`
      });
      
      loadMediaFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le fichier.",
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiée",
      description: "L'URL du fichier a été copiée dans le presse-papiers."
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || file.file_type.startsWith(selectedType);
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <Upload className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ma Médiathèque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des fichiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">Tous les types</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="application">Documents</option>
            </select>
            
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.svg"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                <Upload className="h-4 w-4 mr-2" />
                Uploader des fichiers
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-500">Chargement des fichiers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun fichier trouvé</p>
                  <p className="text-sm">Uploadez vos premiers fichiers pour commencer</p>
                </div>
              ) : (
                filteredFiles.map((file) => (
                  <Card key={file.id} className="group hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {file.file_type.startsWith('image/') ? (
                          <img
                            src={file.file_url}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image load error:', file.file_url);
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          getFileIcon(file.file_type)
                        )}
                        <div className="hidden text-red-500 text-sm">Image non disponible</div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm truncate" title={file.filename}>
                          {file.filename}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(file.file_url)}
                          title="Copier l'URL"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteFile(file.id, file.filename)}
                          title="Supprimer"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;
