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
    a.download = 'podsleek-documentation-technique-complete.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documentation exportée",
      description: "Le fichier de documentation technique complète a été téléchargé",
    });
  };

  const generateMarkdownDoc = () => {
    return `# Podsleek - Documentation Technique Complète

**Date de génération**: ${new Date().toLocaleDateString('fr-FR')}  
**Version**: 1.2.0  
**Maintenu par**: Équipe Podsleek  
**Niveau**: Production

---

## 📋 Table des Matières

1. [Présentation Générale](#1-présentation-générale)
2. [Structure du Projet](#2-structure-du-projet)
3. [Schéma Relationnel de la Base de Données](#3-schéma-relationnel-de-la-base-de-données)
4. [Structure Détaillée des Tables](#4-structure-détaillée-des-tables)
5. [Policies Row Level Security (RLS)](#5-policies-row-level-security-rls)
6. [Exemples de Requêtes SQL Courantes](#6-exemples-de-requêtes-sql-courantes)
7. [Workflows Principaux](#7-workflows-principaux)
8. [Checklist de Migration et Audit Complet](#8-checklist-de-migration-et-audit-complet)
9. [Scripts et Déploiement](#9-scripts-et-déploiement)
10. [Points de Vigilance](#10-points-de-vigilance)

---

## 1. Présentation Générale

### 🎯 Objectifs du projet
Podsleek est une plateforme de print-on-demand permettant aux créateurs de designer des produits personnalisés (t-shirts, tote bags, etc.) et aux imprimeurs de proposer leurs services et produits.

### 👥 Contexte d'usage
- **Créateurs** : uploadent des designs, les positionnent sur des produits, définissent leurs marges
- **Imprimeurs** : ajoutent leurs produits, définissent les zones d'impression, gèrent les commandes
- **Super Admin** : gère les utilisateurs, templates, contenus et paramètres globaux

### 🛠️ Stack Technique

#### Frontend
- **React 18** avec TypeScript
- **Vite** (bundler et dev server)
- **Tailwind CSS** (styling)
- **Shadcn/UI** (composants UI)
- **Framer Motion** (animations)
- **React Router DOM** (routing)
- **React Hook Form** + **Zod** (formulaires et validation)
- **Tanstack Query** (state management et cache)

#### Backend & Infrastructure
- **Supabase** (BaaS complet)
  - PostgreSQL (base de données)
  - Auth (authentification)
  - Storage (fichiers)
  - Edge Functions (serverless)
  - Row Level Security (RLS)

#### Outils de développement
- **Lovable** (IDE/éditeur visuel)
- **TypeScript** (typage statique)
- **ESLint** (linting)

### 🔐 Variables d'Environnement

\`\`\`env
# Supabase Configuration
VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production uniquement
SUPABASE_SERVICE_ROLE_KEY=[PRIVATE_KEY]
\`\`\`

---

## 2. Structure du Projet

\`\`\`
src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   ├── templates/   # Gestion gabarits
│   │   └── technical-docs/ # Documentation technique
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
└── integrations/       # Intégrations Supabase
\`\`\`

---

## 3. Schéma Relationnel de la Base de Données

### 🔗 Relations Principales
- **users** → creator_products (1:n) | imprimeurs → print_products (1:n)
- **product_templates** → print_products (1:n) | gabarits utilisés par imprimeurs
- **print_products** → creator_products (1:n) | base pour créations
- **creator_products** → orders (1:n) | produits finis commandés

### 📊 Diagramme Mermaid

\`\`\`mermaid
erDiagram
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
    }
\`\`\`

### 💡 Utilisation du Diagramme
- Copiez le code Mermaid dans [mermaid.live](https://mermaid.live)
- Ou intégrez-le dans votre documentation technique
- Export possible en PNG/SVG pour présentations

---

## 4. Structure Détaillée des Tables

### 👤 Table: users
**Description**: Table principale des utilisateurs avec rôles et permissions

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK, FK auth.users | Identifiant unique |
| full_name | text | nullable | Nom complet utilisateur |
| role | text | NOT NULL | Rôle : créateur, imprimeur, admin, superAdmin |
| is_super_admin | boolean | DEFAULT false | Flag super administrateur |
| avatar_url | text | nullable | URL photo de profil |
| default_commission | numeric(5,2) | DEFAULT 15.00 | Commission par défaut % |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

### 🎨 Table: product_templates
**Description**: Gabarits de produits créés par les super admins

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK | Identifiant unique |
| name | text | NOT NULL | Nom du gabarit |
| type | text | NOT NULL | Type de produit (t-shirt, tote-bag...) |
| design_area | jsonb | NOT NULL | Zone d'impression {x,y,width,height} |
| mockup_area | jsonb | nullable | Zone du mockup {x,y,width,height} |
| svg_file_url | text | NOT NULL | URL du fichier SVG gabarit |
| mockup_image_url | text | NOT NULL | URL image de présentation |
| available_positions | text[] | DEFAULT ['face'] | Positions d'impression disponibles |
| available_colors | text[] | DEFAULT ['white'] | Couleurs disponibles |
| technical_instructions | text | nullable | Instructions techniques impression |
| is_active | boolean | DEFAULT true | Statut actif/inactif |
| created_by | uuid | FK users(id) | Créateur du gabarit |

### 🖨️ Table: print_products
**Description**: Produits créés par les imprimeurs basés sur des gabarits

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK | Identifiant unique |
| printer_id | uuid | FK users(id) | Propriétaire imprimeur |
| template_id | uuid | FK product_templates(id) | Gabarit utilisé |
| name | text | NOT NULL | Nom du produit |
| description | text | nullable | Description détaillée |
| base_price | numeric(10,2) | NOT NULL | Prix de base imprimeur |
| material | text | NOT NULL | Matériau du produit |
| available_sizes | text[] | NOT NULL | Tailles disponibles |
| available_colors | text[] | NOT NULL | Couleurs disponibles |
| images | text[] | NOT NULL | URLs des images produit |
| print_areas | jsonb | DEFAULT '{}' | Zones d'impression configurées |
| stock_quantity | integer | DEFAULT 0 | Quantité en stock |
| is_active | boolean | DEFAULT true | Produit actif/inactif |

### ✨ Table: creator_products
**Description**: Produits finaux créés par les créateurs avec leurs designs

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK | Identifiant unique |
| creator_id | uuid | FK users(id) | Créateur du produit |
| print_product_id | uuid | FK print_products(id) | Produit de base utilisé |
| name | text | NOT NULL | Nom du produit final |
| description | text | nullable | Description marketing |
| design_data | jsonb | DEFAULT '{}' | Données du design {url,position,size} |
| creator_margin_percentage | numeric(5,2) | DEFAULT 20 | Marge créateur en % |
| preview_url | text | nullable | URL aperçu produit fini |
| is_published | boolean | DEFAULT false | Produit publié/brouillon |

---

## 5. Policies Row Level Security (RLS)

### 🔒 Importance Critique des Policies RLS
Les policies RLS garantissent l'isolation des données entre utilisateurs. Leur suppression ou modification accidentelle peut exposer des données privées.

### Table: product_templates

#### Public can view active templates (SELECT)
- **Condition**: \`is_active = true\`
- **Description**: Permet la lecture publique des gabarits actifs

#### Super admins can manage all templates (ALL)
- **Condition**: \`get_user_role(auth.uid()) = 'superAdmin'\`
- **Description**: Super admins ont tous les droits sur les gabarits

### Table: print_products

#### Printers can view their products (SELECT)
- **Condition**: \`printer_id = auth.uid() OR is_active = true\`
- **Description**: Imprimeurs voient leurs produits + produits actifs publics

#### Printers can manage their products (ALL)
- **Condition**: \`printer_id = auth.uid()\`
- **Description**: Imprimeurs peuvent CRUD leurs propres produits

### Table: creator_products

#### Creators can view their products (SELECT)
- **Condition**: \`creator_id = auth.uid() OR is_published = true\`
- **Description**: Créateurs voient leurs produits + produits publiés

#### Creators can manage their products (ALL)
- **Condition**: \`creator_id = auth.uid()\`
- **Description**: Créateurs peuvent CRUD leurs propres produits

### ⚠️ Fonction get_user_role() Anti-Récursion
Cette fonction SECURITY DEFINER évite les erreurs "infinite recursion detected in policy".

\`\`\`sql
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT CASE WHEN is_super_admin = true THEN 'superAdmin' ELSE role END 
          FROM public.users WHERE id = user_id);
END;
$$;
\`\`\`

---

## 6. Exemples de Requêtes SQL Courantes

### SELECT - Récupérer tous les produits publiés

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
WHERE cp.is_published = true 
  AND pp.is_active = true
ORDER BY cp.created_at DESC;
\`\`\`

### INSERT - Créer un nouveau produit créateur

\`\`\`sql
INSERT INTO creator_products (
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
);
\`\`\`

### UPDATE - Modifier position design (JSONB)

\`\`\`sql
-- Mettre à jour la position du design
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
  AND creator_id = auth.uid();
\`\`\`

### Requêtes d'Analyse et Statistiques

\`\`\`sql
-- Produits les plus populaires par créateur
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
ORDER BY avg_price DESC;
\`\`\`

### 💡 Conseils d'Optimisation
- Utilisez \`EXPLAIN ANALYZE\` pour mesurer les performances
- Créez des index sur les colonnes de filtrage fréquent
- Limitez les résultats avec \`LIMIT\` et pagination
- Utilisez les index GIN pour les recherches JSONB complexes

---

## 7. Workflows Principaux

### 🎨 Workflow Créateur

1. Inscription/Connexion avec rôle "créateur"
2. Navigation vers Studio Créateur
3. Sélection d'un produit existant (print_product)
4. Upload d'un fichier design (image/svg)
5. Positionnement automatique selon design_area du gabarit
6. Ajustement manuel position/taille dans la zone bleue
7. Configuration nom, description, marge créateur
8. Aperçu temps réel sur mockup produit
9. Publication du produit (creator_product)

### 🖨️ Workflow Imprimeur

1. Inscription/Connexion avec rôle "imprimeur"
2. Navigation vers Studio Imprimeur
3. Sélection d'un gabarit existant (product_template)
4. Création nouveau produit avec prix de base
5. Configuration matériau, tailles, couleurs disponibles
6. Upload images produit
7. Définition stock et activation
8. Gestion des commandes reçues
9. Mise à jour statuts commandes

### 👑 Workflow Super Admin

1. Accès interface admin avec tous les droits
2. Gestion utilisateurs (modification rôles, suspension)
3. Création/modification gabarits produits
4. Configuration zones d'impression et mockups
5. Gestion contenus et pages dynamiques
6. Surveillance statistiques et commandes
7. Configuration paramètres globaux
8. Maintenance technique et debugging

---

## 8. Checklist de Migration et Audit Complet

### ⚠️ Avant Migration

- [ ] Backup complet de toutes les tables via Supabase Dashboard
- [ ] Export du schéma SQL complet (structure + données)
- [ ] Sauvegarde des Edge Functions personnalisées
- [ ] Documentation des variables d'environnement actuelles
- [ ] Test de la fonction get_user_role() pour éviter récursion RLS
- [ ] Validation de la structure JSONB (design_area, design_data)
- [ ] Vérification de l'intégrité des foreign keys

### 🔄 Pendant Migration

- [ ] Maintenir l'ordre de création des tables (dépendances FK)
- [ ] Activer RLS sur chaque table APRÈS insertion des données
- [ ] Recréer les index et triggers en dernier
- [ ] Tester chaque policy RLS individuellement
- [ ] Vérifier les permissions des fonctions SECURITY DEFINER

### ✅ Après Migration

- [ ] Test complet d'authentification (login/logout/rôles)
- [ ] Validation CRUD sur chaque table avec différents rôles
- [ ] Test des workflows créateur/imprimeur/admin
- [ ] Vérification de l'isolation des données par utilisateur
- [ ] Performance des requêtes avec EXPLAIN ANALYZE
- [ ] Test du storage et upload de fichiers
- [ ] Validation de l'export Markdown de la documentation

### 🚨 Points Critiques Absolus
- **Fonction get_user_role()** : Recréer AVANT les policies RLS
- **Variables d'environnement** : VITE_SUPABASE_URL et ANON_KEY
- **Ordre FK** : users → product_templates → print_products → creator_products
- **RLS activation** : ENABLE ROW LEVEL SECURITY sur chaque table
- **auth.uid()** : Présent dans chaque policy utilisateur

### ✅ Scripts de Validation Post-Migration

\`\`\`sql
-- Test des policies RLS
SELECT * FROM creator_products; -- Doit retourner seulement les produits autorisés

-- Test de la fonction get_user_role
SELECT get_user_role(auth.uid()); -- Doit retourner le rôle correct

-- Validation des foreign keys
SELECT COUNT(*) FROM creator_products cp 
LEFT JOIN print_products pp ON cp.print_product_id = pp.id 
WHERE pp.id IS NULL; -- Doit retourner 0

-- Test performance index
EXPLAIN ANALYZE SELECT * FROM creator_products 
WHERE creator_id = auth.uid() AND is_published = true;
\`\`\`

---

## 9. Scripts et Déploiement

### 🛠️ Commandes de Développement

\`\`\`bash
# Installation locale
npm install

# Serveur de développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
\`\`\`

### 🚀 Déploiement Lovable

Le projet est automatiquement déployé via Lovable lors des modifications.

- Bouton "Publish" dans l'interface Lovable
- URL de production générée automatiquement
- Intégration GitHub optionnelle pour versioning

### 💾 Migration Base de Données

Les migrations SQL sont gérées via l'interface Supabase :

- SQL Editor dans le dashboard Supabase
- Backup automatique avant modifications
- Rollback possible via snapshots

---

## 10. Points de Vigilance

### 🚨 Spécificités Lovable Critiques
- **NE JAMAIS** modifier package.json directement
- **NE JAMAIS** éditer src/integrations/supabase/types.ts
- Utiliser uniquement \`<lov-add-dependency>\` pour les packages
- Les types Supabase sont auto-générés, ne pas les modifier

### ⚠️ Éléments à ne pas casser
- Policies RLS : essentielles pour la sécurité des données
- Fonction get_user_role() : évite la récursion RLS
- Structure design_area : cohérence templates/produits
- Système d'authentification : requis pour toutes les opérations

### 💡 Astuces de Maintenance
- Surveiller les logs Supabase Edge Functions
- Vérifier cohérence design_area entre templates
- Tester les workflows complets après modifications
- Maintenir documentation à jour

### ✅ Bonnes Pratiques
- Créer des composants petits et focalisés
- Utiliser les hooks personnalisés pour la logique
- Valider les entrées utilisateur côté client ET serveur
- Documenter les changements dans cette page

---

## 📚 Annexes

### Installation Locale Complète

1. **Cloner le projet depuis GitHub** (si connecté)
2. **Installer les dépendances**
   \`\`\`bash
   npm install
   \`\`\`
3. **Configurer les variables d'environnement**
   \`\`\`env
   VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   \`\`\`
4. **Lancer en développement**
   \`\`\`bash
   npm run dev
   \`\`\`

### Récupération depuis Lovable

1. Connecter GitHub dans Lovable (bouton GitHub en haut à droite)
2. Transférer le code vers votre repository
3. Cloner localement avec \`git clone\`
4. Suivre les étapes d'installation locale

### Rollback d'urgence

1. Accéder à l'historique Lovable (bouton historique)
2. Identifier la version stable précédente
3. Cliquer sur "Revert" sous la modification à annuler
4. Confirmer le rollback

---

**Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}**

**⚠️ Important** : Cette documentation doit être mise à jour à chaque modification majeure de la structure de données ou des fonctionnalités critiques.

**🔗 Liens utiles** :
- [Documentation Lovable](https://docs.lovable.dev/)
- [Documentation Supabase](https://supabase.com/docs)
- [Communauté Discord Lovable](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

*© 2025 Podsleek - Documentation Technique Complète v1.2.0*
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
