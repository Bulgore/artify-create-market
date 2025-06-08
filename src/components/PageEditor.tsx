
import React, { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link, Image, List, Quote, Code } from "lucide-react";

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

  const insertMarkup = useCallback((markup: string) => {
    setContent(content + markup);
  }, [content, setContent]);

  const toolbarButtons = [
    { icon: Bold, markup: '<strong>Texte en gras</strong>', label: 'Gras' },
    { icon: Italic, markup: '<em>Texte en italique</em>', label: 'Italique' },
    { icon: Link, markup: '<a href="URL">Texte du lien</a>', label: 'Lien' },
    { icon: Image, markup: '<img src="URL_IMAGE" alt="Description" class="w-full rounded-lg" />', label: 'Image' },
    { icon: List, markup: '<ul><li>Élément 1</li><li>Élément 2</li></ul>', label: 'Liste' },
    { icon: Quote, markup: '<blockquote class="border-l-4 border-gray-300 pl-4 italic">Citation</blockquote>', label: 'Citation' },
    { icon: Code, markup: '<code class="bg-gray-100 px-2 py-1 rounded">code</code>', label: 'Code' }
  ];

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
              {/* Barre d'outils */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                {toolbarButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => insertMarkup(button.markup)}
                    title={button.label}
                    className="h-8 w-8 p-0"
                  >
                    <button.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-500 mb-2">
                  Utilisez le HTML pour formater votre contenu. Utilisez les boutons ci-dessus pour insérer des éléments rapidement.
                </p>
                <Textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Contenu de la page en HTML..."
                  className="min-h-[500px] font-mono text-sm"
                />
              </div>
              
              {/* Exemples de composants */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💡 Exemples de composants utiles :</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Section avec titre :</strong>
                    <code className="ml-2 text-xs bg-white px-2 py-1 rounded">
                      &lt;section class="py-12"&gt;&lt;h2 class="text-3xl font-bold mb-6"&gt;Titre&lt;/h2&gt;&lt;p&gt;Contenu&lt;/p&gt;&lt;/section&gt;
                    </code>
                  </div>
                  <div>
                    <strong>Bouton :</strong>
                    <code className="ml-2 text-xs bg-white px-2 py-1 rounded">
                      &lt;a href="/lien" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"&gt;Mon bouton&lt;/a&gt;
                    </code>
                  </div>
                  <div>
                    <strong>Carte :</strong>
                    <code className="ml-2 text-xs bg-white px-2 py-1 rounded">
                      &lt;div class="bg-white p-6 rounded-lg shadow-lg"&gt;&lt;h3&gt;Titre&lt;/h3&gt;&lt;p&gt;Contenu&lt;/p&gt;&lt;/div&gt;
                    </code>
                  </div>
                </div>
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
