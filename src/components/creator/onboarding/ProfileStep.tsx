
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import BasicInfoSection from './BasicInfoSection';
import SocialLinksSection from './SocialLinksSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProfileStepProps {
  onComplete: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onComplete }) => {
  const { isLoading, setIsLoading, isLoadingProfile, formData, setFormData, updateProfile } = useProfileForm(onComplete);
  const { 
    avatarPreview, 
    bannerPreview, 
    handleFileChange, 
    uploadFiles, 
    loadExistingImages 
  } = useFileUpload();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadExistingImages();
  }, []);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.full_name_fr || formData.full_name_fr.trim().length < 2) {
      errors.push('Le nom/pseudo en français est obligatoire (minimum 2 caractères)');
    }

    if (!formData.bio_fr || formData.bio_fr.trim().length < 10) {
      errors.push('La description en français est obligatoire (minimum 10 caractères)');
    }

    if (!avatarPreview) {
      errors.push('Une photo de profil est obligatoire');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileChangeWithErrorHandling = (file: File | null, type: 'avatar' | 'banner') => {
    try {
      setUploadError(null);
      handleFileChange(file, type);
    } catch (error) {
      console.error('❌ File handling error:', error);
      setUploadError(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setUploadError(null);
    
    // Validation stricte des champs obligatoires
    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Informations manquantes',
        description: 'Veuillez remplir tous les champs obligatoires.',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔄 Starting profile update process...');
      
      // Upload des fichiers
      const { avatarUrl, bannerUrl } = await uploadFiles();
      console.log('✅ Files uploaded successfully:', { avatarUrl, bannerUrl });
      
      // Vérification que l'avatar a bien été uploadé ou existe déjà
      if (!avatarUrl) {
        throw new Error('L\'avatar est obligatoire et n\'a pas pu être uploadé');
      }

      // Mise à jour du profil
      const success = await updateProfile(avatarUrl, bannerUrl);
      if (success) {
        console.log('✅ Profile updated successfully');
        toast({
          title: 'Profil sauvegardé !',
          description: 'Votre profil créateur a été sauvegardé avec succès.',
        });
        onComplete();
      }
    } catch (error) {
      console.error('❌ Error during profile update:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setUploadError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.full_name_fr && 
           formData.full_name_fr.trim().length >= 2 && 
           formData.bio_fr && 
           formData.bio_fr.trim().length >= 10 && 
           avatarPreview;
  };

  if (isLoadingProfile) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Affichage des erreurs de validation */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Veuillez corriger les erreurs suivantes :</div>
              <ul className="list-disc list-inside text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Affichage des erreurs d'upload */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {uploadError}
          </AlertDescription>
        </Alert>
      )}

      <ImageUploadSection
        avatarPreview={avatarPreview}
        bannerPreview={bannerPreview}
        onFileChange={handleFileChangeWithErrorHandling}
      />

      <BasicInfoSection
        formData={formData}
        setFormData={setFormData}
      />

      <SocialLinksSection
        formData={formData}
        setFormData={setFormData}
      />

      {/* Informations sur les champs obligatoires */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <div className="font-medium">📋 Champs obligatoires :</div>
            <ul className="text-sm space-y-1">
              <li>✓ Photo de profil</li>
              <li>✓ Nom/Pseudo en français (minimum 2 caractères)</li>
              <li>✓ Description de votre univers créatif en français (minimum 10 caractères)</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      <Button
        type="submit"
        disabled={!isFormValid() || isLoading}
        className="w-full"
      >
        {isLoading ? 'Sauvegarde en cours...' : 'Sauvegarder et continuer'}
      </Button>
    </form>
  );
};

export default ProfileStep;
