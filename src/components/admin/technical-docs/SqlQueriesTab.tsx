
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import CopyButton from './CopyButton';

const SqlQueriesTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Exemples de Requêtes SQL Courantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">SELECT - Récupérer tous les produits publiés</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`SELECT 
    cp.id,
    cp.name AS product_name,
    cp.description,
    cp.creator_margin_percentage,
    cp.design_data,
    pp.base_price,
    pp.material,
    pp.available_sizes,
    pt.name AS template_name,
    pt.mockup_image_url,
    u.full_name AS creator_name
FROM creator_products cp
JOIN print_products pp ON cp.print_product_id = pp.id
JOIN product_templates pt ON pp.template_id = pt.id
JOIN users u ON cp.creator_id = u.id
WHERE cp.is_published = true 
  AND pp.is_active = true
ORDER BY cp.created_at DESC;`}
            </pre>
            <CopyButton text="SELECT query complète..." label="Query SELECT" />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">INSERT - Créer un nouveau produit créateur</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`INSERT INTO creator_products (
    creator_id,
    print_product_id,
    name,
    description,
    design_data,
    creator_margin_percentage
) VALUES (
    auth.uid(), -- ID de l'utilisateur connecté
    'uuid-du-print-product',
    'Mon T-shirt Design Unique',
    'Description marketing du produit',
    '{"url": "https://storage.supabase.co/design.png", 
      "position": {"x": 100, "y": 50}, 
      "size": {"width": 200, "height": 150}}',
    25.00
);`}
            </pre>
            <CopyButton text="INSERT query..." label="Query INSERT" />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">UPDATE - Modifier position design (JSONB)</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`-- Mettre à jour la position du design
UPDATE creator_products 
SET design_data = jsonb_set(
    design_data, 
    '{position}', 
    '{"x": 120, "y": 60}'
)
WHERE id = 'product-uuid' 
  AND creator_id = auth.uid();

-- Mettre à jour la taille du design
UPDATE creator_products 
SET design_data = jsonb_set(
    design_data, 
    '{size}', 
    '{"width": 250, "height": 180}'
)
WHERE id = 'product-uuid' 
  AND creator_id = auth.uid();`}
            </pre>
            <CopyButton text="UPDATE JSONB query..." label="Query UPDATE JSONB" />
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Requêtes d'Analyse et Statistiques</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`-- Produits les plus populaires par créateur
SELECT 
    u.full_name,
    COUNT(cp.id) as total_products,
    SUM(CASE WHEN cp.is_published THEN 1 ELSE 0 END) as published_products
FROM users u
LEFT JOIN creator_products cp ON u.id = cp.creator_id
WHERE u.role = 'créateur'
GROUP BY u.id, u.full_name
ORDER BY published_products DESC;

-- Revenus par imprimeur (simulation)
SELECT 
    u.full_name AS printer_name,
    COUNT(pp.id) as total_products,
    AVG(pp.base_price) as avg_price,
    pp.material
FROM users u
JOIN print_products pp ON u.id = pp.printer_id
WHERE u.role = 'imprimeur' AND pp.is_active = true
GROUP BY u.id, u.full_name, pp.material
ORDER BY avg_price DESC;`}
            </pre>
            <CopyButton text="Analytics queries..." label="Queries Analytics" />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Conseils d'Optimisation</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Utilisez <code>EXPLAIN ANALYZE</code> pour mesurer les performances</li>
              <li>• Créez des index sur les colonnes de filtrage fréquent</li>
              <li>• Limitez les résultats avec <code>LIMIT</code> et pagination</li>
              <li>• Utilisez les index GIN pour les recherches JSONB complexes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SqlQueriesTab;
