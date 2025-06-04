
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

  const generateSignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      console.log('🔗 Generating signed URL for path:', filePath);
      
      const { data, error } = await supabase.storage
        .from('designs')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('❌ Error generating signed URL:', error);
        return null;
      }

      console.log('✅ Signed URL generated:', data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('❌ Exception generating signed URL:', error);
      return null;
    }
  };

  const verifyImageAccess = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🔍 Testing image access for URL:', url);
      
      const testImg = document.createElement('img');
      testImg.crossOrigin = 'anonymous';
      
      testImg.onload = () => {
        console.log('✅ Image accessible:', {
          url,
          naturalWidth: testImg.naturalWidth,
          naturalHeight: testImg.naturalHeight
        });
        resolve(true);
      };
      
      testImg.onerror = (error) => {
        console.error('❌ Image not accessible:', {
          url,
          error: error
        });
        resolve(false);
      };
      
      // Test avec timeout
      setTimeout(() => {
        if (!testImg.complete) {
          console.error('⏰ Image load timeout for:', url);
          resolve(false);
        }
      }, 5000);
      
      testImg.src = url;
    });
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

      console.log('=== DESIGN UPLOAD DEBUG ===');
      console.log('📤 Uploading to bucket: designs');
      console.log('📂 File path:', filePath);
      console.log('📄 File name:', fileName);
      console.log('👤 User ID:', user.id);

      // Upload vers le bucket designs
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload successful:', uploadData);

      // Générer une URL signée pour l'accès
      const signedUrl = await generateSignedUrl(filePath);
      
      if (!signedUrl) {
        throw new Error('Impossible de générer une URL signée');
      }

      // Vérifier que l'image est accessible
      const isAccessible = await verifyImageAccess(signedUrl);
      
      if (!isAccessible) {
        console.error('❌ Image uploaded but not accessible via signed URL');
        toast({
          variant: "destructive",
          title: "Erreur d'accès",
          description: "Le fichier a été uploadé mais n'est pas accessible. Vérifiez les permissions du bucket."
        });
        return;
      }

      // Sauvegarder en DB avec l'URL signée
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: signedUrl,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) {
        console.error('⚠️ DB save error:', dbError);
      }

      console.log('=== UPLOAD SUMMARY ===');
      console.log('📦 Bucket name: designs');
      console.log('📂 Complete file path:', filePath);
      console.log('🔗 Generated signed URL:', signedUrl);
      console.log('✅ Image accessibility: verified');
      console.log('=== END DEBUG ===');

      onDesignUpload(signedUrl);

      toast({
        title: "Design uploadé",
        description: "Votre design a été ajouté avec succès."
      });

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
