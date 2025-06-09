
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialLinks {
  instagram: string;
  twitter: string;
  facebook: string;
}

interface FormData {
  full_name: string;
  bio: string;
  keywords: string;
  website_url: string;
  social_links: SocialLinks;
}

export const useProfileForm = (onComplete: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    bio: '',
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
      const { data, error } = await supabase
        .from('users')
        .select('full_name, bio, keywords, website_url, social_links')
        .eq('id', user.id)
        .single();

      if (error) throw error;

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
          full_name: data.full_name || '',
          bio: data.bio || '',
          keywords: data.keywords?.join(', ') || '',
          website_url: data.website_url || '',
          social_links: socialLinks
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (avatarUrl: string | null, bannerUrl: string | null) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
          website_url: formData.website_url || null,
          social_links: formData.social_links,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour !',
        description: 'Votre profil créateur a été sauvegardé avec succès.',
      });

      onComplete();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder votre profil.',
      });
      return false;
    }
  };

  return {
    user,
    isLoading,
    setIsLoading,
    formData,
    setFormData,
    updateProfile
  };
};
