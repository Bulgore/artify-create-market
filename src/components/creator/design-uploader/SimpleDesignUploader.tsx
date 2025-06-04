
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SimpleDesignUploaderProps {
  onDesignUpload: (imageUrl: string) => void;
}

export const SimpleDesignUploader: React.FC<SimpleDesignUploaderProps> = ({
  onDesignUpload
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.match(/^image\/(png|svg\+xml|jpeg|jpg)$/)) {
      toast({
        variant: "destructive",
        title: "Format non supporté",
        description: "Veuillez utiliser un fichier PNG, SVG ou JPEG."
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('📤 Uploading file:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Générer l'URL publique immédiatement
      const { data: urlData } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('✅ Upload successful, URL:', publicUrl);

      // Tester que l'URL fonctionne
      const testImg = document.createElement('img');
      testImg.onload = () => {
        console.log('✅ Image accessible:', publicUrl);
        onDesignUpload(publicUrl);
        toast({
          title: "Design uploadé",
          description: "Votre design a été ajouté avec succès."
        });
      };
      
      testImg.onerror = () => {
        console.error('❌ Image non accessible:', publicUrl);
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: "Le fichier a été uploadé mais n'est pas accessible."
        });
      };
      
      testImg.src = publicUrl;

      // Sauvegarder en DB
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
        console.error('⚠️ DB save error:', dbError);
      }

    } catch (error: any) {
      console.error('❌ Upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier."
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleFileSelect}
        disabled={isUploading}
        className="w-full h-20 border-2 border-dashed"
      >
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span>Upload en cours...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span>Cliquez pour uploader un design</span>
            </>
          )}
        </div>
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/jpg"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
