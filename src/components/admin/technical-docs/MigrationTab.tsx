
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import CopyButton from './CopyButton';

const MigrationTab = () => {
  const migrationChecklist = [
    { category: "Avant Migration", items: [
      "Backup complet de toutes les tables via Supabase Dashboard",
      "Export du schéma SQL complet (structure + données)",
      "Sauvegarde des Edge Functions personnalisées",
      "Documentation des variables d'environnement actuelles",
      "Test de la fonction get_user_role() pour éviter récursion RLS",
      "Validation de la structure JSONB (design_area, design_data)",
      "Vérification de l'intégrité des foreign keys"
    ]},
    { category: "Pendant Migration", items: [
      "Maintenir l'ordre de création des tables (dépendances FK)",
      "Activer RLS sur chaque table APRÈS insertion des données",
      "Recréer les index et triggers en dernier",
      "Tester chaque policy RLS individuellement",
      "Vérifier les permissions des fonctions SECURITY DEFINER"
    ]},
    { category: "Après Migration", items: [
      "Test complet d'authentification (login/logout/rôles)",
      "Validation CRUD sur chaque table avec différents rôles",
      "Test des workflows créateur/imprimeur/admin",
      "Vérification de l'isolation des données par utilisateur",
      "Performance des requêtes avec EXPLAIN ANALYZE",
      "Test du storage et upload de fichiers",
      "Validation de l'export Markdown de la documentation"
    ]}
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Checklist de Migration et Audit Complet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {migrationChecklist.map((section) => (
              <div key={section.category} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">🚨 Points Critiques Absolus</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• <strong>Fonction get_user_role()</strong> : Recréer AVANT les policies RLS</li>
                <li>• <strong>Variables d'environnement</strong> : VITE_SUPABASE_URL et ANON_KEY</li>
                <li>• <strong>Ordre FK</strong> : users → product_templates → print_products → creator_products</li>
                <li>• <strong>RLS activation</strong> : ENABLE ROW LEVEL SECURITY sur chaque table</li>
                <li>• <strong>auth.uid()</strong> : Présent dans chaque policy utilisateur</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Scripts de Validation Post-Migration</h4>
              <pre className="bg-white p-3 rounded text-xs">
{`-- Test des policies RLS
SELECT * FROM creator_products; -- Doit retourner seulement les produits autorisés

-- Test de la fonction get_user_role
SELECT get_user_role(auth.uid()); -- Doit retourner le rôle correct

-- Validation des foreign keys
SELECT COUNT(*) FROM creator_products cp 
LEFT JOIN print_products pp ON cp.print_product_id = pp.id 
WHERE pp.id IS NULL; -- Doit retourner 0

-- Test performance index
EXPLAIN ANALYZE SELECT * FROM creator_products 
WHERE creator_id = auth.uid() AND is_published = true;`}
              </pre>
              <CopyButton text="Scripts de validation..." label="Scripts Validation" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationTab;
