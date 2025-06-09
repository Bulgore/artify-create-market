
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatorFormData, CreatorStatus, CreatorLevel } from '@/types/creator';

interface CreatorFieldsProps {
  formData: CreatorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreatorFormData>>;
  rejectionReason: string;
  setRejectionReason: React.Dispatch<React.SetStateAction<string>>;
}

const CreatorFields: React.FC<CreatorFieldsProps> = ({ 
  formData, 
  setFormData, 
  rejectionReason, 
  setRejectionReason 
}) => {
  if (formData.role !== 'créateur') return null;

  return (
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
  );
};

export default CreatorFields;
