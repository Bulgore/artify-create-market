import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, SkipForward, Settings } from 'lucide-react';
import ProfileStep from './ProfileStep';
import SubscriptionStep from './SubscriptionStep';
import { OnboardingStep } from './OnboardingStep';

const CreatorOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      name: 'profile',
      title: t('onboarding.profile_title', 'Profil créateur'),
      description: t('onboarding.profile_desc', 'Complétez votre profil avec avatar, bannière et description (obligatoire)'),
      completed: false
    },
    {
      id: 'subscription',
      name: 'subscription',
      title: t('onboarding.subscription_title', 'Découverte Premium'),
      description: t('onboarding.subscription_desc', 'Découvrez les avantages du niveau Premium (optionnel)'),
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
      // Vérifier les données de profil essentielles
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name_fr, bio_fr, avatar_url, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Vérifier les étapes d'onboarding sauvegardées
      const { data: stepData, error } = await supabase
        .from('creator_onboarding_steps')
        .select('step_name, completed')
        .eq('creator_id', user.id);

      if (error) throw error;

      const completedSteps = stepData?.map(step => step.step_name) || [];
      
      // Vérifier si le profil est réellement complet
      const hasEssentialData = userData?.full_name_fr && userData?.bio_fr && userData?.avatar_url;
      const profileCompleted = completedSteps.includes('profile') && hasEssentialData;
      
      setSteps(prevSteps => 
        prevSteps.map(step => {
          if (step.name === 'profile') {
            return { ...step, completed: !!profileCompleted }; // Force boolean conversion
          }
          return { ...step, completed: !!completedSteps.includes(step.name) }; // Force boolean conversion
        })
      );

      // Permettre de skipper seulement si le profil est complété
      setCanSkip(!!profileCompleted); // Force boolean conversion

      // Aller à la première étape non complétée
      if (!profileCompleted) {
        setCurrentStepIndex(0);
      } else if (!completedSteps.includes('subscription')) {
        setCurrentStepIndex(1);
      }

      console.log('📊 Onboarding progress loaded:', { 
        profileCompleted, 
        completedSteps,
        hasEssentialData 
      });
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

      console.log('✅ Step completed:', stepName);

      // Si c'est l'étape profil qui vient d'être complétée, permettre de skipper
      if (stepName === 'profile') {
        setCanSkip(true);
      }

      toast({
        title: t('onboarding.step_completed', 'Étape complétée !'),
        description: t('onboarding.progress_message', 'Vous progressez dans votre parcours créateur.'),
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

      console.log('✅ Onboarding completed');

      toast({
        title: t('onboarding.completed_title', 'Profil créé avec succès !'),
        description: t('onboarding.completed_desc', 'Bienvenue dans votre espace créateur. Vous pouvez maintenant créer vos premiers produits.'),
      });

      // Redirection vers le studio/dashboard
      navigate('/studio');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: 'destructive',
        title: t('common.error', 'Erreur'),
        description: t('onboarding.completion_error', 'Impossible de finaliser l\'onboarding.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    if (!user || !canSkip) return;

    try {
      setIsLoading(true);
      
      console.log('⚠️ Skipping onboarding (profile must be completed first)');
      await completeOnboarding();
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast({
        variant: 'destructive',
        title: t('common.error', 'Erreur'),
        description: t('onboarding.skip_error', 'Impossible d\'ignorer l\'onboarding.'),
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
  const profileStepCompleted = steps.find(s => s.name === 'profile')?.completed || false;

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
            <span>{t('onboarding.title', 'Création de votre profil créateur')}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToAdmin}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                {t('nav.admin', 'Administration')}
              </Button>
              {canSkip && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={skipOnboarding}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <SkipForward className="h-4 w-4" />
                  {t('onboarding.skip_to_studio', 'Passer à l\'espace créateur')}
                </Button>
              )}
            </div>
          </CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps.filter(step => step.completed).length} / {steps.length} {t('onboarding.steps_completed', 'étapes complétées')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Avertissement si profil non complété */}
      {!profileStepCompleted && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 mb-2">⚠️ {t('onboarding.required_step', 'Étape obligatoire')}</h3>
            <p className="text-orange-700 text-sm">
              {t('onboarding.profile_required_message', 'Vous devez compléter votre profil (étape 1) pour accéder à votre espace créateur et pouvoir créer des produits.')}
            </p>
          </CardContent>
        </Card>
      )}

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
            {step.name === 'profile' && (
              <span className="text-xs text-red-600 font-medium">{t('common.required', 'Obligatoire')}</span>
            )}
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
          {t('common.previous', 'Précédent')}
        </Button>

        <div className="space-x-2">
          {currentStepIndex < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={currentStep.name === 'profile' && !profileStepCompleted}
            >
              {t('common.next', 'Suivant')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={completeOnboarding}
              disabled={isLoading || !profileStepCompleted}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? t('onboarding.finalizing', 'Finalisation...') : t('onboarding.access_studio', 'Accéder à mon espace créateur')}
            </Button>
          )}
        </div>
      </div>

      {/* Message d'information sur la suite */}
      {profileStepCompleted && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🎉 {t('onboarding.step1_completed', 'Étape 1 complétée !')}</h3>
            <p className="text-blue-700 text-sm mb-3">
              {t('onboarding.profile_completed_message', 'Votre profil créateur est maintenant configuré. Dans votre espace créateur, vous pourrez :')}
            </p>
            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside mb-3">
              <li>{t('onboarding.feature1', 'Créer vos premiers produits personnalisés')}</li>
              <li>{t('onboarding.feature2', 'Gérer vos designs et mockups')}</li>
              <li>{t('onboarding.feature3', 'Suivre vos ventes et statistiques')}</li>
              <li>{t('onboarding.feature4', 'Modifier votre profil à tout moment')}</li>
            </ul>
            <p className="text-blue-700 text-sm font-medium">
              💡 {t('onboarding.visibility_note', 'Pour être visible publiquement, vous devrez créer au moins 3 produits de qualité qui seront validés par notre équipe.')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreatorOnboarding;
