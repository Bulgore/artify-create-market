
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { validateImageFile } from '@/utils/inputValidation';

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

  const generateSecureSignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      console.log('🔗 Generating secure signed URL for path:', filePath);
      
      const { data, error } = await supabase.storage
        .from('designs')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('❌ Error generating signed URL:', error);
        return null;
      }

      console.log('✅ Secure signed URL generated:', data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('❌ Exception generating signed URL:', error);
      return null;
    }
  };

  const verifyImageAccess = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🔍 Testing secure image access for URL:', url);
      
      const testImg = document.createElement('img');
      testImg.crossOrigin = 'anonymous';
      
      testImg.onload = () => {
        console.log('✅ Secure image accessible:', {
          url,
          naturalWidth: testImg.naturalWidth,
          naturalHeight: testImg.naturalHeight
        });
        resolve(true);
      };
      
      testImg.onerror = (error) => {
        console.error('❌ Secure image not accessible:', {
          url,
          error: error
        });
        resolve(false);
      };
      
      setTimeout(() => {
        if (!testImg.complete) {
          console.error('⏰ Secure image load timeout for:', url);
          resolve(false);
        }
      }, 5000);
      
      testImg.src = url;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Enhanced security validation
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

      console.log('=== SECURE DESIGN UPLOAD DEBUG ===');
      console.log('📤 Uploading to bucket: designs');
      console.log('📂 Secure file path:', filePath);
      console.log('📄 Validated file name:', fileName);
      console.log('👤 User ID:', user.id);

      // Upload to the designs bucket with user-specific folder
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Secure upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Secure upload successful:', uploadData);

      // Generate a secure signed URL
      const signedUrl = await generateSecureSignedUrl(filePath);
      
      if (!signedUrl) {
        throw new Error('Impossible de générer une URL sécurisée');
      }

      // Verify secure access
      const isAccessible = await verifyImageAccess(signedUrl);
      
      if (!isAccessible) {
        console.error('❌ Secure image uploaded but not accessible');
        toast({
          variant: "destructive",
          title: "Erreur d'accès sécurisé",
          description: "Le fichier a été uploadé mais n'est pas accessible de manière sécurisée."
        });
        return;
      }

      // Save to DB with secure URL
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
        console.error('⚠️ Secure DB save error:', dbError);
      }

      console.log('=== SECURE UPLOAD SUMMARY ===');
      console.log('📦 Bucket name: designs');
      console.log('📂 Complete secure file path:', filePath);
      console.log('🔗 Generated secure signed URL:', signedUrl);
      console.log('✅ Secure image accessibility: verified');
      console.log('=== END SECURE DEBUG ===');

      onDesignUpload(signedUrl);

      toast({
        title: "Design uploadé de manière sécurisée",
        description: "Votre design a été ajouté avec succès."
      });

    } catch (error: any) {
      console.error('❌ Secure upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'upload sécurisé",
        description: error.message || "Impossible d'uploader le fichier de manière sécurisée."
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
              <span>Upload sécurisé en cours...</span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span>Cliquez pour uploader un design (sécurisé)</span>
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
