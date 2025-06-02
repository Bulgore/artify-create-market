
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash, Search, Image, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadDate: string;
}

const MediaManagement = () => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    loadMediaFiles();
  }, []);

  const loadMediaFiles = () => {
    const saved = localStorage.getItem('media_files');
    if (saved) {
      setMediaFiles(JSON.parse(saved));
    } else {
      // Exemples de fichiers par défaut
      const defaultFiles: MediaFile[] = [
        {
          id: '1',
          name: 'logo.png',
          url: '/placeholder.svg',
          type: 'image/png',
          size: 15420,
          uploadDate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'banner.jpg',
          url: '/placeholder.svg',
          type: 'image/jpeg',
          size: 245680,
          uploadDate: new Date().toISOString()
        }
      ];
      setMediaFiles(defaultFiles);
    }
  };

  const saveMediaFiles = (files: MediaFile[]) => {
    localStorage.setItem('media_files', JSON.stringify(files));
    setMediaFiles(files);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: e.target?.result as string,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString()
        };
        
        const updatedFiles = [...mediaFiles, newFile];
        saveMediaFiles(updatedFiles);
        
        toast({
          title: "Fichier uploadé",
          description: `${file.name} a été ajouté à votre médiathèque.`
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(file => file.id !== fileId);
    saveMediaFiles(updatedFiles);
    
    toast({
      title: "Fichier supprimé",
      description: "Le fichier a été retiré de votre médiathèque."
    });
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
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || file.type.startsWith(selectedType);
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
            Gestionnaire de Médias
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
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
                <Upload className="h-4 w-4 mr-2" />
                Uploader des fichiers
              </Button>
            </div>
          </div>

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
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(file.url)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteFile(file.id)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;
