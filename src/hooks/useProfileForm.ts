
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialLinks {
  [key: string]: string;
  instagram: string;
  twitter: string;
  facebook: string;
}

interface FormData {
  full_name_fr: string;
  full_name_en: string;
  full_name_ty: string;
  bio_fr: string;
  bio_en: string;
  bio_ty: string;
  keywords: string;
  website_url: string;
  social_links: SocialLinks;
}

export const useProfileForm = (onComplete: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    full_name_fr: '',
    full_name_en: '',
    full_name_ty: '',
    bio_fr: '',
    bio_en: '',
    bio_ty: '',
    keywords: '',
    website_url: '',
    social_links: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      setIsLoadingProfile(true);
      console.log('🔄 Loading user profile for:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .select('full_name_fr, full_name_en, full_name_ty, bio_fr, bio_en, bio_ty, keywords, website_url, social_links')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      console.log('✅ Profile data loaded:', data);

      if (data) {
        const socialLinks: SocialLinks = {
          instagram: '',
          twitter: '',
          facebook: ''
        };
        
        if (data.social_links && typeof data.social_links === 'object') {
          const links = data.social_links as Record<string, any>;
          socialLinks.instagram = links.instagram || '';
          socialLinks.twitter = links.twitter || '';
          socialLinks.facebook = links.facebook || '';
        }

        setFormData({
          full_name_fr: data.full_name_fr || '',
          full_name_en: data.full_name_en || '',
          full_name_ty: data.full_name_ty || '',
          bio_fr: data.bio_fr || '',
          bio_en: data.bio_en || '',
          bio_ty: data.bio_ty || '',
          keywords: data.keywords?.join(', ') || '',
          website_url: data.website_url || '',
          social_links: socialLinks
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateProfile = async (avatarUrl: string | null, bannerUrl: string | null) => {
    if (!user) return false;

    try {
      console.log('💾 Updating profile...', formData);
      
      // Validation stricte côté backend aussi
      if (!formData.full_name_fr || formData.full_name_fr.trim().length < 2) {
        throw new Error('Le nom/pseudo en français est obligatoire (minimum 2 caractères)');
      }
      
      if (!formData.bio_fr || formData.bio_fr.trim().length < 10) {
        throw new Error('La description en français est obligatoire (minimum 10 caractères)');
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name_fr: formData.full_name_fr.trim(),
          full_name_en: formData.full_name_en?.trim() || null,
          full_name_ty: formData.full_name_ty?.trim() || null,
          bio_fr: formData.bio_fr.trim(),
          bio_en: formData.bio_en?.trim() || null,
          bio_ty: formData.bio_ty?.trim() || null,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          website_url: formData.website_url?.trim() || null,
          social_links: formData.social_links as any,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('✅ Profile updated successfully');

      toast({
        title: 'Profil mis à jour !',
        description: 'Votre profil créateur a été sauvegardé avec succès.',
      });

      return true;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de sauvegarder votre profil.',
      });
      return false;
    }
  };

  return {
    user,
    isLoading,
    setIsLoading,
    isLoadingProfile,
    formData,
    setFormData,
    updateProfile,
    loadUserProfile
  };
};
