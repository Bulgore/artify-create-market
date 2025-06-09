
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  full_name: string | null;
  role: string;
  is_super_admin: boolean;
  created_at: string;
  updated_at: string;
  default_commission: number;
  avatar_url: string | null;
  bio: string | null;
  is_public_profile: boolean;
  website_url: string | null;
  social_links: any;
  email?: string;
  is_active?: boolean;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    role: user?.role || 'créateur',
    bio: user?.bio || '',
    is_public_profile: user?.is_public_profile || false,
    website_url: user?.website_url || '',
    default_commission: user?.default_commission || 15,
    is_super_admin: user?.is_super_admin || false,
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        role: user.role || 'créateur',
        bio: user.bio || '',
        is_public_profile: user.is_public_profile || false,
        website_url: user.website_url || '',
        default_commission: user.default_commission || 15,
        is_super_admin: user.is_super_admin || false,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          role: formData.role,
          bio: formData.bio,
          is_public_profile: formData.is_public_profile,
          website_url: formData.website_url,
          default_commission: formData.default_commission,
          is_super_admin: formData.is_super_admin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de mettre à jour l\'utilisateur.',
        });
        return;
      }

      toast({
        title: 'Utilisateur mis à jour',
        description: 'Les informations ont été sauvegardées avec succès.',
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user?.full_name || 'cet utilisateur'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="full_name" className="text-right">
              Nom complet
            </Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Rôle
            </Label>
            <Select 
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="créateur">Créateur</SelectItem>
                <SelectItem value="imprimeur">Imprimeur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="col-span-3"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="website_url" className="text-right">
              Site web
            </Label>
            <Input
              id="website_url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="col-span-3"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="commission" className="text-right">
              Commission (%)
            </Label>
            <Input
              id="commission"
              type="number"
              value={formData.default_commission}
              onChange={(e) => setFormData({ ...formData, default_commission: Number(e.target.value) })}
              className="col-span-3"
              min="0"
              max="100"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public_profile" className="text-right">
              Profil public
            </Label>
            <div className="col-span-3">
              <Switch
                id="public_profile"
                checked={formData.is_public_profile}
                onCheckedChange={(checked) => setFormData({ ...formData, is_public_profile: checked })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="super_admin" className="text-right">
              Super Admin
            </Label>
            <div className="col-span-3">
              <Switch
                id="super_admin"
                checked={formData.is_super_admin}
                onCheckedChange={(checked) => setFormData({ ...formData, is_super_admin: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
