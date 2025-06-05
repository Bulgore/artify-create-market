
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const VigilanceTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Points de Vigilance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h4 className="font-medium text-red-800 mb-2">🚨 Spécificités Lovable Critiques</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• <strong>NE JAMAIS</strong> modifier package.json directement</li>
                <li>• <strong>NE JAMAIS</strong> éditer src/integrations/supabase/types.ts</li>
                <li>• Utiliser uniquement &lt;lov-add-dependency&gt; pour les packages</li>
                <li>• Les types Supabase sont auto-générés, ne pas les modifier</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Éléments à ne pas casser</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Policies RLS : essentielles pour la sécurité des données</li>
                <li>• Fonction get_user_role() : évite la récursion RLS</li>
                <li>• Structure design_area : cohérence templates/produits</li>
                <li>• Système d'authentification : requis pour toutes les opérations</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h4 className="font-medium text-blue-800 mb-2">💡 Astuces de Maintenance</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Surveiller les logs Supabase Edge Functions</li>
                <li>• Vérifier cohérence design_area entre templates</li>
                <li>• Tester les workflows complets après modifications</li>
                <li>• Maintenir documentation à jour</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h4 className="font-medium text-green-800 mb-2">✅ Bonnes Pratiques</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Créer des composants petits et focalisés</li>
                <li>• Utiliser les hooks personnalisés pour la logique</li>
                <li>• Valider les entrées utilisateur côté client ET serveur</li>
                <li>• Documenter les changements dans cette page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VigilanceTab;
