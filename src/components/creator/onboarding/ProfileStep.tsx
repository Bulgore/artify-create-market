
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import ImageUploadSection from './ImageUploadSection';
import BasicInfoSection from './BasicInfoSection';
import SocialLinksSection from './SocialLinksSection';

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

  useEffect(() => {
    loadExistingImages();
  }, []);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.full_name || formData.full_name.trim().length < 2) {
      errors.push('Le nom/pseudo est obligatoire (minimum 2 caractères)');
    }

    if (!formData.bio || formData.bio.trim().length < 10) {
      errors.push('La description est obligatoire (minimum 10 caractères)');
    }

    if (!avatarPreview) {
      errors.push('Une photo de profil est obligatoire');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      console.log('🔄 Uploading files and updating profile...');
      const { avatarUrl, bannerUrl } = await uploadFiles();
      
      // Vérification que l'avatar a bien été uploadé
      if (!avatarUrl && !avatarPreview) {
        throw new Error('L\'avatar est obligatoire');
      }

      const success = await updateProfile(avatarUrl, bannerUrl);
      if (success) {
        console.log('✅ Profile updated successfully');
        // Appeler onComplete seulement si la sauvegarde est réussie
        onComplete();
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder votre profil. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.full_name && 
           formData.full_name.trim().length >= 2 && 
           formData.bio && 
           formData.bio.trim().length >= 10 && 
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Veuillez corriger les erreurs suivantes :</h4>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <ImageUploadSection
        avatarPreview={avatarPreview}
        bannerPreview={bannerPreview}
        onFileChange={handleFileChange}
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-800 font-medium mb-2">📋 Champs obligatoires :</h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>✓ Photo de profil</li>
          <li>✓ Nom/Pseudo (minimum 2 caractères)</li>
          <li>✓ Description de votre univers créatif (minimum 10 caractères)</li>
        </ul>
      </div>

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
