
import React, { useState } from "react";
import { ConfirmationDialog } from '../ConfirmationDialog';
import { User } from "@/types/creator";

interface UserDeleteDialogProps {
  user: User;
  onConfirm: (user: User) => void;
  children: React.ReactNode;
}

const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({ user, onConfirm, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    onConfirm(user);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <ConfirmationDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Supprimer le compte"
      description={`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${user.full_name || user.email} ? Cette action est irréversible et supprimera le profil utilisateur complet, tous les produits créés, toutes les données associées et l'accès au compte.`}
      confirmText="Supprimer définitivement"
      cancelText="Annuler"
      onConfirm={handleConfirm}
      severity="critical"
      userEmail={user.email}
      requiresPasswordConfirmation={true}
    />
  );
};

export default UserDeleteDialog;
