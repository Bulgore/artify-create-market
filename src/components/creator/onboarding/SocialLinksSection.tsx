
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  full_name: string;
  bio: string;
  keywords: string;
  website_url: string;
  social_links: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}

interface SocialLinksSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Réseaux sociaux (optionnel)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={formData.social_links.instagram}
            onChange={(e) => setFormData({
              ...formData,
              social_links: { ...formData.social_links, instagram: e.target.value }
            })}
            placeholder="@votre_compte"
          />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter/X</Label>
          <Input
            id="twitter"
            value={formData.social_links.twitter}
            onChange={(e) => setFormData({
              ...formData,
              social_links: { ...formData.social_links, twitter: e.target.value }
            })}
            placeholder="@votre_compte"
          />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={formData.social_links.facebook}
            onChange={(e) => setFormData({
              ...formData,
              social_links: { ...formData.social_links, facebook: e.target.value }
            })}
            placeholder="Page Facebook"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialLinksSection;
