
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image, FileText, Film } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MediaUploadProps {
  onMediaSelect: (url: string) => void;
  accept?: string;
  fileType?: 'image' | 'video' | 'document' | 'all';
  bucketName?: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onMediaSelect, 
  accept = "image/*",
  fileType = 'image',
  bucketName = 'designs'
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Film className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);

    try {
      // Générer un nom de fichier unique
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = bucketName === 'designs' ? `${user.id}/${fileName}` : fileName;

      // Upload vers le bucket spécifié
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

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
        console.error('Error saving to database:', dbError);
        // Ne pas faire échouer l'upload si la DB échoue
      }

      toast({
        title: "Fichier uploadé",
        description: "Le fichier a été ajouté à la médiathèque avec succès."
      });

      onMediaSelect(publicUrl);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier."
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Upload depuis votre ordinateur</Label>
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleFileSelect}
            disabled={isUploading}
            className="w-full"
          >
            {getFileIcon()}
            <span className="ml-2">
              {isUploading ? "Upload en cours..." : "Sélectionner un fichier"}
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
