
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Save, Upload } from 'lucide-react';

const CreatorProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name_fr: '',
    bio_fr: '',
    website_url: '',
    avatar_url: '',
    social_links: {}
  });

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name_fr, bio_fr, website_url, avatar_url, social_links')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfileData({
        full_name_fr: data.full_name_fr || '',
        bio_fr: data.bio_fr || '',
        website_url: data.website_url || '',
        avatar_url: data.avatar_url || '',
        social_links: data.social_links || {}
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données du profil."
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name_fr: profileData.full_name_fr,
          bio_fr: profileData.bio_fr,
          website_url: profileData.website_url,
          avatar_url: profileData.avatar_url,
          social_links: profileData.social_links,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le profil."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mon Profil Créateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet</label>
                <Input
                  value={profileData.full_name_fr}
                  onChange={(e) => setProfileData({...profileData, full_name_fr: e.target.value})}
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Site web</label>
                <Input
                  value={profileData.website_url}
                  onChange={(e) => setProfileData({...profileData, website_url: e.target.value})}
                  placeholder="https://votre-site.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL Avatar</label>
                <Input
                  value={profileData.avatar_url}
                  onChange={(e) => setProfileData({...profileData, avatar_url: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Biographie</label>
                <Textarea
                  value={profileData.bio_fr}
                  onChange={(e) => setProfileData({...profileData, bio_fr: e.target.value})}
                  placeholder="Décrivez votre univers créatif..."
                  rows={8}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorProfile;
