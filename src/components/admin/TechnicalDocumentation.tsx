
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
    a.download = 'podsleek-documentation-technique-complete-v1.2.0.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documentation exportée",
      description: "Le fichier de documentation technique complète v1.2.0 a été téléchargé",
    });
  };

  const generateMarkdownDoc = () => {
    return `# Podsleek - Documentation Technique Complète v1.2.0

**Date de génération**: ${new Date().toLocaleDateString('fr-FR')}  
**Version**: 1.2.0 - MISE À JOUR MAJEURE  
**Maintenu par**: Équipe Podsleek  
**Niveau**: Production

---

## 🆕 NOUVEAUTÉS VERSION 1.2.0

### ✨ Fonctionnalités Ajoutées
- **Support multilingue complet** : Français, Anglais, Tahitien (FR/EN/TY)
- **Gestion avancée des utilisateurs** : Réinitialisation, statuts créateur étendus
- **Onboarding créateur amélioré** : Processus guidé avec validation
- **Profils publics** : Visibilité contrôlée des créateurs
- **Liens sociaux** : Intégration réseaux sociaux pour créateurs
- **Export PDF documentation** : Documentation complète en un fichier
- **Système de logs détaillés** : Debugging amélioré authentification
- **Composants modulaires** : Architecture refactorisée pour maintenance

### 🔧 Améliorations Techniques
- **Policies RLS optimisées** : Sécurité renforcée avec fonction anti-récursion
- **Index de performance** : Optimisation requêtes JSONB et recherches
- **Migration automatique** : Normalisation des anciens comptes
- **Hooks personnalisés** : useUsersManagement pour gestion centralisée
- **Validation stricte** : Types TypeScript étendus et validation formulaires

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

### 👥 Contexte d'usage (MISE À JOUR v1.2.0)
- **Créateurs** : uploadent des designs, les positionnent sur des produits, définissent leurs marges, gèrent leur profil public multilingue
- **Imprimeurs** : ajoutent leurs produits, définissent les zones d'impression, gèrent les commandes
- **Super Admin** : gère les utilisateurs (avec réinitialisation), templates, contenus et paramètres globaux, export documentation

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
- **jsPDF** (génération PDF) - NOUVEAU v1.2.0

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

## 2. Structure du Projet (MISE À JOUR v1.2.0)

\`\`\`
src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   ├── templates/   # Gestion gabarits
│   │   ├── users/       # Gestion utilisateurs (NOUVEAU v1.2.0)
│   │   │   ├── UserCard.tsx           # Carte utilisateur
│   │   │   ├── UserActions.tsx        # Actions utilisateur
│   │   │   ├── UserSearch.tsx         # Recherche utilisateurs
│   │   │   ├── UserResetDialog.tsx    # Dialog réinitialisation
│   │   │   └── UserDeleteDialog.tsx   # Dialog suppression
│   │   └── technical-docs/ # Documentation technique
│   ├── creator/         # Studio créateur
│   │   ├── design-positioner/  # Positionnement designs
│   │   ├── design-uploader/    # Upload designs
│   │   └── onboarding/  # Onboarding créateur (NOUVEAU v1.2.0)
│   ├── printer/         # Studio imprimeur
│   ├── ui/             # Composants UI de base
│   │   └── MultilingualInput.tsx  # Input multilingue (NOUVEAU v1.2.0)
│   └── content/        # Rendu contenu dynamique
├── hooks/              # Hooks personnalisés
│   └── useUsersManagement.ts  # Hook gestion utilisateurs (NOUVEAU v1.2.0)
├── services/           # Services API
│   └── authService.ts  # Service auth amélioré (MISE À JOUR v1.2.0)
├── contexts/           # Contexts React
│   └── AuthContext.tsx # Context auth avec logs (MISE À JOUR v1.2.0)
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── pages/              # Pages principales
│   └── Admin.tsx       # Page admin améliorée (MISE À JOUR v1.2.0)
└── integrations/       # Intégrations Supabase
\`\`\`

---

## 3. Schéma Relationnel de la Base de Données (MISE À JOUR v1.2.0)

### 🔗 Relations Principales
- **users** → creator_products (1:n) | créateurs vers leurs produits
- **users** → print_products (1:n) | imprimeurs vers leurs produits  
- **product_templates** → print_products (1:n) | gabarits utilisés par imprimeurs
- **print_products** → creator_products (1:n) | base pour créations
- **creator_products** → orders (1:n) | produits finis commandés

### 📊 Diagramme Mermaid (MISE À JOUR v1.2.0)

\`\`\`mermaid
erDiagram
    users ||--o{ creator_products : "créé par"
    users ||--o{ print_products : "possédé par"
    users ||--o{ product_templates : "créé par"
    users ||--o{ orders : "commandé par"
    
    product_templates ||--o{ print_products : "utilise"
    print_products ||--o{ creator_products : "basé sur"
    creator_products ||--o{ orders : "commandé"
    
    users {
        uuid id PK
        text full_name_fr "NOUVEAU v1.2.0"
        text full_name_en "NOUVEAU v1.2.0"
        text full_name_ty "NOUVEAU v1.2.0"
        text bio_fr "NOUVEAU v1.2.0"
        text bio_en "NOUVEAU v1.2.0"
        text bio_ty "NOUVEAU v1.2.0"
        text role
        boolean is_super_admin
        text creator_status "NOUVEAU v1.2.0"
        text creator_level "NOUVEAU v1.2.0"
        boolean onboarding_completed "NOUVEAU v1.2.0"
        boolean is_public_profile "NOUVEAU v1.2.0"
        jsonb social_links "NOUVEAU v1.2.0"
        text website_url "NOUVEAU v1.2.0"
        integer products_count "NOUVEAU v1.2.0"
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

## 4. Structure Détaillée des Tables (MISE À JOUR MAJEURE v1.2.0)

### 👤 Table: users (REFONTE COMPLÈTE v1.2.0)
**Description**: Table principale des utilisateurs avec support multilingue complet

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PK, FK auth.users | Identifiant unique |
| **full_name_fr** | text | nullable | **Nom complet français (NOUVEAU)** |
| **full_name_en** | text | nullable | **Nom complet anglais (NOUVEAU)** |
| **full_name_ty** | text | nullable | **Nom complet tahitien (NOUVEAU)** |
| **bio_fr** | text | DEFAULT '' | **Biographie française (NOUVEAU)** |
| **bio_en** | text | DEFAULT '' | **Biographie anglaise (NOUVEAU)** |
| **bio_ty** | text | DEFAULT '' | **Biographie tahitienne (NOUVEAU)** |
| role | text | NOT NULL | Rôle : créateur, imprimeur, admin, superAdmin |
| is_super_admin | boolean | DEFAULT false | Flag super administrateur |
| **creator_status** | text | DEFAULT 'draft' | **Statut créateur (draft/pending/approved/rejected) (NOUVEAU)** |
| **creator_level** | text | DEFAULT 'debutant' | **Niveau créateur (debutant/intermediaire/avance/expert) (NOUVEAU)** |
| **onboarding_completed** | boolean | DEFAULT false | **Onboarding terminé (NOUVEAU)** |
| **is_public_profile** | boolean | DEFAULT false | **Profil public visible (NOUVEAU)** |
| **products_count** | integer | DEFAULT 0 | **Nombre de produits (NOUVEAU)** |
| **social_links** | jsonb | DEFAULT '{}' | **Liens sociaux (NOUVEAU)** |
| **website_url** | text | nullable | **Site web personnel (NOUVEAU)** |
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

## 5. Policies Row Level Security (RLS) (MISE À JOUR v1.2.0)

### 🔒 Importance Critique des Policies RLS
Les policies RLS garantissent l'isolation des données entre utilisateurs. Leur suppression ou modification accidentelle peut exposer des données privées.

### ⚠️ Fonction get_user_role() Anti-Récursion (CRITIQUE)
Cette fonction SECURITY DEFINER évite les erreurs "infinite recursion detected in policy".

\`\`\`sql
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT CASE 
    WHEN is_super_admin = true THEN 'superAdmin' 
    ELSE role 
  END FROM public.users WHERE id = user_id);
END;
$$;
\`\`\`

### 🛡️ Nouvelle Fonction reset_user_account() (NOUVEAU v1.2.0)
Cette fonction permet aux super admins de réinitialiser les comptes utilisateurs problématiques.

\`\`\`sql
CREATE OR REPLACE FUNCTION public.reset_user_account(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_user_email text;
BEGIN
  -- Vérifier que l'utilisateur appelant est super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super admin required';
  END IF;
  
  -- Récupérer l'email depuis auth.users
  SELECT email INTO auth_user_email
  FROM auth.users WHERE id = target_user_id;
  
  IF auth_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;
  
  -- Réinitialiser le profil avec valeurs par défaut
  UPDATE public.users 
  SET 
    full_name_fr = COALESCE(NULLIF(full_name_fr, ''), split_part(auth_user_email, '@', 1)),
    full_name_en = COALESCE(NULLIF(full_name_en, ''), split_part(auth_user_email, '@', 1)),
    full_name_ty = COALESCE(NULLIF(full_name_ty, ''), split_part(auth_user_email, '@', 1)),
    bio_fr = '', bio_en = '', bio_ty = '',
    role = COALESCE(NULLIF(role, ''), 'créateur'),
    creator_status = 'draft',
    creator_level = 'debutant',
    onboarding_completed = false,
    is_public_profile = false,
    default_commission = 15.00,
    products_count = 0,
    social_links = '{}',
    website_url = NULL,
    updated_at = now()
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$;
\`\`\`

### Table: users (POLICIES MISES À JOUR v1.2.0)

#### Users can read public profiles (SELECT)
- **Condition**: \`is_public_profile = true OR id = auth.uid()\`
- **Description**: Lecture des profils publics + son propre profil

#### Users can update their own profile (UPDATE)
- **Condition**: \`id = auth.uid()\`
- **Description**: Modification de son propre profil uniquement

#### Super admins can manage all users (ALL)
- **Condition**: \`get_user_role(auth.uid()) = 'superAdmin'\`
- **Description**: Super admins ont tous les droits sur tous les utilisateurs

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

---

## 6. Exemples de Requêtes SQL Courantes (MISE À JOUR v1.2.0)

### SELECT - Récupérer tous les produits publiés avec info créateur multilingue

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
    u.full_name_fr AS creator_name_fr,
    u.full_name_en AS creator_name_en,
    u.full_name_ty AS creator_name_ty,
    u.bio_fr,
    u.creator_level,
    u.is_public_profile,
    u.social_links,
    u.website_url
FROM creator_products cp
JOIN print_products pp ON cp.print_product_id = pp.id
JOIN product_templates pt ON pp.template_id = pt.id
JOIN users u ON cp.creator_id = u.id
WHERE cp.is_published = true 
  AND pp.is_active = true
  AND u.is_public_profile = true
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

### UPDATE - Mettre à jour profil utilisateur multilingue (NOUVEAU v1.2.0)

\`\`\`sql
-- Mise à jour profil complet multilingue
UPDATE users 
SET 
    full_name_fr = 'Nom Français',
    full_name_en = 'English Name',
    full_name_ty = 'Nom Tahitien',
    bio_fr = 'Biographie en français...',
    bio_en = 'Biography in English...',
    bio_ty = 'Biographie en tahitien...',
    creator_status = 'approved',
    creator_level = 'intermediaire',
    is_public_profile = true,
    social_links = '{"instagram": "@username", "facebook": "page", "twitter": "@handle"}',
    website_url = 'https://monsite.com',
    updated_at = now()
WHERE id = auth.uid();
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

### Requêtes d'Analyse et Statistiques (MISE À JOUR v1.2.0)

\`\`\`sql
-- Créateurs par niveau et statut
SELECT 
    creator_level,
    creator_status,
    COUNT(*) as count,
    AVG(products_count) as avg_products
FROM users 
WHERE role = 'créateur'
GROUP BY creator_level, creator_status
ORDER BY creator_level, creator_status;

-- Profils publics avec liens sociaux
SELECT 
    full_name_fr,
    creator_level,
    products_count,
    social_links,
    website_url,
    created_at
FROM users
WHERE is_public_profile = true 
  AND role = 'créateur'
  AND creator_status = 'approved'
ORDER BY products_count DESC;

-- Revenus par imprimeur (simulation)
SELECT 
    u.full_name_fr AS printer_name,
    COUNT(pp.id) as total_products,
    AVG(pp.base_price) as avg_price,
    pp.material
FROM users u
JOIN print_products pp ON u.id = pp.printer_id
WHERE u.role = 'imprimeur' AND pp.is_active = true
GROUP BY u.id, u.full_name_fr, pp.material
ORDER BY avg_price DESC;
\`\`\`

### 💡 Conseils d'Optimisation (MISE À JOUR v1.2.0)
- Utilisez \`EXPLAIN ANALYZE\` pour mesurer les performances
- Créez des index sur les colonnes de filtrage fréquent
- Limitez les résultats avec \`LIMIT\` et pagination
- Utilisez les index GIN pour les recherches JSONB complexes (social_links, design_data)
- Index sur les nouveaux champs : creator_status, creator_level, is_public_profile

---

## 7. Workflows Principaux (MISE À JOUR v1.2.0)

### 🎨 Workflow Créateur (REFONTE COMPLÈTE v1.2.0)

1. **Inscription/Connexion** avec rôle "créateur"
2. **Onboarding multilingue guidé** (NOUVEAU)
   - Configuration noms FR/EN/TY
   - Rédaction biographies multilingues
   - Upload photo de profil
   - Configuration liens sociaux
   - Choix niveau initial
3. **Validation profil** par administrateur (statut pending → approved)
4. **Navigation vers Studio Créateur**
5. **Sélection d'un produit existant** (print_product)
6. **Upload d'un fichier design** (image/svg)
7. **Positionnement automatique** selon design_area du gabarit
8. **Ajustement manuel** position/taille dans la zone bleue
9. **Configuration produit** nom, description, marge créateur
10. **Aperçu temps réel** sur mockup produit
11. **Publication du produit** (creator_product)
12. **Activation profil public** (optionnel pour visibilité)

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

### 👑 Workflow Super Admin (ÉTENDU v1.2.0)

1. **Accès interface admin** avec tous les droits
2. **Gestion utilisateurs avancée** (NOUVEAU)
   - Modification rôles et statuts
   - Réinitialisation comptes problématiques
   - Suspension/activation comptes
   - Recherche et filtrage avancés
3. **Création/modification gabarits** produits
4. **Configuration zones d'impression** et mockups
5. **Gestion contenus et pages** dynamiques
6. **Surveillance statistiques** et commandes
7. **Configuration paramètres globaux**
8. **Maintenance technique et debugging**
9. **Export documentation complète** (Markdown + PDF) (NOUVEAU)
10. **Réinitialisation comptes utilisateurs** via fonction sécurisée

---

## 8. Checklist de Migration et Audit Complet (MISE À JOUR v1.2.0)

### ⚠️ Avant Migration

- [ ] **Backup complet** de toutes les tables via Supabase Dashboard
- [ ] **Export du schéma SQL complet** (structure + données)
- [ ] **Sauvegarde des Edge Functions** personnalisées
- [ ] **Documentation des variables d'environnement** actuelles
- [ ] **Test de la fonction get_user_role()** pour éviter récursion RLS
- [ ] **Validation de la structure JSONB** (design_area, design_data, social_links)
- [ ] **Vérification de l'intégrité des foreign keys**
- [ ] **Test des champs multilingues** existants (NOUVEAU v1.2.0)
- [ ] **Vérification des comptes sans full_name_* définis** (NOUVEAU v1.2.0)

### 🔄 Pendant Migration

- [ ] **Maintenir l'ordre de création** des tables (dépendances FK)
- [ ] **Exécuter la migration de normalisation** des anciens comptes (NOUVEAU v1.2.0)
- [ ] **Activer RLS sur chaque table** APRÈS insertion des données
- [ ] **Recréer les index et triggers** en dernier
- [ ] **Tester chaque policy RLS** individuellement
- [ ] **Vérifier les permissions** des fonctions SECURITY DEFINER
- [ ] **Créer la fonction reset_user_account()** (NOUVEAU v1.2.0)
- [ ] **Tester la réinitialisation** d'un compte test

### ✅ Après Migration

- [ ] **Test complet d'authentification** (login/logout/rôles)
- [ ] **Validation CRUD** sur chaque table avec différents rôles
- [ ] **Test des workflows** créateur/imprimeur/admin
- [ ] **Vérification de l'isolation** des données par utilisateur
- [ ] **Performance des requêtes** avec EXPLAIN ANALYZE
- [ ] **Test du storage** et upload de fichiers
- [ ] **Validation de l'export Markdown** de la documentation
- [ ] **Test de la fonction de réinitialisation** des comptes (NOUVEAU v1.2.0)
- [ ] **Test de l'onboarding** créateur multilingue (NOUVEAU v1.2.0)
- [ ] **Test des profils publics** et liens sociaux (NOUVEAU v1.2.0)
- [ ] **Validation de l'export PDF** documentation (NOUVEAU v1.2.0)

### 🚨 Points Critiques Absolus (MISE À JOUR v1.2.0)
- **Fonction get_user_role()** : Recréer AVANT les policies RLS
- **Fonction reset_user_account()** : Créer AVANT les tests admin (NOUVEAU)
- **Variables d'environnement** : VITE_SUPABASE_URL et ANON_KEY
- **Ordre FK** : users → product_templates → print_products → creator_products
- **RLS activation** : ENABLE ROW LEVEL SECURITY sur chaque table
- **auth.uid()** : Présent dans chaque policy utilisateur
- **Champs multilingues** : full_name_fr/en/ty obligatoires (NOUVEAU)
- **Validation contraintes** : creator_status, creator_level valeurs correctes (NOUVEAU)

### ✅ Scripts de Validation Post-Migration (MISE À JOUR v1.2.0)

\`\`\`sql
-- Test des policies RLS
SELECT * FROM creator_products; -- Doit retourner seulement les produits autorisés

-- Test de la fonction get_user_role
SELECT get_user_role(auth.uid()); -- Doit retourner le rôle correct

-- Test de la fonction reset_user_account (super admin uniquement)
SELECT reset_user_account('uuid-utilisateur-test'); -- Doit retourner true

-- Validation des champs multilingues
SELECT COUNT(*) FROM users 
WHERE full_name_fr IS NULL AND full_name_en IS NULL AND full_name_ty IS NULL; 
-- Doit retourner 0

-- Validation des foreign keys
SELECT COUNT(*) FROM creator_products cp 
LEFT JOIN print_products pp ON cp.print_product_id = pp.id 
WHERE pp.id IS NULL; -- Doit retourner 0

-- Test performance index avec nouveaux champs
EXPLAIN ANALYZE SELECT * FROM users 
WHERE creator_status = 'approved' AND is_public_profile = true;

-- Validation structure JSONB social_links
SELECT COUNT(*) FROM users 
WHERE social_links IS NOT NULL AND jsonb_typeof(social_links) = 'object';
\`\`\`

---

## 9. Scripts et Déploiement (MISE À JOUR v1.2.0)

### 🛠️ Commandes de Développement

\`\`\`bash
# Installation locale
npm install

# Installation avec nouvelles dépendances v1.2.0
npm install jspdf

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

### 💾 Migration Base de Données (MISE À JOUR v1.2.0)

Les migrations SQL sont gérées via l'interface Supabase :

- SQL Editor dans le dashboard Supabase
- Backup automatique avant modifications
- Rollback possible via snapshots
- **Migration 20250610012331** : Normalisation des anciens comptes (NOUVEAU)

### 📦 Nouvelles Dépendances v1.2.0

\`\`\`json
{
  "dependencies": {
    "jspdf": "^2.5.1"
  }
}
\`\`\`

---

## 10. Points de Vigilance (MISE À JOUR v1.2.0)

### 🚨 Spécificités Lovable Critiques
- **NE JAMAIS** modifier package.json directement
- **NE JAMAIS** éditer src/integrations/supabase/types.ts
- Utiliser uniquement \`<lov-add-dependency>\` pour les packages
- Les types Supabase sont auto-générés, ne pas les modifier
- **ATTENTION** : Les nouveaux champs multilingues doivent être synchronisés (NOUVEAU v1.2.0)

### ⚠️ Éléments à ne pas casser (MISE À JOUR v1.2.0)
- **Policies RLS** : essentielles pour la sécurité des données
- **Fonction get_user_role()** : évite la récursion RLS
- **Fonction reset_user_account()** : réinitialisation sécurisée (NOUVEAU)
- **Structure design_area** : cohérence templates/produits
- **Système d'authentification** : requis pour toutes les opérations
- **Champs multilingues** : full_name_fr/en/ty et bio_fr/en/ty (NOUVEAU)
- **Contraintes de validation** : creator_status et creator_level (NOUVEAU)
- **Index de performance** : sur les nouveaux champs JSONB (NOUVEAU)

### 💡 Astuces de Maintenance (MISE À JOUR v1.2.0)
- Surveiller les logs Supabase Edge Functions
- Vérifier cohérence design_area entre templates
- Tester les workflows complets après modifications
- Maintenir documentation à jour
- **Utiliser la fonction de réinitialisation** pour les comptes problématiques (NOUVEAU)
- **Vérifier régulièrement** les performances des requêtes JSONB (NOUVEAU)
- **Monitorer l'usage** des champs multilingues dans l'interface (NOUVEAU)
- **Tester l'export PDF** de la documentation après modifications (NOUVEAU)

### ✅ Bonnes Pratiques (MISE À JOUR v1.2.0)
- Créer des composants petits et focalisés
- Utiliser les hooks personnalisés pour la logique
- Valider les entrées utilisateur côté client ET serveur
- Documenter les changements dans cette documentation
- **Toujours tester avec différents rôles** utilisateur
- **Sauvegarder avant toute modification** critique
- **Utiliser le hook useUsersManagement** pour la gestion centralisée (NOUVEAU)
- **Respecter la structure multilingue** dans les formulaires (NOUVEAU)
- **Tester l'onboarding complet** pour chaque modification (NOUVEAU)
- **Valider l'export PDF** après ajout de contenu documentation (NOUVEAU)

### 🔍 Points de Surveillance Spécifiques v1.2.0
- **Migration des anciens comptes** : vérifier que tous les utilisateurs ont des noms multilingues
- **Performance des requêtes JSONB** : social_links et design_data
- **Fonctionnement de l'onboarding** : processus complet sans blocage
- **Sécurité de la fonction reset** : accessible uniquement aux super admins
- **Génération PDF** : performance et contenu complet
- **Profils publics** : visibilité correcte selon is_public_profile

---

## 📚 Annexes (MISE À JOUR v1.2.0)

### Installation Locale Complète v1.2.0

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

### Nouveaux Comptes de Test v1.2.0

- **Super Admin** : Toutes fonctionnalités + réinitialisation comptes
- **Créateur Approuvé** : Profil public avec liens sociaux
- **Créateur en Attente** : Onboarding en cours
- **Imprimeur** : Produits configurés avec stocks

---

**Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}**

**⚠️ Important** : Cette documentation v1.2.0 doit être mise à jour à chaque modification majeure de la structure de données ou des fonctionnalités critiques.

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
            <h3 className="font-semibold mb-2 text-green-800">🆕 MISE À JOUR v1.2.0 - Structure Étendue</h3>
            <pre className="text-sm overflow-x-auto">
{`src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   ├── templates/   # Gestion gabarits
│   │   ├── users/       # 🆕 Gestion utilisateurs (NOUVEAU v1.2.0)
│   │   │   ├── UserCard.tsx           # Carte utilisateur
│   │   │   ├── UserActions.tsx        # Actions utilisateur
│   │   │   ├── UserSearch.tsx         # Recherche utilisateurs
│   │   │   ├── UserResetDialog.tsx    # 🆕 Dialog réinitialisation
│   │   │   └── UserDeleteDialog.tsx   # Dialog suppression
│   │   └── technical-docs/ # Documentation technique
│   ├── creator/         # Studio créateur
│   │   ├── design-positioner/  # Positionnement designs
│   │   ├── design-uploader/    # Upload designs
│   │   └── onboarding/  # 🆕 Onboarding créateur (NOUVEAU v1.2.0)
│   ├── printer/         # Studio imprimeur
│   ├── ui/             # Composants UI de base
│   │   ├── MultilingualInput.tsx  # 🆕 Input multilingue (NOUVEAU v1.2.0)
│   │   └── LanguageSelector.tsx   # 🆕 Sélecteur langue (NOUVEAU v1.2.0)
│   └── content/        # Rendu contenu dynamique
├── hooks/              # Hooks personnalisés
│   └── useUsersManagement.ts  # 🆕 Hook gestion utilisateurs (NOUVEAU v1.2.0)
├── services/           # Services API
│   └── authService.ts  # 🔄 Service auth amélioré (MISE À JOUR v1.2.0)
├── contexts/           # Contexts React
│   ├── AuthContext.tsx # 🔄 Context auth avec logs (MISE À JOUR v1.2.0)
│   └── LanguageContext.tsx # 🆕 Context multilingue (NOUVEAU v1.2.0)
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── pages/              # Pages principales
│   ├── Admin.tsx       # 🔄 Page admin améliorée (MISE À JOUR v1.2.0)
│   └── CreatorOnboarding.tsx # 🆕 Onboarding créateur (NOUVEAU v1.2.0)
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

      <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg border border-orange-200">
        <p className="text-sm text-gray-700">
          <strong className="text-green-600">🆕 Version 1.2.0</strong> • 
          <strong> Dernière mise à jour</strong>: {new Date().toLocaleDateString('fr-FR')} • 
          <strong> Maintenu par</strong>: Équipe Podsleek • 
          <strong> Documentation</strong>: Niveau Production • 
          <strong className="text-red-600"> Export PDF Disponible</strong>
        </p>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
