
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, SkipForward, Settings } from 'lucide-react';
import ProfileStep from './ProfileStep';
import SubscriptionStep from './SubscriptionStep';

interface OnboardingStep {
  id: string;
  name: string;
  title: string;
  description: string;
  completed: boolean;
}

const CreatorOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      name: 'profile',
      title: 'Profil créateur',
      description: 'Complétez votre profil avec avatar, bannière et description',
      completed: false
    },
    {
      id: 'subscription',
      name: 'subscription',
      title: 'Découverte Premium',
      description: 'Découvrez les avantages du niveau Premium (optionnel)',
      completed: false
    }
  ]);

  useEffect(() => {
    if (user) {
      loadOnboardingProgress();
    }
  }, [user]);

  const loadOnboardingProgress = async () => {
    if (!user) return;

    try {
      const { data: stepData, error } = await supabase
        .from('creator_onboarding_steps')
        .select('step_name, completed')
        .eq('creator_id', user.id);

      if (error) throw error;

      const completedSteps = stepData?.map(step => step.step_name) || [];
      
      setSteps(prevSteps => 
        prevSteps.map(step => ({
          ...step,
          completed: completedSteps.includes(step.name)
        }))
      );

      // Trouver la première étape non complétée
      const firstIncompleteIndex = steps.findIndex(step => !completedSteps.includes(step.name));
      if (firstIncompleteIndex !== -1) {
        setCurrentStepIndex(firstIncompleteIndex);
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    }
  };

  const markStepCompleted = async (stepName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('creator_onboarding_steps')
        .upsert({
          creator_id: user.id,
          step_name: stepName,
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.name === stepName ? { ...step, completed: true } : step
        )
      );

      toast({
        title: 'Étape complétée !',
        description: 'Vous progressez dans votre parcours créateur.',
      });
    } catch (error) {
      console.error('Error marking step completed:', error);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Marquer l'onboarding comme terminé
      const { error } = await supabase
        .from('users')
        .update({ 
          onboarding_completed: true,
          creator_status: 'draft' // Statut draft en attendant la création des 3 produits
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil créé avec succès !',
        description: 'Bienvenue dans votre espace créateur. Vous pouvez maintenant créer vos premiers produits.',
      });

      // Redirection vers le studio/dashboard
      navigate('/studio');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de finaliser l\'onboarding.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Marquer l'onboarding comme terminé sans compléter le profil
      const { error } = await supabase
        .from('users')
        .update({ 
          onboarding_completed: true,
          creator_status: 'draft'
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Onboarding ignoré',
        description: 'Vous pouvez compléter votre profil plus tard via votre espace créateur.',
      });

      navigate('/studio');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'ignorer l\'onboarding.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;
  const currentStep = steps[currentStepIndex];
  const allStepsCompleted = steps.every(step => step.completed);

  const renderCurrentStep = () => {
    switch (currentStep.name) {
      case 'profile':
        return <ProfileStep onComplete={() => markStepCompleted('profile')} />;
      case 'subscription':
        return <SubscriptionStep onComplete={() => markStepCompleted('subscription')} />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-between">
            <span>Création de votre profil créateur</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToAdmin}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Administration
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={skipOnboarding}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <SkipForward className="h-4 w-4" />
                Ignorer
              </Button>
            </div>
          </CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps.filter(step => step.completed).length} / {steps.length} étapes complétées</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation des étapes */}
      <div className="flex justify-center space-x-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center space-y-2 cursor-pointer ${
              index === currentStepIndex ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setCurrentStepIndex(index)}
          >
            {step.completed ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Circle className={`h-8 w-8 ${index === currentStepIndex ? 'text-primary' : ''}`} />
            )}
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Contenu de l'étape actuelle */}
      <Card>
        <CardHeader>
          <CardTitle>{currentStep.title}</CardTitle>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>

        <div className="space-x-2">
          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              disabled={isLoading || !allStepsCompleted}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Finalisation...' : 'Accéder à mon espace créateur'}
            </Button>
          )}
        </div>
      </div>

      {/* Message d'information sur la suite */}
      {allStepsCompleted && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🎉 Félicitations !</h3>
            <p className="text-blue-700 text-sm mb-3">
              Votre profil créateur est maintenant configuré. Dans votre espace créateur, vous pourrez :
            </p>
            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside mb-3">
              <li>Créer vos premiers produits personnalisés</li>
              <li>Gérer vos designs et mockups</li>
              <li>Suivre vos ventes et statistiques</li>
              <li>Modifier votre profil à tout moment</li>
            </ul>
            <p className="text-blue-700 text-sm font-medium">
              💡 Pour être visible publiquement, vous devrez créer au moins 3 produits de qualité qui seront validés par notre équipe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatorOnboarding;
