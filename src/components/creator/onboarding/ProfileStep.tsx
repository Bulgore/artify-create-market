
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useFileUpload } from '@/hooks/useFileUpload';
import ImageUploadSection from './ImageUploadSection';
import BasicInfoSection from './BasicInfoSection';
import SocialLinksSection from './SocialLinksSection';

interface ProfileStepProps {
  onComplete: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onComplete }) => {
  const { isLoading, setIsLoading, formData, setFormData, updateProfile } = useProfileForm(onComplete);
  const { 
    avatarPreview, 
    bannerPreview, 
    handleFileChange, 
    uploadFiles, 
    loadExistingImages 
  } = useFileUpload();

  useEffect(() => {
    loadExistingImages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const { avatarUrl, bannerUrl } = await uploadFiles();
      await updateProfile(avatarUrl, bannerUrl);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.full_name && formData.bio && avatarPreview;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Sauvegarde...' : 'Sauvegarder le profil'}
      </Button>
    </form>
  );
};

export default ProfileStep;
