
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, RefreshCw, Trash2 } from "lucide-react";
import { User } from "@/types/creator";

interface UserActionsProps {
  user: User;
  isResetting: boolean;
  onEdit: (user: User) => void;
  onReset: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  isResetting,
  onEdit,
  onReset,
  onDelete
}) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(user)}
        title="Modifier l'utilisateur"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="text-blue-600 hover:text-blue-700"
        disabled={isResetting}
        onClick={() => onReset(user)}
        title="Réinitialiser le compte"
      >
        {isResetting ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => onDelete(user)}
        title="Supprimer l'utilisateur"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserActions;
