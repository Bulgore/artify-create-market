
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface SliderImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  onRemoveImage: () => void;
}

const SliderImageUpload: React.FC<SliderImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  onRemoveImage
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const newFile = {
            user_id: user.id,
            filename: file.name,
            file_url: e.target?.result as string,
            file_type: file.type,
            file_size: file.size
          };
          
          const { data, error } = await supabase
            .from('media_files')
            .insert([newFile])
            .select()
            .single();

          if (error) throw error;
          
          onImageUploaded(data.file_url);
          
          toast({
            title: "Image uploadée",
            description: `${file.name} a été ajoutée à votre médiathèque.`
          });
        } catch (error: any) {
          console.error('Error uploading file:', error);
          toast({
            variant: "destructive",
            title: "Erreur d'upload",
            description: "Impossible d'uploader l'image.",
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload.",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Aperçu"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            Aucune image sélectionnée
          </p>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
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
          {isUploading ? "Upload en cours..." : "Choisir une image"}
        </Button>
      </div>
    </div>
  );
};

export default SliderImageUpload;
