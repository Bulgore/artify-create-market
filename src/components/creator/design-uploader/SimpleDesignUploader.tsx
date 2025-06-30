
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { validateImageFile } from '@/utils/inputValidation';
import { buildStorageUrl } from '@/utils/imageUrl';

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

  const generateSafeFileName = (originalName: string, userId: string): string => {
    const cleanName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
    
    const lastDotIndex = cleanName.lastIndexOf('.');
    const name = lastDotIndex > 0 ? cleanName.substring(0, lastDotIndex) : cleanName;
    const extension = lastDotIndex > 0 ? cleanName.substring(lastDotIndex) : '.png';
    
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    return `${name}_${timestamp}_${randomSuffix}${extension}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        variant: "destructive",
        title: "Fichier invalide",
        description: validation.error
      });
      return;
    }

    setIsUploading(true);

    try {
      const safeFileName = generateSafeFileName(file.name, user.id);
      const filePath = `${user.id}/${safeFileName}`;

      console.log('=== UPLOAD DESIGN ===');
      console.log('📤 Fichier:', file.name);
      console.log('📂 Chemin:', filePath);
      console.log('👤 User:', user.id);

      // Upload vers le bucket designs
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Erreur upload:', uploadError);
        
        if (uploadError.message?.includes('already exists')) {
          const retryFileName = generateSafeFileName(file.name, user.id);
          const retryFilePath = `${user.id}/${retryFileName}`;
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('designs')
            .upload(retryFilePath, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (retryError) {
            throw retryError;
          }
          
          console.log('✅ Upload retry réussi');
          
          // Construire l'URL publique
          const publicUrl = buildStorageUrl('designs', retryFilePath);
          console.log('🔗 URL publique:', publicUrl);
          
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
            console.warn('⚠️ Erreur DB (non bloquante):', dbError);
          }

          onDesignUpload(publicUrl);
          
          toast({
            title: "Design uploadé avec succès",
            description: "Votre design est maintenant disponible."
          });
          
          return;
        } else {
          throw uploadError;
        }
      }

      console.log('✅ Upload initial réussi');
      
      // Construire l'URL publique
      const publicUrl = buildStorageUrl('designs', filePath);
      console.log('🔗 URL publique:', publicUrl);

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
        console.warn('⚠️ Erreur DB (non bloquante):', dbError);
      }

      console.log('=== UPLOAD TERMINÉ ===');

      onDesignUpload(publicUrl);

      toast({
        title: "Design uploadé avec succès",
        description: "Votre design est maintenant disponible."
      });

    } catch (error: any) {
      console.error('💥 Erreur générale:', error);
      
      let errorMessage = "Impossible d'uploader le fichier.";
      
      if (error.message?.includes('exceeded')) {
        errorMessage = "Fichier trop volumineux. Taille maximum: 5MB.";
      } else if (error.message?.includes('Invalid file type')) {
        errorMessage = "Format de fichier non supporté. Utilisez PNG, JPG ou SVG.";
      }
      
      toast({
        variant: "destructive",
        title: "Erreur d'upload",
        description: errorMessage
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
              <span className="text-xs text-gray-500">PNG, JPG, SVG - Max 5MB</span>
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
