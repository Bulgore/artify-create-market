import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock, Eye } from 'lucide-react';

interface SecurityAlert {
  id: string;
  action_type: string;
  created_at: string;
  details: any;
  admin_user_id: string;
}

export const SecurityAlerts: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSuperAdmin()) {
      fetchSecurityAlerts();
    }
  }, [isSuperAdmin]);

  const fetchSecurityAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .in('action_type', [
          'RATE_LIMIT_EXCEEDED',
          'DELETE_USER_ATTEMPT',
          'PROMOTE_TO_SUPER_ADMIN',
          'RESET_USER_ACCOUNT'
        ])
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching security alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertSeverity = (actionType: string) => {
    switch (actionType) {
      case 'RATE_LIMIT_EXCEEDED':
        return 'warning';
      case 'DELETE_USER_ATTEMPT':
      case 'PROMOTE_TO_SUPER_ADMIN':
        return 'critical';
      case 'RESET_USER_ACCOUNT':
        return 'moderate';
      default:
        return 'info';
    }
  };

  const getAlertIcon = (actionType: string) => {
    switch (actionType) {
      case 'RATE_LIMIT_EXCEEDED':
        return <Clock className="h-4 w-4" />;
      case 'DELETE_USER_ATTEMPT':
      case 'PROMOTE_TO_SUPER_ADMIN':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatAlertMessage = (alert: SecurityAlert) => {
    switch (alert.action_type) {
      case 'RATE_LIMIT_EXCEEDED':
        return `Rate limit dépassé pour ${alert.details?.identifier || 'utilisateur inconnu'}`;
      case 'DELETE_USER_ATTEMPT':
        return `Tentative de suppression d'utilisateur: ${alert.details?.target_user_id || 'ID inconnu'}`;
      case 'PROMOTE_TO_SUPER_ADMIN':
        return `Promotion vers super admin: ${alert.details?.target_email || 'email inconnu'}`;
      case 'RESET_USER_ACCOUNT':
        return `Réinitialisation de compte: ${alert.details?.target_email || 'email inconnu'}`;
      default:
        return `Action administrative: ${alert.action_type}`;
    }
  };

  if (!isSuperAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Alertes de sécurité
        </h3>
        <Button onClick={fetchSecurityAlerts} variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {alerts.length === 0 ? (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Aucune alerte de sécurité récente.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} className="border-l-4 border-l-amber-500">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getAlertIcon(alert.action_type)}
                  <div className="space-y-1">
                    <AlertDescription className="font-medium">
                      {formatAlertMessage(alert)}
                    </AlertDescription>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={
                        getAlertSeverity(alert.action_type) === 'critical' ? 'destructive' :
                        getAlertSeverity(alert.action_type) === 'warning' ? 'default' : 'secondary'
                      }>
                        {getAlertSeverity(alert.action_type)}
                      </Badge>
                      <span>{new Date(alert.created_at).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
};