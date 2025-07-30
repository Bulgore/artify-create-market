import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, RefreshCw, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string | null;
  ip_address?: unknown;
  user_agent?: string | null;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export const SecurityMonitoring: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Type-safe mapping of database results
      const typedEvents: SecurityEvent[] = (data || []).map(event => ({
        ...event,
        severity: ['low', 'medium', 'high', 'critical'].includes(event.severity) 
          ? event.severity as 'low' | 'medium' | 'high' | 'critical'
          : 'medium'
      }));
      
      setEvents(typedEvents);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les événements de sécurité',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatEventMessage = (event: SecurityEvent): string => {
    switch (event.event_type) {
      case 'RATE_LIMIT_EXCEEDED_SECURITY_EVENT':
        return `Limite de tentatives dépassée (${event.details?.attempts_count}/${event.details?.max_attempts})`;
      case 'RATE_LIMIT_BLOCKED_ATTEMPT':
        return `Tentative bloquée par rate limiting`;
      case 'SECURE_PROMOTE_TO_SUPER_ADMIN':
        return `Promotion sécurisée vers super admin: ${event.details?.target_email}`;
      case 'DELETE_USER_ATTEMPT':
        return `Tentative de suppression d'utilisateur`;
      case 'RESET_USER_ACCOUNT':
        return `Réinitialisation de compte: ${event.details?.target_email}`;
      default:
        return event.event_type.replace(/_/g, ' ').toLowerCase();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitoring de Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitoring de Sécurité
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityEvents}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucun événement de sécurité récent</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1">
                  {getSeverityIcon(event.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityColor(event.severity) as any}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {formatEventMessage(event)}
                  </p>
                  {event.ip_address && (
                    <p className="text-xs text-muted-foreground">
                      IP: {String(event.ip_address)}
                    </p>
                  )}
                  {event.details && Object.keys(event.details).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Détails techniques
                      </summary>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded text-muted-foreground">
                        {JSON.stringify(event.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};