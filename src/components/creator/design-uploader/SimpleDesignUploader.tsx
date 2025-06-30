
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { validateImageFile } from '@/utils/inputValidation';
import { buildDesignUrl, checkImageAccess, diagnoseImageUrl } from '@/utils/imageUrl';

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
    // Nettoyer le nom de fichier original
    const cleanName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_') // Remplacer caractères spéciaux par underscore
      .replace(/_{2,}/g, '_') // Supprimer underscores multiples
      .replace(/^_|_$/g, ''); // Supprimer underscores en début/fin
    
    // Extraire l'extension
    const lastDotIndex = cleanName.lastIndexOf('.');
    const name = lastDotIndex > 0 ? cleanName.substring(0, lastDotIndex) : cleanName;
    const extension = lastDotIndex > 0 ? cleanName.substring(lastDotIndex) : '.png';
    
    // Générer un nom unique
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    return `${name}_${timestamp}_${randomSuffix}${extension}`;
  };

  const buildPublicDesignUrl = (filePath: string): string => {
    // Toujours utiliser l'URL publique pour les designs
    const publicUrl = `https://riumhqlxdmsxwsjstqgl.supabase.co/storage/v1/object/public/designs/${filePath}`;
    console.log('✅ [SimpleDesignUploader] URL publique générée:', publicUrl);
    return publicUrl;
  };

  const verifyFileUpload = async (filePath: string): Promise<{ exists: boolean; url: string }> => {
    try {
      console.log('🔍 [SimpleDesignUploader] Vérification de l\'upload:', filePath);
      
      // Vérifier que le fichier existe dans le storage
      const { data, error } = await supabase.storage
        .from('designs')
        .list(filePath.substring(0, filePath.lastIndexOf('/')), {
          search: filePath.substring(filePath.lastIndexOf('/') + 1)
        });

      if (error) {
        console.error('❌ [SimpleDesignUploader] Erreur vérification storage:', error);
        return { exists: false, url: '' };
      }

      const fileExists = data && data.length > 0;
      const publicUrl = buildPublicDesignUrl(filePath);
      
      if (fileExists) {
        // Vérifier l'accessibilité HTTP
        const isAccessible = await checkImageAccess(publicUrl);
        console.log(`${isAccessible ? '✅' : '❌'} [SimpleDesignUploader] Accessibilité HTTP:`, publicUrl);
        
        return { exists: isAccessible, url: publicUrl };
      }
      
      return { exists: false, url: publicUrl };
    } catch (error) {
      console.error('💥 [SimpleDesignUploader] Erreur lors de la vérification:', error);
      return { exists: false, url: buildPublicDesignUrl(filePath) };
    }
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
      // Générer un nom de fichier sûr et unique
      const safeFileName = generateSafeFileName(file.name, user.id);
      let filePath = `${user.id}/${safeFileName}`;

      console.log('=== UPLOAD DESIGN DÉTAILLÉ ===');
      console.log('📤 Fichier original:', file.name);
      console.log('📄 Nom sécurisé:', safeFileName);
      console.log('📂 Chemin complet:', filePath);
      console.log('👤 User ID:', user.id);
      console.log('📊 Taille fichier:', `${(file.size / 1024).toFixed(2)} KB`);
      console.log('🎨 Type MIME:', file.type);

      // Upload vers le bucket designs (public)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false // Ne pas remplacer si existe déjà
        });

      if (uploadError) {
        console.error('❌ [SimpleDesignUploader] Erreur upload:', uploadError);
        
        // Si le fichier existe déjà, essayer avec un nom différent
        if (uploadError.message?.includes('already exists')) {
          const retryFileName = generateSafeFileName(file.name, user.id);
          const retryFilePath = `${user.id}/${retryFileName}`;
          
          console.log('🔄 [SimpleDesignUploader] Retry avec nouveau nom:', retryFilePath);
          
          const { data: retryData, error: retryError } = await supabase.storage
            .from('designs')
            .upload(retryFilePath, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (retryError) {
            throw retryError;
          }
          
          console.log('✅ [SimpleDesignUploader] Upload retry réussi:', retryData);
          filePath = retryFilePath; // Utiliser le nouveau chemin
        } else {
          throw uploadError;
        }
      } else {
        console.log('✅ [SimpleDesignUploader] Upload initial réussi:', uploadData);
      }

      // Vérifier que le fichier est bien uploadé et accessible
      const verification = await verifyFileUpload(filePath);
      
      if (!verification.exists) {
        console.error('❌ [SimpleDesignUploader] Fichier uploadé mais non accessible');
        
        // Diagnostic détaillé
        const diagnostic = await diagnoseImageUrl(verification.url);
        console.log('🔬 [SimpleDesignUploader] Diagnostic:', diagnostic);
        
        toast({
          variant: "destructive",
          title: "Erreur d'accessibilité",
          description: "Le fichier a été uploadé mais n'est pas accessible. " + 
                      (diagnostic.suggestions[0] || "Vérifiez la configuration du bucket.")
        });
        return;
      }

      // Sauvegarder en DB avec l'URL publique
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: verification.url,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) {
        console.error('⚠️ [SimpleDesignUploader] Erreur sauvegarde DB (non bloquante):', dbError);
      } else {
        console.log('✅ [SimpleDesignUploader] Sauvegarde DB réussie');
      }

      console.log('=== RÉSUMÉ UPLOAD RÉUSSI ===');
      console.log('📦 Bucket: designs (public)');
      console.log('📂 Chemin final:', filePath);
      console.log('🔗 URL publique:', verification.url);
      console.log('✅ Accessibilité: vérifiée');
      console.log('💾 Base de données: mise à jour');
      console.log('=== FIN UPLOAD ===');

      onDesignUpload(verification.url);

      toast({
        title: "Design uploadé avec succès",
        description: "Votre design est maintenant accessible et prêt à être utilisé."
      });

    } catch (error: any) {
      console.error('💥 [SimpleDesignUploader] Erreur générale:', error);
      
      let errorMessage = "Impossible d'uploader le fichier.";
      
      if (error.message?.includes('exceeded')) {
        errorMessage = "Fichier trop volumineux. Taille maximum: 5MB.";
      } else if (error.message?.includes('Invalid file type')) {
        errorMessage = "Format de fichier non supporté. Utilisez PNG, JPG ou SVG.";
      } else if (error.message?.includes('storage')) {
        errorMessage = "Erreur de stockage. Réessayez dans quelques instants.";
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
              <span>Upload et vérification en cours...</span>
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
