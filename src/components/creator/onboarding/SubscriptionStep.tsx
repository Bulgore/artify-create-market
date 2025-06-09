
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
        // CORRECTION CRITIQUE : Ne pas activer le premium sans paiement effectif
        toast({
          title: 'Paiement requis',
          description: 'Le niveau Premium nécessite un paiement. Cette fonctionnalité sera bientôt disponible.',
        });
        setIsLoading(false);
        // Continuer avec le niveau débutant pour l'instant
        level = 'debutant';
      }

      // Sauvegarder le niveau choisi (débutant uniquement pour l'instant)
      const { error } = await supabase
        .from('users')
        .update({ creator_level: level })
        .eq('id', user.id);

      if (error) throw error;

      setCurrentLevel(level);
      
      console.log('✅ Subscription level saved:', level);
      
      toast({
        title: 'Choix enregistré !',
        description: `Vous avez choisi le niveau ${level === 'debutant' ? 'Débutant' : 'Premium'}.`,
      });

      // Continuer vers l'étape suivante
      onComplete();

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

  const handleSkipPremium = () => {
    // Directement passer au niveau débutant et continuer
    handleChooseLevel('debutant');
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
          <CardTitle className="text-center">Découvrez le niveau Premium</CardTitle>
          <p className="text-center text-muted-foreground">
            Commencez gratuitement avec le niveau Débutant. Vous pourrez passer au Premium plus tard.
          </p>
        </CardHeader>
      </Card>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plan Débutant */}
        <Card className="relative border-2 border-green-200 bg-green-50">
          <CardHeader>
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <CardTitle>Niveau Débutant</CardTitle>
              <p className="text-2xl font-bold text-green-600">Gratuit</p>
              <p className="text-sm text-muted-foreground">Parfait pour commencer</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Recommandé pour débuter</Badge>
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
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'En cours...' : 'Commencer avec Débutant'}
            </Button>
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className="relative opacity-75">
          <CardHeader>
            <div className="text-center">
              <Crown className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <CardTitle className="flex items-center justify-center gap-2">
                Niveau Premium
                <Badge variant="outline">Bientôt disponible</Badge>
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
              disabled={true}
              variant="outline"
              className="w-full"
            >
              Paiement requis (bientôt disponible)
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Highlight */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pourquoi Premium sera intéressant ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Plus de visibilité</p>
                <p className="text-blue-700">Vos produits apparaîtront en priorité</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Meilleurs revenus</p>
                <p className="text-blue-700">Commission réduite de 20% à 15%</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Crown className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Badge Premium</p>
                <p className="text-blue-700">Inspire confiance aux clients</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center space-y-3">
        <Button
          onClick={handleSkipPremium}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? 'En cours...' : 'Continuer avec le niveau Débutant'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Vous pourrez passer au Premium plus tard dans vos paramètres
        </p>
      </div>
    </div>
  );
};

export default SubscriptionStep;
