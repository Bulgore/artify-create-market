import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validateUserRole } from '@/utils/secureAuth';
import { AlertTriangle, Shield, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SecureAdminGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'superAdmin';
  operation?: string;
}

export const SecureAdminGuard: React.FC<SecureAdminGuardProps> = ({ 
  children, 
  requiredRole = 'admin',
  operation 
}) => {
  const { user } = useAuth();
  const [isValidated, setIsValidated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [sessionPassword, setSessionPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);

  useEffect(() => {
    // Reset validation for sensitive operations
    if (operation && ['DELETE_USER', 'PROMOTE_USER', 'RESET_USER'].includes(operation)) {
      setIsValidated(false);
    }
  }, [operation]);

  const validateSession = async () => {
    if (!user) return false;

    setIsValidating(true);
    setError('');

    try {
      // Check rate limiting
      if (attempts >= 3) {
        const lockoutTime = new Date(Date.now() + 15 * 60 * 1000);
        setLockoutUntil(lockoutTime);
        setError('Trop de tentatives. Veuillez réessayer dans 15 minutes.');
        return false;
      }

      // Validate role
      const hasRole = await validateUserRole(requiredRole);
      if (!hasRole) {
        setError('Permissions insuffisantes pour cette opération.');
        return false;
      }

      // For sensitive operations, require password re-confirmation
      if (operation && ['DELETE_USER', 'PROMOTE_USER'].includes(operation)) {
        if (!sessionPassword) {
          setError('Veuillez confirmer votre mot de passe pour cette opération sensible.');
          return false;
        }
        // Here you would normally re-validate the password with Supabase
        // For now, we'll simulate this check
      }

      setIsValidated(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      setAttempts(prev => prev + 1);
      setError('Erreur de validation de session.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Check if locked out
  if (lockoutUntil && new Date() < lockoutUntil) {
    const timeLeft = Math.ceil((lockoutUntil.getTime() - Date.now()) / 60000);
    return (
      <Alert className="max-w-md mx-auto mt-8">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Compte temporairement bloqué. Réessayez dans {timeLeft} minutes.
        </AlertDescription>
      </Alert>
    );
  }

  // Show validation form for sensitive operations
  if (!isValidated && operation && ['DELETE_USER', 'PROMOTE_USER', 'RESET_USER'].includes(operation)) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">Confirmation de sécurité</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Cette opération nécessite une confirmation supplémentaire.
        </p>

        {error && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionPassword">Confirmez votre mot de passe</Label>
            <Input
              id="sessionPassword"
              type="password"
              value={sessionPassword}
              onChange={(e) => setSessionPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>

          <Button 
            onClick={validateSession}
            disabled={isValidating || !sessionPassword}
            className="w-full"
          >
            {isValidating ? 'Validation...' : 'Confirmer'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Tentatives restantes: {3 - attempts}
        </p>
      </div>
    );
  }

  // For non-sensitive operations, just validate role
  if (!isValidated) {
    validateSession();
  }

  return isValidated ? <>{children}</> : null;
};