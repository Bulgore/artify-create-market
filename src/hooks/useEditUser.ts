
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreatorFormData, User } from '@/types/creator';

export const useEditUser = (user: User | null, onSave: () => void, onClose: () => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = async (formData: CreatorFormData, rejectionReason: string) => {
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

  return { loading, handleSave };
};
