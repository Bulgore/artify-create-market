
import React, { useState } from "react";
import { ConfirmationDialog } from '../ConfirmationDialog';
import { User } from "@/types/creator";

interface UserResetDialogProps {
  user: User;
  onConfirm: (user: User) => void;
  children: React.ReactNode;
}

const UserResetDialog: React.FC<UserResetDialogProps> = ({ user, onConfirm, children }) => {
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
      title="Réinitialiser le compte"
      description={`Êtes-vous sûr de vouloir réinitialiser le compte de ${user.full_name || user.email} ? Cette action va normaliser les champs multilingues, réinitialiser le statut créateur à "draft", remettre le niveau à "débutant", désactiver le profil public et remettre à zéro les liens sociaux.`}
      confirmText="Réinitialiser"
      cancelText="Annuler"
      onConfirm={handleConfirm}
      severity="high"
      userEmail={user.email}
    />
  );
};

export default UserResetDialog;
