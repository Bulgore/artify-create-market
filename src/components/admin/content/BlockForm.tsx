
import React from "react";
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

const BlockForm: React.FC<BlockFormProps> = ({ block, onSubmit, onCancel, isLoading }) => {
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
    }

    await onSubmit({
      ...data,
      content: processedContent
    });
  };

  const selectedType = form.watch('type');

  return (
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
  );
};

export default BlockForm;
