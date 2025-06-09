
import React from 'react';
import { MultilingualInput } from '@/components/ui/MultilingualInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface BasicInfoSectionProps {
  formData: {
    full_name_fr: string;
    full_name_en: string;
    full_name_ty: string;
    bio_fr: string;
    bio_en: string;
    bio_ty: string;
    keywords: string;
    website_url: string;
    social_links: {
      instagram: string;
      twitter: string;
      facebook: string;
    };
  };
  setFormData: (data: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, setFormData }) => {
  const { t } = useLanguage();

  const handleMultilingualChange = (field: string, value: { fr?: string; en?: string; ty?: string }) => {
    setFormData({
      ...formData,
      [`${field}_fr`]: value.fr || '',
      [`${field}_en`]: value.en || '',
      [`${field}_ty`]: value.ty || '',
    });
  };

  return (
    <div className="space-y-6">
      <MultilingualInput
        label={t('profile.name', 'Nom/Pseudo')}
        type="input"
        value={{
          fr: formData.full_name_fr,
          en: formData.full_name_en,
          ty: formData.full_name_ty,
        }}
        onChange={(value) => handleMultilingualChange('full_name', value)}
        placeholder={t('profile.name_placeholder', 'Votre nom ou nom d\'artiste')}
        required
      />

      <MultilingualInput
        label={t('profile.bio', 'Description de votre univers créatif')}
        type="textarea"
        value={{
          fr: formData.bio_fr,
          en: formData.bio_en,
          ty: formData.bio_ty,
        }}
        onChange={(value) => handleMultilingualChange('bio', value)}
        placeholder={t('profile.bio_placeholder', 'Décrivez votre style, vos inspirations...')}
        required
        rows={4}
      />

      <div className="space-y-2">
        <Label htmlFor="keywords">
          {t('profile.keywords', 'Mots-clés')} <span className="text-gray-500">({t('common.optional', 'optionnel')})</span>
        </Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder={t('profile.keywords_placeholder', 'street art, nature, polynésie...')}
        />
        <p className="text-sm text-gray-500">
          {t('profile.keywords_help', 'Séparez les mots-clés par des virgules')}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">
          {t('profile.website', 'Site web')} <span className="text-gray-500">({t('common.optional', 'optionnel')})</span>
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          placeholder="https://votre-site.com"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
