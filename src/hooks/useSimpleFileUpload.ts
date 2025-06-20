
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSimpleFileUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string = 'mockups'): Promise<string> => {
    if (!file) throw new Error('No file provided');

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      // Pour l'instant, on simule l'upload et on retourne une URL temporaire
      const tempUrl = URL.createObjectURL(file);
      
      // TODO: Implémenter l'upload réel vers Supabase Storage une fois configuré
      console.log('File would be uploaded to:', filePath);
      
      return tempUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: error.message || "Impossible d'uploader le fichier.",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading
  };
};
