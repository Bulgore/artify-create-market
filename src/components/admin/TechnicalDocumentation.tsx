
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download, Database, Code, Settings, Bug, Workflow, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    return `# Podsleek - Documentation Technique

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

## 4. Structure Base de Données

### Tables Principales

#### users
- **id**: uuid (PK, référence auth.users)
- **full_name**: text
- **role**: text ('créateur', 'imprimeur', 'admin', 'superAdmin')
- **is_super_admin**: boolean
- **avatar_url**: text
- **default_commission**: numeric (15.00)
- **created_at**: timestamp
- **updated_at**: timestamp

#### product_templates
- **id**: uuid (PK)
- **name**: text (nom du gabarit)
- **type**: text (type de produit)
- **design_area**: jsonb (zone d'impression)
- **mockup_area**: jsonb (zone du mockup)
- **svg_file_url**: text (fichier SVG)
- **mockup_image_url**: text (image mockup)
- **available_positions**: text[] (positions disponibles)
- **available_colors**: text[] (couleurs disponibles)
- **technical_instructions**: text
- **is_active**: boolean
- **created_by**: uuid (FK users.id)

#### print_products
- **id**: uuid (PK)
- **printer_id**: uuid (FK users.id)
- **template_id**: uuid (FK product_templates.id)
- **name**: text
- **description**: text
- **base_price**: numeric
- **material**: text
- **available_sizes**: text[]
- **available_colors**: text[]
- **images**: text[]
- **print_areas**: jsonb
- **stock_quantity**: integer
- **is_active**: boolean

#### creator_products
- **id**: uuid (PK)
- **creator_id**: uuid (FK users.id)
- **print_product_id**: uuid (FK print_products.id)
- **name**: text
- **description**: text
- **design_data**: jsonb (données du design)
- **creator_margin_percentage**: numeric (20)
- **preview_url**: text
- **is_published**: boolean

### Vues Calculées

#### product_pricing
Vue qui calcule automatiquement :
- Prix de base + marge créateur
- Commission plateforme
- Prix final TTC

### Fonctions SQL

#### get_user_role(user_id uuid)
Fonction sécurisée pour récupérer le rôle d'un utilisateur.

#### calculate_earnings(order_id uuid)
Calcule la répartition des gains (créateur/imprimeur/plateforme).

### Policies RLS Actives

#### users
- Aucune policy (table système)

#### product_templates
- Super admins peuvent tout faire
- Lecture publique pour les templates actifs

#### print_products
- Imprimeurs voient/modifient leurs produits
- Lecture publique pour produits actifs

#### creator_products
- Créateurs voient/modifient leurs produits
- Lecture publique pour produits publiés

## 5. Architecture du Code

### Structure des dossiers
\`\`\`
src/
├── components/
│   ├── admin/           # Interface admin
│   ├── creator/         # Studio créateur
│   ├── printer/         # Studio imprimeur
│   ├── ui/             # Composants UI de base
│   └── content/        # Gestion de contenu
├── hooks/              # Hooks personnalisés
├── services/           # Services API
├── contexts/           # Contexts React
├── types/              # Types TypeScript
├── utils/              # Utilitaires
├── pages/              # Pages principales
└── integrations/       # Intégrations externes
\`\`\`

### Hooks principaux
- **useAuth**: Gestion authentification
- **useDesignManagement**: Gestion des designs
- **useDesignPositioner**: Positionnement des designs
- **useUserRole**: Vérification des rôles

### Services clés
- **authService**: Authentification
- **designsService**: Gestion des designs
- **pricingService**: Calculs de prix
- **paymentService**: Paiements (Stripe à implémenter)

## 6. Workflows Principaux

### Créateur
1. Inscription/Connexion
2. Sélection d'un produit (print_product)
3. Upload d'un design
4. Positionnement sur la zone d'impression
5. Configuration du nom/description/marge
6. Publication du produit

### Imprimeur
1. Inscription/Connexion
2. Sélection d'un gabarit (product_template)
3. Création d'un produit avec prix/matériau
4. Gestion des commandes reçues
5. Mise à jour des statuts

### Admin
1. Gestion des utilisateurs et rôles
2. Création/modification des gabarits
3. Gestion des contenus et pages
4. Surveillance des statistiques

## 7. Points de Vigilance

### Spécificités Lovable
- Ne jamais modifier package.json directement
- Utiliser <lov-add-dependency> pour ajouter des packages
- Les types Supabase sont auto-générés
- Éviter les modifications manuelles des fichiers d'intégration

### Éléments critiques
- Les policies RLS sont essentielles pour la sécurité
- La fonction get_user_role() évite la récursion RLS
- Les design_area doivent être cohérents entre templates et produits
- L'authentification est requise pour toutes les opérations utilisateur

### Maintenance
- Surveiller les logs Supabase pour les erreurs
- Vérifier régulièrement les policies RLS
- Maintenir la cohérence des types TypeScript
- Tester les workflows complets après chaque modification

## 8. Commandes de Développement

\`\`\`bash
# Installation locale
npm install

# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview
\`\`\`

## 9. Historique des Corrections

### Bugs majeurs résolus
- **Récursion RLS**: Création de fonctions SECURITY DEFINER
- **Positionnement designs**: Utilisation correcte des design_area
- **TypeScript**: Ajout imports manquants
- **Authentification**: Gestion sécurisée des rôles

### Points de migration
- Base Supabase existante avec données
- Migrations SQL via interface Supabase
- Préservation des données utilisateur

---

**Dernière mise à jour**: ${new Date().toLocaleDateString('fr-FR')}
**Version**: 1.0.0
**Maintenu par**: Équipe Podsleek
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentation Technique</h1>
          <p className="text-gray-600 mt-2">Documentation complète pour la maintenance et migration de Podsleek</p>
        </div>
        <Button onClick={exportDocumentation} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter en Markdown
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="env">Variables</TabsTrigger>
          <TabsTrigger value="bugs">Bugs & Fixes</TabsTrigger>
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

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Structure Base de Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Tables Principales</h3>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 mb-2">users</h4>
                    <div className="text-sm space-y-1">
                      <div><code>id</code> (uuid, PK) - Référence auth.users</div>
                      <div><code>full_name</code> (text) - Nom complet</div>
                      <div><code>role</code> (text) - 'créateur', 'imprimeur', 'admin', 'superAdmin'</div>
                      <div><code>is_super_admin</code> (boolean) - Flag super admin</div>
                      <div><code>default_commission</code> (numeric) - Commission par défaut (15%)</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 mb-2">product_templates</h4>
                    <div className="text-sm space-y-1">
                      <div><code>id</code> (uuid, PK)</div>
                      <div><code>name</code> (text) - Nom du gabarit</div>
                      <div><code>type</code> (text) - Type de produit</div>
                      <div><code>design_area</code> (jsonb) - Zone d'impression {`{x, y, width, height}`}</div>
                      <div><code>mockup_area</code> (jsonb) - Zone du mockup</div>
                      <div><code>svg_file_url</code> (text) - Fichier SVG du gabarit</div>
                      <div><code>mockup_image_url</code> (text) - Image de présentation</div>
                      <div><code>created_by</code> (uuid, FK) - Créateur du gabarit</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 mb-2">print_products</h4>
                    <div className="text-sm space-y-1">
                      <div><code>id</code> (uuid, PK)</div>
                      <div><code>printer_id</code> (uuid, FK users.id) - Imprimeur propriétaire</div>
                      <div><code>template_id</code> (uuid, FK product_templates.id) - Gabarit utilisé</div>
                      <div><code>base_price</code> (numeric) - Prix de base imprimeur</div>
                      <div><code>available_sizes</code> (text[]) - Tailles disponibles</div>
                      <div><code>available_colors</code> (text[]) - Couleurs disponibles</div>
                      <div><code>print_areas</code> (jsonb) - Zones d'impression</div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-blue-600 mb-2">creator_products</h4>
                    <div className="text-sm space-y-1">
                      <div><code>id</code> (uuid, PK)</div>
                      <div><code>creator_id</code> (uuid, FK users.id) - Créateur</div>
                      <div><code>print_product_id</code> (uuid, FK print_products.id) - Produit de base</div>
                      <div><code>design_data</code> (jsonb) - Données du design {`{url, position, size}`}</div>
                      <div><code>creator_margin_percentage</code> (numeric) - Marge créateur (%)</div>
                      <div><code>is_published</code> (boolean) - Statut publication</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Fonctions SQL Personnalisées</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm">get_user_role(user_id uuid) → text</code>
                    <p className="text-xs text-gray-600 mt-1">Fonction sécurisée pour récupérer le rôle utilisateur (évite récursion RLS)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <code className="text-sm">calculate_earnings(order_id uuid) → table</code>
                    <p className="text-xs text-gray-600 mt-1">Calcule la répartition des gains entre créateur/imprimeur/plateforme</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Policies RLS Critiques</h3>
                <div className="text-sm space-y-2">
                  <div className="border-l-4 border-green-500 pl-3">
                    <strong>product_templates</strong>: Super admins gèrent tout, lecture publique pour templates actifs
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <strong>print_products</strong>: Imprimeurs voient leurs produits, lecture publique si actif
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <strong>creator_products</strong>: Créateurs gèrent leurs produits, lecture publique si publié
                  </div>
                </div>
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

        <TabsContent value="env" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variables d'Environnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Configuration Supabase</h3>
                  <pre className="bg-gray-50 p-4 rounded text-sm">
{`VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                  </pre>
                  <CopyButton text="VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co" label="Variables Supabase" />
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Note</strong>: Les clés privées ne sont pas exposées ici pour des raisons de sécurité. 
                    Elles sont stockées dans les secrets Supabase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bugs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Historique des Bugs et Correctifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-red-600">Récursion RLS (Row Level Security)</h4>
                  <p className="text-sm text-gray-600 mb-2"><strong>Symptôme</strong>: "infinite recursion detected in policy"</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Cause</strong>: Policy RLS référençant sa propre table</p>
                  <p className="text-sm text-gray-600"><strong>Solution</strong>: Création fonction SECURITY DEFINER get_user_role()</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-orange-600">Positionnement initial designs</h4>
                  <p className="text-sm text-gray-600 mb-2"><strong>Symptôme</strong>: Design centré par défaut, pas selon gabarit</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Cause</strong>: Calcul position basé sur canvas, pas design_area</p>
                  <p className="text-sm text-gray-600"><strong>Solution</strong>: Utilisation coordonnées design_area du gabarit</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-blue-600">Imports TypeScript manquants</h4>
                  <p className="text-sm text-gray-600 mb-2"><strong>Symptôme</strong>: "Cannot find name 'useEffect'"</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Cause</strong>: Import React hooks oublié lors refactoring</p>
                  <p className="text-sm text-gray-600"><strong>Solution</strong>: Ajout import useEffect dans useDesignPositioner</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-green-600">Gestion rôles utilisateurs</h4>
                  <p className="text-sm text-gray-600 mb-2"><strong>Symptôme</strong>: Redirections incorrectes selon rôle</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>Cause</strong>: Vérification rôle côté client non sécurisée</p>
                  <p className="text-sm text-gray-600"><strong>Solution</strong>: Fonction RPC sécurisée + hooks dédiés</p>
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
                    <li>• Tester workflows complets après modifications</li>
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
          <strong> Version</strong>: 1.0.0 • 
          <strong> Maintenu par</strong>: Équipe Podsleek
        </p>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
