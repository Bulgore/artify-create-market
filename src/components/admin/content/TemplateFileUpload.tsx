
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, FileImage, Code } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';

interface TemplateFileUploadProps {
  label: string;
  accept: string;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  fileType: 'svg' | 'image';
}

const TemplateFileUpload: React.FC<TemplateFileUploadProps> = ({
  label,
  accept,
  currentUrl,
  onUrlChange,
  fileType
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const newFile = {
            user_id: user.id,
            filename: file.name,
            file_url: e.target?.result as string,
            file_type: file.type,
            file_size: file.size
          };
          
          const { data, error } = await supabase
            .from('media_files')
            .insert([newFile])
            .select()
            .single();

          if (error) throw error;
          
          onUrlChange(data.file_url);
          
          toast({
            title: "Fichier uploadé",
            description: `${file.name} a été ajouté à votre médiathèque.`
          });
        } catch (error: any) {
          console.error('Error uploading file:', error);
          toast({
            variant: "destructive",
            title: "Erreur d'upload",
            description: "Impossible d'uploader le fichier.",
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
      });
      setIsUploading(false);
    }
  };

  const handleSelectFromLibrary = (imageUrl: string) => {
    onUrlChange(imageUrl);
  };

  const handleRemoveFile = () => {
    onUrlChange('');
  };

  const getFileIcon = () => {
    return fileType === 'svg' ? <Code className="h-8 w-8 text-blue-500" /> : <FileImage className="h-8 w-8 text-green-500" />;
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <div className="relative border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Fichier actuel :</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            {getFileIcon()}
            <div className="flex-1">
              <p className="text-sm text-gray-600 truncate">{currentUrl.split('/').pop()}</p>
              <p className="text-xs text-gray-400">Fichier hébergé</p>
            </div>
          </div>
          
          {fileType === 'image' && (
            <img
              src={currentUrl}
              alt="Aperçu"
              className="w-full h-32 object-cover rounded border"
            />
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {getFileIcon()}
          <p className="text-sm text-gray-600 mb-4 mt-2">
            Aucun fichier sélectionné
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Upload..." : "Uploader"}
          </Button>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMediaLibraryOpen(true)}
          className="w-full"
        >
          <FileImage className="h-4 w-4 mr-2" />
          Médiathèque
        </Button>
        
        <Input
          placeholder="Ou URL directe..."
          value={currentUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={handleSelectFromLibrary}
      />
    </div>
  );
};

export default TemplateFileUpload;
