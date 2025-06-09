
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tag } from 'lucide-react';

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

interface BasicInfoSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nom/Pseudo *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Votre nom d'artiste ou pseudo"
          required
        />
      </div>

      <div>
        <Label htmlFor="bio">Description de votre univers créatif *</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Décrivez votre style, vos inspirations, ce qui vous passionne..."
          rows={4}
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          Cette description apparaîtra sur votre profil public. Soyez authentique et inspirant !
        </p>
      </div>

      <div>
        <Label htmlFor="keywords">
          <Tag className="h-4 w-4 inline mr-2" />
          Mots-clés / Tags
        </Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="design, illustration, minimaliste, vintage..."
        />
        <p className="text-sm text-muted-foreground mt-1">
          Séparez les mots-clés par des virgules. Ils aideront les clients à vous trouver.
        </p>
      </div>

      <div>
        <Label htmlFor="website_url">Site web personnel (optionnel)</Label>
        <Input
          id="website_url"
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
