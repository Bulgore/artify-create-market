
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, CreatorFormData } from '@/types/creator';
import { useEditUser } from '@/hooks/useEditUser';
import UserBasicInfo from './user-edit/UserBasicInfo';
import CreatorFields from './user-edit/CreatorFields';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState<CreatorFormData>({
    full_name: user?.full_name || '',
    role: user?.role || 'créateur',
    bio: user?.bio || '',
    is_public_profile: user?.is_public_profile || false,
    website_url: user?.website_url || '',
    default_commission: user?.default_commission || 15,
    is_super_admin: user?.is_super_admin || false,
    creator_status: (user?.creator_status || 'draft') as any,
    creator_level: (user?.creator_level || 'debutant') as any,
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const { loading, handleSave } = useEditUser(user, onUserUpdated, onClose);

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
        creator_status: (user.creator_status || 'draft') as any,
        creator_level: (user.creator_level || 'debutant') as any,
      });
      setRejectionReason('');
    }
  }, [user]);

  const onSubmit = () => {
    handleSave(formData, rejectionReason);
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
          <UserBasicInfo formData={formData} setFormData={setFormData} />
          <CreatorFields 
            formData={formData} 
            setFormData={setFormData}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
