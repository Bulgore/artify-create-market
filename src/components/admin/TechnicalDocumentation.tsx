import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download, Database, Code, Settings, Bug, Workflow, AlertTriangle, Table, FileText, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const TechnicalDocumentation = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

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

## 5. Structure Détaillée des Tables

### Table: users
\`\`\`sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('créateur', 'imprimeur', 'admin', 'superAdmin')),
    is_super_admin BOOLEAN DEFAULT false,
    avatar_url TEXT,
    default_commission NUMERIC(5,2) DEFAULT 15.00,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger auto-update
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`\`\`

### Table: product_templates
\`\`\`sql
CREATE TABLE public.product_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    design_area JSONB NOT NULL, -- {x: number, y: number, width: number, height: number}
    mockup_area JSONB, -- {x: number, y: number, width: number, height: number}
    svg_file_url TEXT NOT NULL,
    mockup_image_url TEXT NOT NULL,
    available_positions TEXT[] DEFAULT ARRAY['face'],
    available_colors TEXT[] DEFAULT ARRAY['white'],
    technical_instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_product_templates_active ON product_templates(is_active);
CREATE INDEX idx_product_templates_type ON product_templates(type);
\`\`\`

### Table: print_products
\`\`\`sql
CREATE TABLE public.print_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    printer_id UUID NOT NULL REFERENCES users(id),
    template_id UUID NOT NULL REFERENCES product_templates(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    material TEXT NOT NULL,
    available_sizes TEXT[] NOT NULL DEFAULT '{}',
    available_colors TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    print_areas JSONB NOT NULL DEFAULT '{}',
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index composé pour optimiser les requêtes par imprimeur
CREATE INDEX idx_print_products_printer_active ON print_products(printer_id, is_active);
\`\`\`

### Table: creator_products
\`\`\`sql
CREATE TABLE public.creator_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES users(id),
    print_product_id UUID NOT NULL REFERENCES print_products(id),
    name TEXT NOT NULL,
    description TEXT,
    design_data JSONB NOT NULL DEFAULT '{}', -- {url: string, position: {x, y}, size: {width, height}}
    creator_margin_percentage NUMERIC(5,2) NOT NULL DEFAULT 20,
    preview_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_creator_products_creator_published ON creator_products(creator_id, is_published);
CREATE INDEX idx_creator_products_published ON creator_products(is_published) WHERE is_published = true;
\`\`\`

## 6. Fonctions SQL Personnalisées

### get_user_role(user_id uuid)
\`\`\`sql
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT 
      CASE 
        WHEN is_super_admin = true THEN 'superAdmin'
        ELSE role
      END
    FROM public.users 
    WHERE id = user_id
  );
END;
$$;
\`\`\`

### calculate_earnings(order_id uuid)
\`\`\`sql
CREATE OR REPLACE FUNCTION public.calculate_earnings(order_id uuid)
RETURNS TABLE(creator_id uuid, printer_id uuid, creator_earnings numeric, printer_earnings numeric, platform_earnings numeric)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.creator_id,
    pp.printer_id,
    (o.quantity * cp.creator_margin_percentage / 100 * pp.base_price)::NUMERIC AS creator_earnings,
    (o.quantity * pp.base_price)::NUMERIC AS printer_earnings,
    (o.total_price - (o.quantity * pp.base_price) - (o.quantity * cp.creator_margin_percentage / 100 * pp.base_price))::NUMERIC AS platform_earnings
  FROM 
    orders o
  JOIN 
    creator_products cp ON o.creator_product_id = cp.id
  JOIN 
    print_products pp ON cp.print_product_id = pp.id
  WHERE 
    o.id = order_id;
END;
$$;
\`\`\`

## 7. Policies Row Level Security (RLS)

### product_templates
\`\`\`sql
-- Lecture publique pour templates actifs
CREATE POLICY "Public can view active templates" 
ON product_templates FOR SELECT 
USING (is_active = true);

-- Super admins peuvent tout faire
CREATE POLICY "Super admins can manage all templates" 
ON product_templates FOR ALL 
USING (get_user_role(auth.uid()) = 'superAdmin');
\`\`\`

### print_products
\`\`\`sql
-- Imprimeurs voient leurs produits
CREATE POLICY "Printers can view their products" 
ON print_products FOR SELECT 
USING (printer_id = auth.uid() OR is_active = true);

-- Imprimeurs peuvent modifier leurs produits
CREATE POLICY "Printers can manage their products" 
ON print_products FOR ALL 
USING (printer_id = auth.uid());
\`\`\`

### creator_products
\`\`\`sql
-- Créateurs voient leurs produits
CREATE POLICY "Creators can view their products" 
ON creator_products FOR SELECT 
USING (creator_id = auth.uid() OR is_published = true);

-- Créateurs peuvent gérer leurs produits
CREATE POLICY "Creators can manage their products" 
ON creator_products FOR ALL 
USING (creator_id = auth.uid());
\`\`\`

## 8. Exemples de Requêtes Courantes

### Récupérer tous les produits publiés avec leurs détails
\`\`\`sql
SELECT 
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
WHERE cp.is_published = true AND pp.is_active = true;
\`\`\`

### Insérer un nouveau produit créateur
\`\`\`sql
INSERT INTO creator_products (
    creator_id,
    print_product_id,
    name,
    description,
    design_data,
    creator_margin_percentage
) VALUES (
    auth.uid(),
    'uuid-du-print-product',
    'Mon T-shirt Design',
    'Description du produit',
    '{"url": "https://...", "position": {"x": 100, "y": 50}, "size": {"width": 200, "height": 150}}',
    25.00
);
\`\`\`

### Mettre à jour les données JSONB de design
\`\`\`sql
UPDATE creator_products 
SET design_data = jsonb_set(
    design_data, 
    '{position}', 
    '{"x": 120, "y": 60}'
)
WHERE id = 'product-uuid' AND creator_id = auth.uid();
\`\`\`

## 9. Checklist de Migration/Audit

### Avant Migration
- [ ] **Backup complet** : Exporter toutes les tables via Supabase Dashboard
- [ ] **Test des policies RLS** : Vérifier que \`get_user_role()\` fonctionne
- [ ] **Validation des JSONB** : S'assurer que design_area et design_data sont valides
- [ ] **Vérification des contraintes** : Tester les foreign keys et unique constraints
- [ ] **Export des Edge Functions** : Sauvegarder le code des fonctions personnalisées

### Après Migration
- [ ] **Test d'authentification** : Vérifier login/logout
- [ ] **Test des rôles** : Créateur, Imprimeur, Admin fonctionnent
- [ ] **Test CRUD** : Create/Read/Update/Delete sur chaque table
- [ ] **Vérification RLS** : Utilisateurs voient uniquement leurs données
- [ ] **Test Storage** : Upload/download de fichiers
- [ ] **Performance** : Vérifier les index et temps de réponse

### Points Critiques
- [ ] **Variables d'environnement** : VITE_SUPABASE_URL et ANON_KEY configurées
- [ ] **Policies RLS activées** : \`ENABLE ROW LEVEL SECURITY\` sur toutes les tables
- [ ] **Triggers fonctionnels** : update_updated_at_column actif
- [ ] **Foreign keys préservées** : Relations intactes entre tables
- [ ] **Fonction get_user_role()** : Évite la récursion RLS

## 10. Scripts de Déploiement

### Installation locale
\`\`\`bash
# Clone du projet
git clone [REPO_URL]
cd podsleek

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
# Éditer .env avec les vraies clés Supabase

# Lancement dev
npm run dev
\`\`\`

### Build production
\`\`\`bash
# Build optimisé
npm run build

# Preview du build
npm run preview

# Deploy (selon plateforme)
npm run deploy
\`\`\`

### Export/Import Supabase
\`\`\`bash
# Export schema SQL
supabase db dump --schema-only > schema.sql

# Export données
supabase db dump --data-only > data.sql

# Import complet
psql [CONNECTION_STRING] < schema.sql
psql [CONNECTION_STRING] < data.sql
\`\`\`

## 11. Points de Vigilance Spécifiques

### Lovable
- **NE JAMAIS** modifier package.json directement
- **NE JAMAIS** éditer src/integrations/supabase/types.ts
- Utiliser uniquement \`<lov-add-dependency>\` pour packages
- Types Supabase auto-générés à ne pas toucher

### Sécurité
- Policies RLS critiques pour isolation des données
- Fonction get_user_role() évite récursion RLS
- Variables auth.uid() dans toutes les policies utilisateur
- Validation côté serveur ET client obligatoire

### Performance
- Index sur (user_id, is_active) pour tables principales
- JSONB optimisé avec GIN index si volume important
- Limit/offset pour pagination des listes
- Cache Tanstack Query configuré correctement

---

**Dernière mise à jour** : ${new Date().toLocaleDateString('fr-FR')}
**Version** : 1.1.0
**Maintenu par** : Équipe Podsleek

Cette documentation doit être mise à jour à chaque modification majeure de la structure de données ou des fonctionnalités critiques.
`;
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button
      size="sm"
      variant="outline"
      onClick={() => copyToClipboard(text, label)}
      className="ml-2"
    >
      <Copy className="h-4 w-4" />
      {copied === label ? "Copié !" : "Copier"}
    </Button>
  );

  const tablesSchema = [
    {
      name: "users",
      description: "Table principale des utilisateurs avec rôles et permissions",
      columns: [
        { name: "id", type: "uuid", constraint: "PK, FK auth.users", description: "Identifiant unique" },
        { name: "full_name", type: "text", constraint: "nullable", description: "Nom complet utilisateur" },
        { name: "role", type: "text", constraint: "NOT NULL", description: "Rôle : créateur, imprimeur, admin, superAdmin" },
        { name: "is_super_admin", type: "boolean", constraint: "DEFAULT false", description: "Flag super administrateur" },
        { name: "avatar_url", type: "text", constraint: "nullable", description: "URL photo de profil" },
        { name: "default_commission", type: "numeric(5,2)", constraint: "DEFAULT 15.00", description: "Commission par défaut %" },
        { name: "created_at", type: "timestamptz", constraint: "DEFAULT now()", description: "Date de création" },
        { name: "updated_at", type: "timestamptz", constraint: "DEFAULT now()", description: "Dernière modification" }
      ]
    },
    {
      name: "product_templates",
      description: "Gabarits de produits créés par les super admins",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du gabarit" },
        { name: "type", type: "text", constraint: "NOT NULL", description: "Type de produit (t-shirt, tote-bag...)" },
        { name: "design_area", type: "jsonb", constraint: "NOT NULL", description: "Zone d'impression {x,y,width,height}" },
        { name: "mockup_area", type: "jsonb", constraint: "nullable", description: "Zone du mockup {x,y,width,height}" },
        { name: "svg_file_url", type: "text", constraint: "NOT NULL", description: "URL du fichier SVG gabarit" },
        { name: "mockup_image_url", type: "text", constraint: "NOT NULL", description: "URL image de présentation" },
        { name: "available_positions", type: "text[]", constraint: "DEFAULT ['face']", description: "Positions d'impression disponibles" },
        { name: "available_colors", type: "text[]", constraint: "DEFAULT ['white']", description: "Couleurs disponibles" },
        { name: "technical_instructions", type: "text", constraint: "nullable", description: "Instructions techniques impression" },
        { name: "is_active", type: "boolean", constraint: "DEFAULT true", description: "Statut actif/inactif" },
        { name: "created_by", type: "uuid", constraint: "FK users(id)", description: "Créateur du gabarit" }
      ]
    },
    {
      name: "print_products",
      description: "Produits créés par les imprimeurs basés sur des gabarits",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "printer_id", type: "uuid", constraint: "FK users(id)", description: "Propriétaire imprimeur" },
        { name: "template_id", type: "uuid", constraint: "FK product_templates(id)", description: "Gabarit utilisé" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du produit" },
        { name: "description", type: "text", constraint: "nullable", description: "Description détaillée" },
        { name: "base_price", type: "numeric(10,2)", constraint: "NOT NULL", description: "Prix de base imprimeur" },
        { name: "material", type: "text", constraint: "NOT NULL", description: "Matériau du produit" },
        { name: "available_sizes", type: "text[]", constraint: "NOT NULL", description: "Tailles disponibles" },
        { name: "available_colors", type: "text[]", constraint: "NOT NULL", description: "Couleurs disponibles" },
        { name: "images", type: "text[]", constraint: "NOT NULL", description: "URLs des images produit" },
        { name: "print_areas", type: "jsonb", constraint: "DEFAULT '{}'", description: "Zones d'impression configurées" },
        { name: "stock_quantity", type: "integer", constraint: "DEFAULT 0", description: "Quantité en stock" },
        { name: "is_active", type: "boolean", constraint: "DEFAULT true", description: "Produit actif/inactif" }
      ]
    },
    {
      name: "creator_products",
      description: "Produits finaux créés par les créateurs avec leurs designs",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "creator_id", type: "uuid", constraint: "FK users(id)", description: "Créateur du produit" },
        { name: "print_product_id", type: "uuid", constraint: "FK print_products(id)", description: "Produit de base utilisé" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du produit final" },
        { name: "description", type: "text", constraint: "nullable", description: "Description marketing" },
        { name: "design_data", type: "jsonb", constraint: "DEFAULT '{}'", description: "Données du design {url,position,size}" },
        { name: "creator_margin_percentage", type: "numeric(5,2)", constraint: "DEFAULT 20", description: "Marge créateur en %" },
        { name: "preview_url", type: "text", constraint: "nullable", description: "URL aperçu produit fini" },
        { name: "is_published", type: "boolean", constraint: "DEFAULT false", description: "Produit publié/brouillon" }
      ]
    }
  ];

  const rlsPolicies = [
    {
      table: "product_templates",
      policies: [
        {
          name: "Public can view active templates",
          type: "SELECT",
          condition: "is_active = true",
          description: "Permet la lecture publique des gabarits actifs"
        },
        {
          name: "Super admins can manage all templates",
          type: "ALL",
          condition: "get_user_role(auth.uid()) = 'superAdmin'",
          description: "Super admins ont tous les droits sur les gabarits"
        }
      ]
    },
    {
      table: "print_products",
      policies: [
        {
          name: "Printers can view their products",
          type: "SELECT",
          condition: "printer_id = auth.uid() OR is_active = true",
          description: "Imprimeurs voient leurs produits + produits actifs publics"
        },
        {
          name: "Printers can manage their products",
          type: "ALL",
          condition: "printer_id = auth.uid()",
          description: "Imprimeurs peuvent CRUD leurs propres produits"
        }
      ]
    },
    {
      table: "creator_products",
      policies: [
        {
          name: "Creators can view their products",
          type: "SELECT",
          condition: "creator_id = auth.uid() OR is_published = true",
          description: "Créateurs voient leurs produits + produits publiés"
        },
        {
          name: "Creators can manage their products",
          type: "ALL",
          condition: "creator_id = auth.uid()",
          description: "Créateurs peuvent CRUD leurs propres produits"
        }
      ]
    }
  ];

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentation Technique Complète</h1>
          <p className="text-gray-600 mt-2">Documentation exhaustive pour maintenance, migration et reprise du projet Podsleek</p>
        </div>
        <Button onClick={exportDocumentation} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter Documentation Complète
        </Button>
      </div>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Présentation Générale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Objectifs du projet</h3>
                <p className="text-gray-700">
                  Podsleek est une plateforme de print-on-demand permettant aux créateurs de designer des produits personnalisés 
                  (t-shirts, tote bags, etc.) et aux imprimeurs de proposer leurs services et produits.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Contexte d'usage</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li><strong>Créateurs</strong> : uploadent des designs, les positionnent sur des produits, définissent leurs marges</li>
                  <li><strong>Imprimeurs</strong> : ajoutent leurs produits, définissent les zones d'impression, gèrent les commandes</li>
                  <li><strong>Super Admin</strong> : gère les utilisateurs, templates, contenus et paramètres globaux</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Stack Technique</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• React 18 + TypeScript</li>
                      <li>• Vite (bundler)</li>
                      <li>• Tailwind CSS + Shadcn/UI</li>
                      <li>• Framer Motion</li>
                      <li>• React Router DOM</li>
                      <li>• Tanstack Query</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Backend</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Supabase (BaaS)</li>
                      <li>• PostgreSQL</li>
                      <li>• Auth & Storage</li>
                      <li>• Edge Functions</li>
                      <li>• Row Level Security</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Arborescence et Structure du Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
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
│   ├── useAuth.ts      # Authentification
│   ├── useDesignManagement.ts
│   └── useDesignPositioner.ts
├── services/           # Services API
│   ├── authService.ts
│   ├── designsService.ts
│   └── pricingService.ts
├── contexts/           # Contexts React
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── pages/              # Pages principales
└── integrations/       # Intégrations Supabase`}
              </pre>
              <CopyButton text={`Structure des dossiers Podsleek...`} label="Structure" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Structure Détaillée des Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tablesSchema.map((table) => (
                  <div key={table.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-blue-600">{table.name}</h3>
                      <CopyButton text={`Table: ${table.name}`} label={`Schema ${table.name}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{table.description}</p>
                    
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Colonne</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Contraintes</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.columns.map((column) => (
                          <TableRow key={column.name}>
                            <TableCell className="font-mono text-sm">{column.name}</TableCell>
                            <TableCell className="font-mono text-sm text-blue-600">{column.type}</TableCell>
                            <TableCell className="text-sm">{column.constraint}</TableCell>
                            <TableCell className="text-sm">{column.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Policies Row Level Security (RLS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">🔒 Importance Critique des Policies RLS</h4>
                  <p className="text-sm text-red-700">
                    Les policies RLS garantissent l'isolation des données entre utilisateurs. 
                    Leur suppression ou modification accidentelle peut exposer des données privées.
                  </p>
                </div>

                {rlsPolicies.map((tablePolicy) => (
                  <div key={tablePolicy.table} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-600 mb-3">
                      Table: {tablePolicy.table}
                    </h3>
                    
                    <div className="space-y-3">
                      {tablePolicy.policies.map((policy, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{policy.name}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {policy.type}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div><strong>Condition:</strong> <code className="bg-white px-1">{policy.condition}</code></div>
                            <div><strong>Description:</strong> {policy.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3">
                      <CopyButton text={`RLS Policies for ${tablePolicy.table}`} label={`Policies ${tablePolicy.table}`} />
                    </div>
                  </div>
                ))}

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Fonction get_user_role() Anti-Récursion</h4>
                  <p className="text-sm text-yellow-700 mb-2">
                    Cette fonction SECURITY DEFINER évite les erreurs "infinite recursion detected in policy".
                  </p>
                  <pre className="bg-white p-2 rounded text-xs">
{`CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT CASE WHEN is_super_admin = true THEN 'superAdmin' ELSE role END 
          FROM public.users WHERE id = user_id);
END;
$$;`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Workflows Principaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">Workflow Créateur</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Inscription/Connexion avec rôle "créateur"</li>
                  <li>Navigation vers Studio Créateur</li>
                  <li>Sélection d'un produit existant (print_product)</li>
                  <li>Upload d'un fichier design (image/svg)</li>
                  <li>Positionnement automatique selon design_area du gabarit</li>
                  <li>Ajustement manuel position/taille dans la zone bleue</li>
                  <li>Configuration nom, description, marge créateur</li>
                  <li>Aperçu temps réel sur mockup produit</li>
                  <li>Publication du produit (creator_product)</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-green-600">Workflow Imprimeur</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Inscription/Connexion avec rôle "imprimeur"</li>
                  <li>Navigation vers Studio Imprimeur</li>
                  <li>Sélection d'un gabarit existant (product_template)</li>
                  <li>Création nouveau produit avec prix de base</li>
                  <li>Configuration matériau, tailles, couleurs disponibles</li>
                  <li>Upload images produit</li>
                  <li>Définition stock et activation</li>
                  <li>Gestion des commandes reçues</li>
                  <li>Mise à jour statuts commandes</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-red-600">Workflow Super Admin</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Accès interface admin avec tous les droits</li>
                  <li>Gestion utilisateurs (modification rôles, suspension)</li>
                  <li>Création/modification gabarits produits</li>
                  <li>Configuration zones d'impression et mockups</li>
                  <li>Gestion contenus et pages dynamiques</li>
                  <li>Surveillance statistiques et commandes</li>
                  <li>Configuration paramètres globaux</li>
                  <li>Maintenance technique et debugging</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scripts et Déploiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Commandes de Développement</h3>
                  <pre className="bg-gray-50 p-4 rounded text-sm">
{`# Installation locale
npm install

# Serveur de développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint`}
                  </pre>
                  <CopyButton text="npm install && npm run dev" label="Commandes dev" />
                </div>

                <div>
                  <h3 className="font-medium mb-2">Déploiement Lovable</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Le projet est automatiquement déployé via Lovable lors des modifications.
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>Bouton "Publish" dans l'interface Lovable</li>
                    <li>URL de production générée automatiquement</li>
                    <li>Intégration GitHub optionnelle pour versioning</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Migration Base de Données</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Les migrations SQL sont gérées via l'interface Supabase :
                  </p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>SQL Editor dans le dashboard Supabase</li>
                    <li>Backup automatique avant modifications</li>
                    <li>Rollback possible via snapshots</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vigilance" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Dernière mise à jour</strong>: {new Date().toLocaleDateString('fr-FR')} • 
          <strong> Version</strong>: 1.1.0 • 
          <strong> Maintenu par</strong>: Équipe Podsleek • 
          <strong> Documentation</strong>: Niveau Production
        </p>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
