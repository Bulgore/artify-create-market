import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreateReusableBlockData, ReusableBlock } from "@/types/reusableBlocks";
import SliderImageUpload from "./SliderImageUpload";
import MediaLibraryModal from "./MediaLibraryModal";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

const blockSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  type: z.enum(['hero', 'banner', 'text', 'image', 'slider', 'testimonials', 'cta']),
  content: z.any().default({}),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  button_text: z.string().optional(),
  placement: z.enum(['homepage', 'footer', 'sidebar', 'product_page', 'global']),
  display_order: z.number().min(0),
  is_active: z.boolean(),
  visibility: z.enum(['public', 'authenticated', 'guests'])
});

interface BlockFormProps {
  block?: ReusableBlock;
  onSubmit: (data: CreateReusableBlockData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface SlideData {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
}

const BlockForm: React.FC<BlockFormProps> = ({ block, onSubmit, onCancel, isLoading }) => {
  const [slides, setSlides] = useState<SlideData[]>(
    block?.content?.slides || [{ id: '1', title: '', description: '', image: '', link: '' }]
  );
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number | null>(null);

  const form = useForm<CreateReusableBlockData>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      title: block?.title || "",
      type: block?.type || "text",
      content: block?.content || { text: "" },
      image_url: block?.image_url || "",
      link_url: block?.link_url || "",
      button_text: block?.button_text || "",
      placement: block?.placement || "homepage",
      display_order: block?.display_order || 0,
      is_active: block?.is_active ?? true,
      visibility: block?.visibility || "public"
    }
  });

  const handleSubmit = async (data: CreateReusableBlockData) => {
    // Traiter le contenu selon le type
    let processedContent = data.content;
    const formData = form.watch();
    
    if (formData.type === 'text') {
      processedContent = { text: form.watch('content.text') || '' };
    } else if (formData.type === 'banner') {
      processedContent = { 
        text: form.watch('content.text') || '',
        backgroundColor: form.watch('content.backgroundColor') || '#f8f9fa'
      };
    } else if (formData.type === 'slider') {
      processedContent = {
        slides: slides,
        autoPlay: form.watch('content.autoPlay') ?? true,
        showDots: form.watch('content.showDots') ?? true,
        duration: form.watch('content.duration') || 5000
      };
    }

    await onSubmit({
      ...data,
      content: processedContent
    });
  };

  const selectedType = form.watch('type');

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      link: ''
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (index: number) => {
    if (slides.length > 1) {
      setSlides(slides.filter((_, i) => i !== index));
    }
  };

  const updateSlide = (index: number, field: keyof SlideData, value: string) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setSlides(updatedSlides);
  };

  const handleImageUploaded = (imageUrl: string, slideIndex: number) => {
    updateSlide(slideIndex, 'image', imageUrl);
  };

  const handleRemoveSlideImage = (slideIndex: number) => {
    updateSlide(slideIndex, 'image', '');
  };

  const handleSelectFromLibrary = (slideIndex: number) => {
    setCurrentSlideIndex(slideIndex);
    setIsMediaLibraryOpen(true);
  };

  const handleMediaLibrarySelect = (imageUrl: string) => {
    if (currentSlideIndex !== null) {
      updateSlide(currentSlideIndex, 'image', imageUrl);
    }
    setCurrentSlideIndex(null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du bloc</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du bloc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de bloc</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hero">Hero Section</SelectItem>
                      <SelectItem value="banner">Bannière</SelectItem>
                      <SelectItem value="text">Texte</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="slider">Slider</SelectItem>
                      <SelectItem value="testimonials">Témoignages</SelectItem>
                      <SelectItem value="cta">Call to Action</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="placement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emplacement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir l'emplacement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homepage">Page d'accueil</SelectItem>
                      <SelectItem value="footer">Pied de page</SelectItem>
                      <SelectItem value="sidebar">Barre latérale</SelectItem>
                      <SelectItem value="product_page">Page produit</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibilité</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la visibilité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="authenticated">Utilisateurs connectés</SelectItem>
                      <SelectItem value="guests">Invités uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordre d'affichage</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contenu dynamique selon le type */}
          {selectedType === 'text' && (
            <FormField
              control={form.control}
              name="content.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu texte</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Saisissez le contenu..." 
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedType === 'banner' && (
            <>
              <FormField
                control={form.control}
                name="content.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte de la bannière</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Texte de la bannière..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content.backgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur de fond</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {selectedType === 'slider' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Configuration du slider</h3>
                <Button type="button" onClick={addSlide} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une slide
                </Button>
              </div>

              {slides.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Slide {index + 1}</h4>
                    {slides.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSlide(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Titre</label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateSlide(index, 'title', e.target.value)}
                        placeholder="Titre de la slide"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lien (optionnel)</label>
                      <Input
                        value={slide.link || ''}
                        onChange={(e) => updateSlide(index, 'link', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description (optionnelle)</label>
                    <Textarea
                      value={slide.description || ''}
                      onChange={(e) => updateSlide(index, 'description', e.target.value)}
                      placeholder="Description de la slide"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
                    <div className="space-y-2">
                      <SliderImageUpload
                        currentImageUrl={slide.image}
                        onImageUploaded={(url) => handleImageUploaded(url, index)}
                        onRemoveImage={() => handleRemoveSlideImage(index)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectFromLibrary(index)}
                        className="w-full"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choisir dans la médiathèque
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="content.autoPlay"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Lecture automatique</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content.showDots"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Afficher les points</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content.duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (ms)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 5000)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {selectedType !== 'slider' && (
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedType !== 'slider' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien de redirection (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="button_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte du bouton (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="En savoir plus" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Bloc actif</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Afficher ce bloc sur le site
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#33C3F0] hover:bg-[#0FA0CE]">
              {isLoading ? "Enregistrement..." : (block ? "Modifier" : "Créer")}
            </Button>
          </div>
        </form>
      </Form>

      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={handleMediaLibrarySelect}
      />
    </>
  );
};

export default BlockForm;
