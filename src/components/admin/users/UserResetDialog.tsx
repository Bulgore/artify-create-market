
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Réinitialiser le compte</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir réinitialiser le compte de <strong>{user.full_name || user.email}</strong> ?
            <br /><br />
            Cette action va :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Normaliser les champs multilingues</li>
              <li>Réinitialiser le statut créateur à "draft"</li>
              <li>Remettre le niveau à "débutant"</li>
              <li>Désactiver le profil public</li>
              <li>Remettre à zéro les liens sociaux</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Réinitialiser
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserResetDialog;
