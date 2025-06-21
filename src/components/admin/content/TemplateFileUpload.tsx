
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, FileImage, Code } from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import { buildImageUrl } from '@/utils/imageUrl';

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
      const fileExtension = file.name.split('.').pop();
      const fileName = `template-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      console.log(`🔄 Uploading template file: ${fileName}`);

      // Upload vers le bucket templates ou mockups selon le type
      const bucket = fileType === 'image' ? 'mockups' : 'templates';
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('❌ Template upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Template upload successful:', uploadData);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 Template public URL:', publicUrl);

      // Sauvegarder les infos du fichier dans media_files
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) {
        console.error('⚠️ DB save error (non-critical):', dbError);
      }

      onUrlChange(publicUrl);
      
      toast({
        title: "Fichier uploadé",
        description: `${file.name} a été ajouté avec succès.`
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier.",
      });
    } finally {
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
              src={buildImageUrl(currentUrl)}
              alt="Aperçu"
              className="w-full h-32 object-cover rounded border"
              onError={() => console.log('❌ Image preview failed to load:', currentUrl)}
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
