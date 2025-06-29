
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { validateImageFile } from '@/utils/inputValidation';
import { buildDesignUrl } from '@/utils/imageUrl';

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

  const buildPublicDesignUrl = (filePath: string): string => {
    // Toujours utiliser l'URL publique pour les designs
    const publicUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co/storage/v1/object/public/designs/${filePath}`;
    console.log('✅ URL publique générée pour le design:', publicUrl);
    return publicUrl;
  };

  const verifyImageAccess = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🔍 Test accès image publique:', url);
      
      const testImg = document.createElement('img');
      testImg.crossOrigin = 'anonymous';
      
      testImg.onload = () => {
        console.log('✅ Image publique accessible:', {
          url,
          naturalWidth: testImg.naturalWidth,
          naturalHeight: testImg.naturalHeight
        });
        resolve(true);
      };
      
      testImg.onerror = (error) => {
        console.error('❌ Image publique non accessible:', {
          url,
          error: error
        });
        resolve(false);
      };
      
      setTimeout(() => {
        if (!testImg.complete) {
          console.error('⏰ Timeout accès image publique:', url);
          resolve(false);
        }
      }, 5000);
      
      testImg.src = url;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validation de sécurité renforcée
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
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('=== UPLOAD DESIGN PUBLIC DEBUG ===');
      console.log('📤 Upload vers bucket public: designs');
      console.log('📂 Chemin fichier:', filePath);
      console.log('📄 Nom fichier validé:', fileName);
      console.log('👤 User ID:', user.id);

      // Upload vers le bucket designs (public)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Erreur upload public:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload public réussi:', uploadData);

      // Générer l'URL publique (pas de token nécessaire)
      const publicUrl = buildPublicDesignUrl(filePath);

      // Vérifier l'accessibilité publique
      const isAccessible = await verifyImageAccess(publicUrl);
      
      if (!isAccessible) {
        console.error('❌ Image uploadée mais non accessible publiquement');
        toast({
          variant: "destructive",
          title: "Erreur d'accès public",
          description: "Le fichier a été uploadé mais n'est pas accessible publiquement."
        });
        return;
      }

      // Sauvegarder en DB avec l'URL publique
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
        console.error('⚠️ Erreur sauvegarde DB (non bloquante):', dbError);
      }

      console.log('=== RÉSUMÉ UPLOAD PUBLIC ===');
      console.log('📦 Bucket: designs (public)');
      console.log('📂 Chemin complet:', filePath);
      console.log('🔗 URL publique finale:', publicUrl);
      console.log('✅ Accessibilité: vérifiée');
      console.log('=== FIN DEBUG PUBLIC ===');

      onDesignUpload(publicUrl);

      toast({
        title: "Design uploadé",
        description: "Votre design est maintenant accessible publiquement."
      });

    } catch (error: any) {
      console.error('❌ Erreur upload public:', error);
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
              <span>Upload public en cours...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span>Cliquez pour uploader un design (accès public)</span>
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
