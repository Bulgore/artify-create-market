
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Image as ImageIcon } from 'lucide-react';

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
  return (
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
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] || null, 'avatar')}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Formats acceptés: JPG, PNG. Taille recommandée: 200x200px
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
                className="w-full h-20 rounded object-cover"
              />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] || null, 'banner')}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Formats acceptés: JPG, PNG. Taille recommandée: 1200x300px
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadSection;
