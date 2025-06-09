
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, TrendingUp, Shield, Zap } from 'lucide-react';

interface SubscriptionStepProps {
  onComplete: () => void;
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<string>('debutant');

  useEffect(() => {
    if (user) {
      loadUserLevel();
    }
  }, [user]);

  const loadUserLevel = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('creator_level')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setCurrentLevel(data.creator_level || 'debutant');
      }
    } catch (error) {
      console.error('Error loading user level:', error);
    }
  };

  const handleChooseLevel = async (level: 'debutant' | 'premium') => {
    if (!user) return;

    setIsLoading(true);
    try {
      if (level === 'premium') {
        // Ici on pourrait intégrer Stripe pour le paiement
        toast({
          title: 'Fonctionnalité à venir',
          description: 'Le système de paiement Premium sera bientôt disponible.',
        });
        setIsLoading(false);
        return;
      }

      // Pour le niveau débutant, on met simplement à jour
      const { error } = await supabase
        .from('users')
        .update({ creator_level: level })
        .eq('id', user.id);

      if (error) throw error;

      setCurrentLevel(level);
      onComplete();

      toast({
        title: 'Choix enregistré !',
        description: `Vous avez choisi le niveau ${level === 'debutant' ? 'Débutant' : 'Premium'}.`,
      });

    } catch (error) {
      console.error('Error updating level:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre choix.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = {
    debutant: [
      'Création de produits illimitée',
      'Commission plateforme standard (20%)',
      'Support communautaire',
      'Outils de base',
      'Profil public standard'
    ],
    premium: [
      'Tous les avantages Débutant',
      'Commission réduite (15%)',
      'Badge Premium visible',
      'Support prioritaire',
      'Outils avancés et analytics',
      'Mise en avant dans les résultats',
      'Accès aux nouvelles fonctionnalités en avant-première'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Choisissez votre niveau créateur</CardTitle>
          <p className="text-center text-muted-foreground">
            Vous pouvez commencer gratuitement et passer au Premium à tout moment
          </p>
        </CardHeader>
      </Card>

      {/* Explanation */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Comment fonctionne Podsleek ?</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Vous créez des designs personnalisés sur nos produits</p>
            <p>• Les clients achètent vos créations</p>
            <p>• Vous recevez une commission sur chaque vente</p>
            <p>• Les produits sont imprimés et expédiés automatiquement</p>
          </div>
          
          <h4 className="font-semibold mt-4 mb-2">Modalités de paiement Premium :</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Paiement mensuel de 19€/mois</p>
            <p>• OU prélèvement automatique sur vos gains (25€/mois)</p>
            <p>• Annulation possible à tout moment</p>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Débutant */}
        <Card className={`relative ${currentLevel === 'debutant' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader>
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <CardTitle>Niveau Débutant</CardTitle>
              <p className="text-2xl font-bold text-green-600">Gratuit</p>
              <p className="text-sm text-muted-foreground">Parfait pour commencer</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.debutant.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handleChooseLevel('debutant')}
              disabled={isLoading}
              variant={currentLevel === 'debutant' ? 'default' : 'outline'}
              className="w-full"
            >
              {currentLevel === 'debutant' ? 'Niveau actuel' : 'Choisir Débutant'}
            </Button>
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className={`relative ${currentLevel === 'premium' ? 'ring-2 ring-orange-500' : ''}`}>
          <CardHeader>
            <div className="text-center">
              <Crown className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <CardTitle className="flex items-center justify-center gap-2">
                Niveau Premium
                <Badge className="bg-orange-100 text-orange-800">Recommandé</Badge>
              </CardTitle>
              <p className="text-2xl font-bold text-orange-600">19€/mois</p>
              <p className="text-sm text-muted-foreground">Ou prélevé sur vos gains</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {features.premium.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <Button
              onClick={() => handleChooseLevel('premium')}
              disabled={isLoading}
              variant={currentLevel === 'premium' ? 'default' : 'outline'}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {currentLevel === 'premium' ? 'Niveau actuel' : 'Passer au Premium'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Highlight */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pourquoi choisir Premium ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800">Plus de visibilité</p>
                <p className="text-orange-700">Vos produits apparaissent en priorité</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800">Meilleurs revenus</p>
                <p className="text-orange-700">Commission réduite de 20% à 15%</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800">Badge Premium</p>
                <p className="text-orange-700">Inspire confiance aux clients</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={onComplete}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          Continuer avec mon choix
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Vous pourrez modifier ce choix plus tard dans vos paramètres
        </p>
      </div>
    </div>
  );
};

export default SubscriptionStep;
