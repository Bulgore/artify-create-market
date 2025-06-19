
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Bell, Eye } from 'lucide-react';

const CreatorSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    default_commission: 15,
    is_public_profile: false,
    email_notifications: true,
    product_notifications: true
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('default_commission, is_public_profile')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setSettings(prev => ({
        ...prev,
        default_commission: data.default_commission || 15,
        is_public_profile: data.is_public_profile || false
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          default_commission: settings.default_commission,
          is_public_profile: settings.is_public_profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres."
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
            <Settings className="h-5 w-5" />
            Paramètres de Compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Commission par défaut (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.default_commission}
                  onChange={(e) => setSettings({
                    ...settings, 
                    default_commission: Number(e.target.value)
                  })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pourcentage de commission sur vos ventes (0-50%)
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <label className="text-sm font-medium">
                    Profil public
                  </label>
                </div>
                <Switch
                  checked={settings.is_public_profile}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    is_public_profile: checked
                  })}
                />
              </div>
              <p className="text-xs text-gray-500">
                Permettre aux visiteurs de voir votre profil et vos créations
              </p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Notifications par email</label>
                <Switch
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    email_notifications: checked
                  })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Notifications de produits</label>
                <Switch
                  checked={settings.product_notifications}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    product_notifications: checked
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t">
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

export default CreatorSettings;
