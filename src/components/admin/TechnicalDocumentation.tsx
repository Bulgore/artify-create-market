
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TechnicalDocumentationHeader from './technical-docs/TechnicalDocumentationHeader';
import OverviewTab from './technical-docs/OverviewTab';
import DatabaseSchemaTab from './technical-docs/DatabaseSchemaTab';
import TablesDetailTab from './technical-docs/TablesDetailTab';
import RlsPoliciesTab from './technical-docs/RlsPoliciesTab';
import SqlQueriesTab from './technical-docs/SqlQueriesTab';
import WorkflowsTab from './technical-docs/WorkflowsTab';
import MigrationTab from './technical-docs/MigrationTab';
import DeploymentTab from './technical-docs/DeploymentTab';
import VigilanceTab from './technical-docs/VigilanceTab';

const TechnicalDocumentation = () => {
  const { toast } = useToast();

  const exportDocumentation = () => {
    const markdownContent = generateMarkdownDoc();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podsleek-technical-documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documentation exportée",
      description: "Le fichier README.md a été téléchargé",
    });
  };

  const generateMarkdownDoc = () => {
    return `# Podsleek - Documentation Technique Complète

## 1. Présentation Générale

### Objectifs du projet
Podsleek est une plateforme de print-on-demand permettant aux créateurs de designer des produits personnalisés (t-shirts, tote bags, etc.) et aux imprimeurs de proposer leurs services et produits.

### Contexte d'usage
- **Créateurs** : uploadent des designs, les positionnent sur des produits, définissent leurs marges
- **Imprimeurs** : ajoutent leurs produits, définissent les zones d'impression, gèrent les commandes
- **Super Admin** : gère les utilisateurs, templates, contenus et paramètres globaux

## 2. Stack Technique

### Frontend
- **React 18** avec TypeScript
- **Vite** (bundler et dev server)
- **Tailwind CSS** (styling)
- **Shadcn/UI** (composants UI)
- **Framer Motion** (animations)
- **React Router DOM** (routing)
- **React Hook Form** + **Zod** (formulaires et validation)
- **Tanstack Query** (state management et cache)

### Backend & Infrastructure
- **Supabase** (BaaS complet)
  - PostgreSQL (base de données)
  - Auth (authentification)
  - Storage (fichiers)
  - Edge Functions (serverless)
  - Row Level Security (RLS)

### Outils de développement
- **Lovable** (IDE/éditeur visuel)
- **TypeScript** (typage statique)
- **ESLint** (linting)

## 3. Variables d'Environnement

\`\`\`env
# Supabase Configuration
VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production uniquement
SUPABASE_SERVICE_ROLE_KEY=[PRIVATE_KEY]
\`\`\`

## 4. Schéma Relationnel de la Base de Données

\`\`\`mermaid
erDiagram
    users ||--o{ creator_products : "créé par"
    users ||--o{ print_products : "possédé par"
    users ||--o{ product_templates : "créé par"
    users ||--o{ orders : "commandé par"
    users ||--o{ subscriptions : "souscrit"
    users ||--o{ media_files : "uploadé par"
    
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
        timestamp created_at
        timestamp updated_at
    }
    
    print_products {
        uuid id PK
        uuid printer_id FK
        uuid template_id FK
        text name
        text description
        numeric base_price
        text material
        text[] available_sizes
        text[] available_colors
        text[] images
        jsonb print_areas
        integer stock_quantity
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    creator_products {
        uuid id PK
        uuid creator_id FK
        uuid print_product_id FK
        text name
        text description
        jsonb design_data
        numeric creator_margin_percentage
        text preview_url
        boolean is_published
        timestamp created_at
        timestamp updated_at
    }
\`\`\`

---

**Dernière mise à jour** : ${new Date().toLocaleDateString('fr-FR')}
**Version** : 1.2.0
**Maintenu par** : Équipe Podsleek

Cette documentation doit être mise à jour à chaque modification majeure de la structure de données ou des fonctionnalités critiques.
`;
  };

  return (
    <div className="space-y-6">
      <TechnicalDocumentationHeader onExport={exportDocumentation} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="schema">Schéma BD</TabsTrigger>
          <TabsTrigger value="tables">Tables Détail</TabsTrigger>
          <TabsTrigger value="rls">Policies RLS</TabsTrigger>
          <TabsTrigger value="queries">Requêtes SQL</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          <TabsTrigger value="vigilance">Vigilance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   └── templates/   # Gestion gabarits
│   ├── creator/         # Studio créateur
│   │   ├── design-positioner/  # Positionnement designs
│   │   └── design-uploader/    # Upload designs
│   ├── printer/         # Studio imprimeur
│   ├── ui/             # Composants UI de base
│   └── content/        # Rendu contenu dynamique
├── hooks/              # Hooks personnalisés
├── services/           # Services API
├── contexts/           # Contexts React
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── pages/              # Pages principales
└── integrations/       # Intégrations Supabase`}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <DatabaseSchemaTab />
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <TablesDetailTab />
        </TabsContent>

        <TabsContent value="rls" className="space-y-4">
          <RlsPoliciesTab />
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <SqlQueriesTab />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowsTab />
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <MigrationTab />
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <DeploymentTab />
        </TabsContent>

        <TabsContent value="vigilance" className="space-y-4">
          <VigilanceTab />
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Dernière mise à jour</strong>: {new Date().toLocaleDateString('fr-FR')} • 
          <strong> Version</strong>: 1.2.0 • 
          <strong> Maintenu par</strong>: Équipe Podsleek • 
          <strong> Documentation</strong>: Niveau Production
        </p>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
