
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
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer définitivement le compte de <strong>{user.full_name || user.email}</strong> ?
            <br /><br />
            <span className="text-red-600 font-medium">⚠️ Cette action est irréversible et supprimera :</span>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Le profil utilisateur complet</li>
              <li>Tous les produits créés</li>
              <li>Toutes les données associées</li>
              <li>L'accès au compte</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserDeleteDialog;
