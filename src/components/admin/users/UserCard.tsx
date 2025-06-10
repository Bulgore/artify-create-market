
import React from "react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/creator";

interface UserCardProps {
  user: User;
  children: React.ReactNode;
}

const UserCard: React.FC<UserCardProps> = ({ user, children }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'créateur': return 'bg-blue-100 text-blue-800';
      case 'imprimeur': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'Avatar'}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{user.full_name || 'Nom non défini'}</h3>
              <p className="text-sm text-muted-foreground">{user.email || 'Email non défini'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getRoleColor(user.role || 'créateur')}>
              {user.role || 'créateur'}
            </Badge>
            {user.is_super_admin && (
              <Badge variant="destructive">Super Admin</Badge>
            )}
            {user.creator_status && (
              <Badge className={getStatusColor(user.creator_status)}>
                {user.creator_status}
              </Badge>
            )}
            {user.creator_level && (
              <Badge variant="outline">
                {user.creator_level}
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Inscription: {new Date(user.created_at).toLocaleDateString()}</p>
            {user.products_count !== undefined && (
              <p>Produits: {user.products_count}</p>
            )}
            {user.bio && <p className="mt-1">{user.bio}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
