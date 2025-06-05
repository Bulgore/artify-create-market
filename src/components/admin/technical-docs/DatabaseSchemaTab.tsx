
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import CopyButton from './CopyButton';

const DatabaseSchemaTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Schéma Relationnel de la Base de Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🔗 Relations Principales</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>users</strong> → creator_products (1:n) | imprimeurs → print_products (1:n)</div>
              <div><strong>product_templates</strong> → print_products (1:n) | gabarits utilisés par imprimeurs</div>
              <div><strong>print_products</strong> → creator_products (1:n) | base pour créations</div>
              <div><strong>creator_products</strong> → orders (1:n) | produits finis commandés</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Diagramme Mermaid</h3>
            <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto">
{`erDiagram
    users ||--o{ creator_products : "créé par"
    users ||--o{ print_products : "possédé par"
    users ||--o{ product_templates : "créé par"
    users ||--o{ orders : "commandé par"
    users ||--o{ subscriptions : "souscrit"
    
    product_templates ||--o{ print_products : "utilise"
    print_products ||--o{ creator_products : "basé sur"
    creator_products ||--o{ orders : "commandé"
    
    users {
        uuid id PK
        text full_name
        text role
        boolean is_super_admin
        numeric default_commission
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    product_templates {
        uuid id PK
        text name
        text type
        jsonb design_area
        jsonb mockup_area
        text svg_file_url
        text mockup_image_url
        text[] available_positions
        text[] available_colors
        text technical_instructions
        boolean is_active
        uuid created_by FK
    }
    
    print_products {
        uuid id PK
        uuid printer_id FK
        uuid template_id FK
        text name
        numeric base_price
        text material
        text[] available_sizes
        text[] available_colors
        jsonb print_areas
        integer stock_quantity
        boolean is_active
    }
    
    creator_products {
        uuid id PK
        uuid creator_id FK
        uuid print_product_id FK
        text name
        jsonb design_data
        numeric creator_margin_percentage
        text preview_url
        boolean is_published
    }`}
            </pre>
            <CopyButton text="Diagramme Mermaid complet..." label="Diagramme ERD" />
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">💡 Utilisation du Diagramme</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Copiez le code Mermaid dans <a href="https://mermaid.live" className="underline">mermaid.live</a></li>
              <li>• Ou intégrez-le dans votre documentation technique</li>
              <li>• Export possible en PNG/SVG pour présentations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseSchemaTab;
