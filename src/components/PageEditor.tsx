
import React, { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PageEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ content, setContent }) => {
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, [setContent]);

  // Simple HTML preview renderer
  const renderPreview = useCallback(() => {
    return { __html: content };
  }, [content]);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="edit">Édition</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-500 mb-2">
                  Utilisez le HTML pour formater votre contenu (balises h1, p, a, img, etc.)
                </p>
                <Textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Contenu de la page en HTML..."
                  className="min-h-[500px] font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div 
                  className="prose max-w-full"
                  dangerouslySetInnerHTML={renderPreview()}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
