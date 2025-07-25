import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Shield } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  requiresPasswordConfirmation?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userEmail?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  requiresPasswordConfirmation = false,
  severity = 'medium',
  userEmail
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityIcon = () => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className={`h-6 w-6 ${getSeverityColor()}`} />;
    }
    return <Shield className={`h-6 w-6 ${getSeverityColor()}`} />;
  };

  const getRequiredConfirmationText = () => {
    if (severity === 'critical') {
      return userEmail ? `DELETE ${userEmail}` : 'DELETE ACCOUNT';
    }
    return 'CONFIRMER';
  };

  const isConfirmationValid = () => {
    if (severity === 'critical' || severity === 'high') {
      const requiredText = getRequiredConfirmationText();
      if (confirmationText !== requiredText) return false;
    }
    
    if (requiresPasswordConfirmation && !passwordConfirmation) {
      return false;
    }
    
    return true;
  };

  const handleConfirm = () => {
    if (isConfirmationValid()) {
      onConfirm();
      setConfirmationText('');
      setPasswordConfirmation('');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationText('');
      setPasswordConfirmation('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {getSeverityIcon()}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {(severity === 'critical' || severity === 'high') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="confirmationText" className="text-sm font-medium">
                Tapez "{getRequiredConfirmationText()}" pour confirmer:
              </Label>
              <Input
                id="confirmationText"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={getRequiredConfirmationText()}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {requiresPasswordConfirmation && (
          <div>
            <Label htmlFor="passwordConfirmation" className="text-sm font-medium">
              Confirmez votre mot de passe:
            </Label>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Votre mot de passe"
              className="mt-1"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmationValid()}
            className={
              severity === 'critical' ? 'bg-red-600 hover:bg-red-700' :
              severity === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
              'bg-blue-600 hover:bg-blue-700'
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};