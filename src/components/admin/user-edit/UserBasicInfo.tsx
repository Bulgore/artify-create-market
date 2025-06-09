
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatorFormData } from '@/types/creator';

interface UserBasicInfoProps {
  formData: CreatorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreatorFormData>>;
}

const UserBasicInfo: React.FC<UserBasicInfoProps> = ({ formData, setFormData }) => {
  return (
    <>
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
    </>
  );
};

export default UserBasicInfo;
