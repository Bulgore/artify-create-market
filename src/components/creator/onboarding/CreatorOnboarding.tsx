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
import ProductsStep from './ProductsStep';
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
      id: 'products',
      name: 'products',
      title: 'Vos premiers produits',
      description: 'Créez au moins 3 produits personnalisés pour validation',
      completed: false
    },
    {
      id: 'subscription',
      name: 'subscription',
      title: 'Abonnement Premium',
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

  const skipOnboarding = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Marquer l'onboarding comme terminé
      const { error } = await supabase
        .from('users')
        .update({ 
          onboarding_completed: true,
          creator_status: 'draft' // Garder en draft jusqu'à ce que le profil soit complété
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Onboarding ignoré',
        description: 'Vous pouvez compléter votre profil plus tard via l\'administration.',
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

  const checkCanSubmitForReview = async () => {
    if (!user) return false;

    try {
      // Vérifier que le profil est complet
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const profileComplete = userData?.full_name && userData?.bio && userData?.avatar_url;

      // Vérifier qu'il y a au moins 3 produits
      const { count, error: countError } = await supabase
        .from('creator_products')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      if (countError) throw countError;

      return profileComplete && (count || 0) >= 3;
    } catch (error) {
      console.error('Error checking submission criteria:', error);
      return false;
    }
  };

  const submitForReview = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const canSubmit = await checkCanSubmitForReview();
      
      if (!canSubmit) {
        toast({
          variant: 'destructive',
          title: 'Critères non remplis',
          description: 'Veuillez compléter votre profil et créer au moins 3 produits.',
        });
        return;
      }

      // Utiliser la fonction SQL pour changer le statut
      const { error } = await supabase.rpc('change_creator_status', {
        creator_id: user.id,
        new_status: 'pending'
      });

      if (error) throw error;

      // Marquer l'onboarding comme terminé
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          onboarding_completed: true,
          submitted_for_review_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: 'Profil soumis !',
        description: 'Votre profil est en cours de validation par notre équipe.',
      });

    } catch (error) {
      console.error('Error submitting for review:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de soumettre votre profil pour validation.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;
  const currentStep = steps[currentStepIndex];

  const renderCurrentStep = () => {
    switch (currentStep.name) {
      case 'profile':
        return <ProfileStep onComplete={() => markStepCompleted('profile')} />;
      case 'products':
        return <ProductsStep onComplete={() => markStepCompleted('products')} />;
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
            <span>Parcours Créateur Podsleek</span>
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
              onClick={submitForReview}
              disabled={isLoading || !steps.every(step => step.completed)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Soumission...' : 'Soumettre pour validation'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboarding;
