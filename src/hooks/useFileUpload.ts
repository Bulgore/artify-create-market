
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
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  const handleFileChange = (file: File | null, type: 'avatar' | 'banner') => {
    if (!file) return;

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
    if (!user) return { avatarUrl: null, bannerUrl: null };

    let avatarUrl = avatarPreview;
    let bannerUrl = bannerPreview;

    // Upload avatar if changed
    if (avatarFile) {
      avatarUrl = await uploadFile(
        avatarFile,
        'avatars',
        `${user.id}/avatar.${avatarFile.name.split('.').pop()}`
      );
    }

    // Upload banner if changed
    if (bannerFile) {
      bannerUrl = await uploadFile(
        bannerFile,
        'banners',
        `${user.id}/banner.${bannerFile.name.split('.').pop()}`
      );
    }

    return { avatarUrl, bannerUrl };
  };

  const loadExistingImages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, banner_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
        if (data.banner_url) setBannerPreview(data.banner_url);
      }
    } catch (error) {
      console.error('Error loading images:', error);
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
