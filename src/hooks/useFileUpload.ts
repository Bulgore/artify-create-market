
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useFileUpload = () => {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    try {
      console.log(`🔄 Uploading file to ${bucket}/${path}`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });

      if (error) {
        console.error(`❌ Upload error for ${bucket}:`, error);
        throw error;
      }

      console.log(`✅ File uploaded successfully to ${bucket}:`, data);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      console.log(`📄 Public URL generated:`, publicUrl);
      return publicUrl;
    } catch (error) {
      console.error(`❌ Error in uploadFile for ${bucket}:`, error);
      throw error;
    }
  };

  const handleFileChange = (file: File | null, type: 'avatar' | 'banner') => {
    if (!file) return;

    // Validation des fichiers
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`Le fichier est trop volumineux. Taille maximum : 5MB`);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(e.target?.result as string);
      } else {
        setBannerFile(file);
        setBannerPreview(e.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadFiles = async () => {
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    let avatarUrl = avatarPreview;
    let bannerUrl = bannerPreview;

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const fileExtension = avatarFile.name.split('.').pop();
        const avatarPath = `${user.id}/avatar.${fileExtension}`;
        avatarUrl = await uploadFile(avatarFile, 'avatars', avatarPath);
      }

      // Upload banner if changed
      if (bannerFile) {
        const fileExtension = bannerFile.name.split('.').pop();
        const bannerPath = `${user.id}/banner.${fileExtension}`;
        bannerUrl = await uploadFile(bannerFile, 'banners', bannerPath);
      }

      return { avatarUrl, bannerUrl };
    } catch (error) {
      console.error('❌ Error uploading files:', error);
      throw error;
    }
  };

  const loadExistingImages = async () => {
    if (!user) return;

    try {
      console.log('🔄 Loading existing images for user:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, banner_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error loading images:', error);
        return;
      }

      if (data) {
        if (data.avatar_url) {
          console.log('✅ Loaded existing avatar:', data.avatar_url);
          setAvatarPreview(data.avatar_url);
        }
        if (data.banner_url) {
          console.log('✅ Loaded existing banner:', data.banner_url);
          setBannerPreview(data.banner_url);
        }
      }
    } catch (error) {
      console.error('❌ Error loading images:', error);
    }
  };

  return {
    avatarFile,
    bannerFile,
    avatarPreview,
    bannerPreview,
    handleFileChange,
    uploadFiles,
    loadExistingImages
  };
};
