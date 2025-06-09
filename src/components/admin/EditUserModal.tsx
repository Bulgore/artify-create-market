
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
  creator_status?: string;
  creator_level?: string;
  products_count?: number;
  onboarding_completed?: boolean;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

type CreatorStatus = 'draft' | 'pending' | 'approved' | 'rejected';
type CreatorLevel = 'debutant' | 'confirme' | 'premium';

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
    creator_status: (user?.creator_status || 'draft') as CreatorStatus,
    creator_level: (user?.creator_level || 'debutant') as CreatorLevel,
  });
  const [rejectionReason, setRejectionReason] = useState('');

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
        creator_status: (user.creator_status || 'draft') as CreatorStatus,
        creator_level: (user.creator_level || 'debutant') as CreatorLevel,
      });
      setRejectionReason('');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Si le statut change vers 'rejected', utiliser la fonction avec raison
      if (formData.creator_status === 'rejected' && formData.creator_status !== user.creator_status) {
        if (!rejectionReason.trim()) {
          toast({
            variant: 'destructive',
            title: 'Motif requis',
            description: 'Veuillez indiquer la raison du refus.',
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.rpc('change_creator_status', {
          creator_id: user.id,
          new_status: formData.creator_status,
          new_level: formData.creator_level,
          changed_by: (await supabase.auth.getUser()).data.user?.id,
          reason: rejectionReason
        });

        if (error) throw error;
      } else if (formData.creator_status !== user.creator_status) {
        // Utiliser la fonction pour les autres changements de statut
        const { error } = await supabase.rpc('change_creator_status', {
          creator_id: user.id,
          new_status: formData.creator_status,
          new_level: formData.creator_level,
          changed_by: (await supabase.auth.getUser()).data.user?.id
        });

        if (error) throw error;
      } else {
        // Mise à jour normale sans changement de statut
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
            creator_level: formData.creator_level,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
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

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon (en création)';
      case 'pending': return 'En attente de validation';
      case 'approved': return 'Approuvé et publié';
      case 'rejected': return 'Refusé (corrections nécessaires)';
      default: return status;
    }
  };

  const getLevelDisplayName = (level: string) => {
    switch (level) {
      case 'debutant': return 'Débutant';
      case 'confirme': return 'Confirmé';
      case 'premium': return 'Premium';
      default: return level;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user?.full_name || 'cet utilisateur'}
            {user?.role === 'créateur' && (
              <span className="block mt-1 text-sm">
                Produits créés: {user?.products_count || 0} | 
                Onboarding: {user?.onboarding_completed ? 'Terminé' : 'En cours'}
              </span>
            )}
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

          {/* Champs spécifiques aux créateurs */}
          {formData.role === 'créateur' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creator_status" className="text-right">
                  Statut créateur
                </Label>
                <Select 
                  value={formData.creator_status}
                  onValueChange={(value: CreatorStatus) => setFormData({ ...formData, creator_status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="creator_level" className="text-right">
                  Niveau créateur
                </Label>
                <Select 
                  value={formData.creator_level}
                  onValueChange={(value: CreatorLevel) => setFormData({ ...formData, creator_level: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="confirme">Confirmé</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.creator_status === 'rejected' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rejection_reason" className="text-right">
                    Motif du refus
                  </Label>
                  <Textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="col-span-3"
                    placeholder="Expliquez les corrections nécessaires..."
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

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
