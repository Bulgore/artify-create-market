
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DesignUploaderProps {
  onDesignUpload: (imageUrl: string) => void;
  currentDesignUrl?: string;
}

const DesignUploader: React.FC<DesignUploaderProps> = ({
  onDesignUpload,
  currentDesignUrl
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

    console.log('📤 [DesignUploader] Début de l\'upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userId: user.id
    });

    // Vérifier le type de fichier
    if (!file.type.match(/^image\/(png|svg\+xml|jpeg|jpg)$/)) {
      console.error('❌ [DesignUploader] Format non supporté:', file.type);
      toast({
        variant: "destructive",
        title: "Format non supporté",
        description: "Veuillez utiliser un fichier PNG, SVG ou JPEG."
      });
      return;
    }

    setIsUploading(true);

    try {
      // Générer un nom de fichier unique
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('📁 [DesignUploader] Upload vers le bucket designs:', filePath);

      // Upload vers le bucket designs
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ [DesignUploader] Erreur upload storage:', uploadError);
        throw uploadError;
      }

      console.log('✅ [DesignUploader] Upload storage réussi:', uploadData);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('🔗 [DesignUploader] URL publique générée:', publicUrl);

      // Test de l'accessibilité de l'URL
      try {
        const testResponse = await fetch(publicUrl, { method: 'HEAD' });
        console.log('🔍 [DesignUploader] Test accessibilité URL:', {
          status: testResponse.status,
          ok: testResponse.ok,
          url: publicUrl
        });
      } catch (testError) {
        console.warn('⚠️ [DesignUploader] Impossible de tester l\'URL:', testError);
      }

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
        console.error('⚠️ [DesignUploader] Erreur sauvegarde DB (non bloquante):', dbError);
        // Ne pas faire échouer l'upload si la DB échoue
      } else {
        console.log('✅ [DesignUploader] Sauvegarde DB réussie');
      }

      toast({
        title: "Design uploadé",
        description: "Votre design a été ajouté avec succès."
      });

      console.log('🎉 [DesignUploader] Upload terminé, callback avec URL:', publicUrl);
      onDesignUpload(publicUrl);

    } catch (error: any) {
      console.error('💥 [DesignUploader] Erreur générale:', error);
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

  const removeDesign = () => {
    console.log('🗑️ [DesignUploader] Suppression du design');
    onDesignUpload('');
  };

  // Debug de l'état actuel
  useEffect(() => {
    console.log('🎨 [DesignUploader] État actuel:', {
      hasCurrentDesign: !!currentDesignUrl,
      currentDesignUrl: currentDesignUrl?.substring(0, 50) + '...',
      isUploading
    });
  }, [currentDesignUrl, isUploading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Votre design
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentDesignUrl ? (
          <div className="space-y-4">
            <div className="relative border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Design actuel :</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeDesign}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Image className="h-8 w-8 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 truncate">{currentDesignUrl.split('/').pop()}</p>
                  <p className="text-xs text-gray-400">Design uploadé</p>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src={currentDesignUrl}
                  alt="Aperçu du design"
                  className="w-full h-32 object-contain rounded border bg-gray-50"
                  onLoad={() => console.log('✅ [DesignUploader] Image preview chargée')}
                  onError={(e) => console.error('❌ [DesignUploader] Erreur chargement image preview:', e)}
                />
                {/* Debug overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  URL: {currentDesignUrl.substring(0, 40)}...
                </div>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleFileSelect}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Changer le design
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm text-gray-600 mb-4">
                Aucun design sélectionné
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Formats supportés : PNG, SVG, JPEG
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleFileSelect}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Upload en cours..." : "Uploader un design"}
            </Button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/jpg"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default DesignUploader;
