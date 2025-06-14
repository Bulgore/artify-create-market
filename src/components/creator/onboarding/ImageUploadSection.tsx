
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploadSectionProps {
  avatarPreview: string | null;
  bannerPreview: string | null;
  onFileChange: (file: File | null, type: 'avatar' | 'banner') => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  avatarPreview,
  bannerPreview,
  onFileChange
}) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0] || null;
    
    try {
      onFileChange(file, type);
    } catch (error) {
      console.error('❌ Error handling file change:', error);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          La photo de profil est obligatoire. Formats acceptés : JPG, PNG, WebP. Taille maximum : 5MB.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar Upload */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">
              <User className="h-4 w-4 inline mr-2" />
              Photo de profil *
            </Label>
            <div className="space-y-2">
              {avatarPreview && (
                <div className="flex justify-center">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileInput(e, 'avatar')}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG, WebP. Taille recommandée: 200x200px
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Banner Upload */}
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-2 block">
              <ImageIcon className="h-4 w-4 inline mr-2" />
              Bannière de profil
            </Label>
            <div className="space-y-2">
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt="Bannière"
                  className="w-full h-20 rounded object-cover border-2 border-gray-200"
                />
              )}
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFileInput(e, 'banner')}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG, WebP. Taille recommandée: 1200x300px
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageUploadSection;
