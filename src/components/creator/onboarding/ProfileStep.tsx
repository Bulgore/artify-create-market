
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, User, Image as ImageIcon, Tag } from 'lucide-react';

interface ProfileStepProps {
  onComplete: () => void;
}

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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
        .select('full_name, bio, keywords, website_url, social_links, avatar_url, banner_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Type guard pour social_links
        const socialLinks: SocialLinks = {};
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
        
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
        if (data.banner_url) setBannerPreview(data.banner_url);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
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

      // Update user profile
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
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder votre profil.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.full_name && formData.bio && (avatarPreview || avatarFile);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'avatar')}
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
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'banner')}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés: JPG, PNG. Taille recommandée: 1200x300px
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Nom/Pseudo *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Votre nom d'artiste ou pseudo"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Description de votre univers créatif *</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Décrivez votre style, vos inspirations, ce qui vous passionne..."
            rows={4}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Cette description apparaîtra sur votre profil public. Soyez authentique et inspirant !
          </p>
        </div>

        <div>
          <Label htmlFor="keywords">
            <Tag className="h-4 w-4 inline mr-2" />
            Mots-clés / Tags
          </Label>
          <Input
            id="keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="design, illustration, minimaliste, vintage..."
          />
          <p className="text-sm text-muted-foreground mt-1">
            Séparez les mots-clés par des virgules. Ils aideront les clients à vous trouver.
          </p>
        </div>

        <div>
          <Label htmlFor="website_url">Site web personnel (optionnel)</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://votre-site.com"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Réseaux sociaux (optionnel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.social_links.instagram}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, instagram: e.target.value }
              })}
              placeholder="@votre_compte"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={formData.social_links.twitter}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, twitter: e.target.value }
              })}
              placeholder="@votre_compte"
            />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.social_links.facebook}
              onChange={(e) => setFormData({
                ...formData,
                social_links: { ...formData.social_links, facebook: e.target.value }
              })}
              placeholder="Page Facebook"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder le profil'}
      </Button>
    </form>
  );
};

export default ProfileStep;
