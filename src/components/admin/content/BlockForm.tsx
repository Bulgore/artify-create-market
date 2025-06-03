
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import MediaUpload from "./MediaUpload";
import { CreateReusableBlockData } from "@/types/reusableBlocks";

interface BlockFormProps {
  formData: CreateReusableBlockData;
  setFormData: (data: CreateReusableBlockData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const BlockForm: React.FC<BlockFormProps> = ({
  formData,
  setFormData,
  onSave,
  onCancel,
  isEditing
}) => {
  const [useUrlInput, setUseUrlInput] = useState(!!formData.image_url);

  const handleImageSelect = (url: string) => {
    setFormData({ ...formData, image_url: url });
    setUseUrlInput(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Titre du bloc</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre du bloc"
          />
        </div>
        <div>
          <Label htmlFor="type">Type de bloc</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Hero Banner</SelectItem>
              <SelectItem value="banner">Bannière</SelectItem>
              <SelectItem value="slider">Slider</SelectItem>
              <SelectItem value="product-grid">Grille de produits</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="placement">Emplacement</Label>
          <Select value={formData.placement} onValueChange={(value) => setFormData({ ...formData, placement: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner l'emplacement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">En-tête</SelectItem>
              <SelectItem value="main">Contenu principal</SelectItem>
              <SelectItem value="sidebar">Barre latérale</SelectItem>
              <SelectItem value="footer">Pied de page</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="visibility">Visibilité</Label>
          <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner la visibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Privé</SelectItem>
              <SelectItem value="members">Membres uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Image du bloc</Label>
        <div className="mt-2 space-y-4">
          {!useUrlInput ? (
            <div className="space-y-4">
              <MediaUpload 
                onMediaSelect={handleImageSelect}
                accept="image/*"
                fileType="image"
              />
              <div className="text-center">
                <span className="text-sm text-gray-500">ou</span>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setUseUrlInput(true)}
                className="w-full"
              >
                Utiliser une URL
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="URL de l'image"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setUseUrlInput(false);
                  setFormData({ ...formData, image_url: '' });
                }}
                size="sm"
              >
                Uploader un fichier à la place
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="link_url">URL du lien</Label>
          <Input
            id="link_url"
            value={formData.link_url || ''}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="button_text">Texte du bouton</Label>
          <Input
            id="button_text"
            value={formData.button_text || ''}
            onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            placeholder="En savoir plus"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="display_order">Ordre d'affichage</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label>Bloc actif</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={onSave} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </div>
  );
};

export default BlockForm;
