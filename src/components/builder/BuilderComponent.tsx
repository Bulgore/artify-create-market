
import React, { useEffect, useState } from 'react';
import { builder, BuilderComponent as BuilderComponentLib } from '@builder.io/react';
import { BUILDER_API_KEY } from '@/integrations/builder-io/config';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface BuilderComponentProps {
  model: string;
  contentId?: string;
  apiKey?: string;
}

const BuilderComponent: React.FC<BuilderComponentProps> = ({ 
  model, 
  contentId, 
  apiKey = BUILDER_API_KEY 
}) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        const content = await builder
          .get(model, {
            apiKey,
            ...(contentId && { id: contentId }),
            includeRefs: true,
          })
          .promise();

        setContent(content);
      } catch (error) {
        console.error('Erreur lors du chargement du contenu Builder.io:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger le contenu du CMS."
        });
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [model, contentId, apiKey, toast]);

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-2/3" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucun contenu trouvé pour ce modèle.</p>
      </div>
    );
  }

  return (
    <BuilderComponentLib 
      model={model} 
      content={content} 
      apiKey={apiKey}
    />
  );
};

export default BuilderComponent;
