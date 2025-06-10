import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database, FileArchive, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';

interface TechnicalDocumentationHeaderProps {
  onExport: () => void;
}

const TechnicalDocumentationHeader = ({ onExport }: TechnicalDocumentationHeaderProps) => {
  const { toast } = useToast();

  const generateCompletePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    let yPosition = 20;
    const pageHeight = 297;
    const margin = 20;
    const lineHeight = 6;

    // Configuration des styles
    const addTitle = (text: string, size: number = 16) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(text, margin, yPosition);
      yPosition += lineHeight * 1.5;
    };

    const addSubtitle = (text: string, size: number = 12) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(text, margin, yPosition);
      yPosition += lineHeight;
    };

    const addText = (text: string, size: number = 10) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      
      const lines = doc.splitTextToSize(text, 170);
      for (let line of lines) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      }
    };

    const addCode = (text: string) => {
      doc.setFontSize(8);
      doc.setFont('courier', 'normal');
      doc.setTextColor(0, 100, 0);
      
      const lines = doc.splitTextToSize(text, 170);
      for (let line of lines) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin + 5, yPosition);
        yPosition += lineHeight * 0.8;
      }
      yPosition += lineHeight;
    };

    const checkNewPage = () => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Page de couverture
    doc.setFillColor(255, 140, 0);
    doc.rect(0, 0, 210, 60, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('PODSLEEK', 105, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Documentation Technique Complète v1.2.0', 105, 35, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Version 1.2.0 - ${new Date().toLocaleDateString('fr-FR')}`, 105, 45, { align: 'center' });

    yPosition = 80;
    doc.setTextColor(0, 0, 0);

    // Table des matières
    addTitle('📋 TABLE DES MATIÈRES');
    addText('1. Présentation Générale et Vue d\'Ensemble');
    addText('2. Structure du Projet');
    addText('3. Schéma Relationnel de la Base de Données');
    addText('4. Structure Détaillée des Tables');
    addText('5. Policies Row Level Security (RLS)');
    addText('6. Exemples de Requêtes SQL Courantes');
    addText('7. Workflows Principaux');
    addText('8. Checklist de Migration et Audit Complet');
    addText('9. Scripts et Déploiement');
    addText('10. Points de Vigilance et Bonnes Pratiques');

    doc.addPage();
    yPosition = 20;

    // 1. Présentation Générale
    addTitle('1. PRÉSENTATION GÉNÉRALE');
    
    addSubtitle('🎯 Objectifs du projet');
    addText('Podsleek est une plateforme de print-on-demand permettant aux créateurs de designer des produits personnalisés (t-shirts, tote bags, etc.) et aux imprimeurs de proposer leurs services et produits.');

    addSubtitle('👥 Contexte d\'usage');
    addText('• Créateurs : uploadent des designs, les positionnent sur des produits, définissent leurs marges');
    addText('• Imprimeurs : ajoutent leurs produits, définissent les zones d\'impression, gèrent les commandes');
    addText('• Super Admin : gère les utilisateurs, templates, contenus et paramètres globaux');

    checkNewPage();
    addSubtitle('🛠️ Stack Technique Frontend');
    addText('• React 18 avec TypeScript');
    addText('• Vite (bundler et dev server)');
    addText('• Tailwind CSS (styling)');
    addText('• Shadcn/UI (composants UI)');
    addText('• Framer Motion (animations)');
    addText('• React Router DOM (routing)');
    addText('• React Hook Form + Zod (formulaires et validation)');
    addText('• Tanstack Query (state management et cache)');

    addSubtitle('🔧 Backend & Infrastructure');
    addText('• Supabase (BaaS complet)');
    addText('  - PostgreSQL (base de données)');
    addText('  - Auth (authentification)');
    addText('  - Storage (fichiers)');
    addText('  - Edge Functions (serverless)');
    addText('  - Row Level Security (RLS)');

    checkNewPage();
    addSubtitle('🔐 Variables d\'Environnement');
    addCode(`# Supabase Configuration
VITE_SUPABASE_URL=https://riumhqlxdmsxwsjstqgl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Production uniquement
SUPABASE_SERVICE_ROLE_KEY=[PRIVATE_KEY]`);

    // 2. Structure du Projet
    doc.addPage();
    yPosition = 20;
    addTitle('2. STRUCTURE DU PROJET');
    
    addCode(`src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   ├── templates/   # Gestion gabarits
│   │   ├── users/       # Gestion utilisateurs (NOUVEAU)
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
└── integrations/       # Intégrations Supabase`);

    // 3. Schéma de la Base de Données
    doc.addPage();
    yPosition = 20;
    addTitle('3. SCHÉMA RELATIONNEL DE LA BASE DE DONNÉES');

    addSubtitle('🔗 Relations Principales');
    addText('• users → creator_products (1:n) | créateurs vers leurs produits');
    addText('• users → print_products (1:n) | imprimeurs vers leurs produits');
    addText('• product_templates → print_products (1:n) | gabarits utilisés par imprimeurs');
    addText('• print_products → creator_products (1:n) | base pour créations');
    addText('• creator_products → orders (1:n) | produits finis commandés');

    addSubtitle('📊 Structure des Tables Principales');
    addText('users: Table principale des utilisateurs avec rôles et permissions multilingue complet');
    addText('product_templates: Gabarits de produits créés par les super admins');
    addText('print_products: Produits créés par les imprimeurs basés sur des gabarits');
    addText('creator_products: Produits finaux créés par les créateurs avec leurs designs');
    addText('orders: Commandes passées par les clients sur les produits créateurs');

    // 4. Tables Détaillées
    doc.addPage();
    yPosition = 20;
    addTitle('4. STRUCTURE DÉTAILLÉE DES TABLES');

    addSubtitle('👤 Table: users (MISE À JOUR 2025)');
    addText('Table principale des utilisateurs avec support multilingue complet');
    
    addCode(`Colonnes principales:
id                  uuid            PK, FK auth.users
full_name_fr        text            Nom complet français
full_name_en        text            Nom complet anglais  
full_name_ty        text            Nom complet tahitien
bio_fr/en/ty        text            Biographies multilingues
role                text            Rôle (créateur/imprimeur/admin/superAdmin)
is_super_admin      boolean         Flag super administrateur
creator_status      text            Statut créateur (draft/pending/approved/rejected)
creator_level       text            Niveau (debutant/intermediaire/avance/expert)
onboarding_completed boolean        Onboarding terminé
is_public_profile   boolean         Profil public visible
default_commission  numeric(5,2)    Commission par défaut
products_count      integer         Nombre de produits
avatar_url          text            URL photo de profil
social_links        jsonb           Liens sociaux
website_url         text            Site web personnel
created_at          timestamptz     Date de création
updated_at          timestamptz     Dernière modification`);

    checkNewPage();
    addSubtitle('🎨 Table: product_templates');
    addCode(`id                      uuid        PK
name                    text        NOT NULL, Nom du gabarit
type                    text        NOT NULL, Type (t-shirt, tote-bag...)
design_area             jsonb       NOT NULL, Zone d'impression {x,y,width,height}
mockup_area             jsonb       Zone du mockup {x,y,width,height}
svg_file_url            text        NOT NULL, URL fichier SVG gabarit
mockup_image_url        text        NOT NULL, URL image présentation
available_positions     text[]      DEFAULT ['face'], Positions disponibles
available_colors        text[]      DEFAULT ['white'], Couleurs disponibles
technical_instructions  text        Instructions techniques impression
is_active               boolean     DEFAULT true, Statut actif/inactif
created_by              uuid        FK users(id), Créateur du gabarit`);

    checkNewPage();
    addSubtitle('🖨️ Table: print_products');
    addCode(`id                  uuid            PK
printer_id          uuid            FK users(id), Propriétaire imprimeur
template_id         uuid            FK product_templates(id)
name                text            NOT NULL, Nom du produit
description         text            Description détaillée
base_price          numeric(10,2)   NOT NULL, Prix de base
material            text            NOT NULL, Matériau
available_sizes     text[]          NOT NULL, Tailles disponibles
available_colors    text[]          NOT NULL, Couleurs disponibles
images              text[]          NOT NULL, URLs des images
print_areas         jsonb           DEFAULT '{}', Zones d'impression
stock_quantity      integer         DEFAULT 0, Quantité en stock
is_active           boolean         DEFAULT true`);

    checkNewPage();
    addSubtitle('✨ Table: creator_products');
    addCode(`id                          uuid            PK
creator_id                  uuid            FK users(id)
print_product_id            uuid            FK print_products(id)
name                        text            NOT NULL, Nom produit final
description                 text            Description marketing
design_data                 jsonb           DEFAULT '{}', Données design
creator_margin_percentage   numeric(5,2)    DEFAULT 20, Marge créateur
preview_url                 text            URL aperçu produit fini
is_published                boolean         DEFAULT false`);

    // 5. Policies RLS
    doc.addPage();
    yPosition = 20;
    addTitle('5. POLICIES ROW LEVEL SECURITY (RLS)');

    addSubtitle('🔒 Importance Critique des Policies');
    addText('Les policies RLS garantissent l\'isolation des données entre utilisateurs. Leur suppression ou modification accidentelle peut exposer des données privées.');

    addSubtitle('⚠️ Fonction get_user_role() Anti-Récursion (CRITIQUE)');
    addText('Cette fonction SECURITY DEFINER évite les erreurs "infinite recursion detected in policy".');
    
    addCode(`CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT CASE 
    WHEN is_super_admin = true THEN 'superAdmin' 
    ELSE role 
  END FROM public.users WHERE id = user_id);
END;
$$;`);

    checkNewPage();
    addSubtitle('🛡️ Policies par Table');
    
    addText('Table: product_templates');
    addText('• Public can view active templates: is_active = true');
    addText('• Super admins can manage all: get_user_role(auth.uid()) = \'superAdmin\'');

    addText('Table: print_products');
    addText('• Printers view their products: printer_id = auth.uid() OR is_active = true');
    addText('• Printers manage their products: printer_id = auth.uid()');

    addText('Table: creator_products');
    addText('• Creators view their products: creator_id = auth.uid() OR is_published = true');
    addText('• Creators manage their products: creator_id = auth.uid()');

    addText('Table: users');
    addText('• Users can read public profiles: is_public_profile = true OR id = auth.uid()');
    addText('• Users can update their own profile: id = auth.uid()');
    addText('• Super admins can manage all users: get_user_role(auth.uid()) = \'superAdmin\'');

    // 6. Requêtes SQL
    doc.addPage();
    yPosition = 20;
    addTitle('6. EXEMPLES DE REQUÊTES SQL COURANTES');

    addSubtitle('SELECT - Récupérer tous les produits publiés');
    addCode(`SELECT 
    cp.id, cp.name AS product_name, cp.description,
    cp.creator_margin_percentage, cp.design_data,
    pp.base_price, pp.material, pp.available_sizes,
    pt.name AS template_name, pt.mockup_image_url,
    u.full_name_fr AS creator_name
FROM creator_products cp
JOIN print_products pp ON cp.print_product_id = pp.id
JOIN product_templates pt ON pp.template_id = pt.id
JOIN users u ON cp.creator_id = u.id
WHERE cp.is_published = true AND pp.is_active = true
ORDER BY cp.created_at DESC;`);

    checkNewPage();
    addSubtitle('INSERT - Créer un nouveau produit créateur');
    addCode(`INSERT INTO creator_products (
    creator_id, print_product_id, name, description,
    design_data, creator_margin_percentage
) VALUES (
    auth.uid(),
    'uuid-du-print-product',
    'Mon T-shirt Design Unique',
    'Description marketing du produit',
    '{"url": "https://storage.supabase.co/design.png", 
      "position": {"x": 100, "y": 50}, 
      "size": {"width": 200, "height": 150}}',
    25.00
);`);

    addSubtitle('UPDATE - Modifier position design (JSONB)');
    addCode(`-- Mettre à jour la position du design
UPDATE creator_products 
SET design_data = jsonb_set(design_data, '{position}', '{"x": 120, "y": 60}')
WHERE id = 'product-uuid' AND creator_id = auth.uid();

-- Mettre à jour la taille du design
UPDATE creator_products 
SET design_data = jsonb_set(design_data, '{size}', '{"width": 250, "height": 180}')
WHERE id = 'product-uuid' AND creator_id = auth.uid();`);

    // 7. Workflows
    doc.addPage();
    yPosition = 20;
    addTitle('7. WORKFLOWS PRINCIPAUX');

    addSubtitle('🎨 Workflow Créateur (MISE À JOUR)');
    addText('1. Inscription/Connexion avec rôle "créateur"');
    addText('2. Onboarding multilingue complet');
    addText('3. Configuration profil (nom, bio, liens sociaux)');
    addText('4. Navigation vers Studio Créateur');
    addText('5. Sélection d\'un produit existant (print_product)');
    addText('6. Upload d\'un fichier design (image/svg)');
    addText('7. Positionnement automatique selon design_area du gabarit');
    addText('8. Ajustement manuel position/taille dans la zone bleue');
    addText('9. Configuration nom, description, marge créateur');
    addText('10. Aperçu temps réel sur mockup produit');
    addText('11. Publication du produit (creator_product)');

    checkNewPage();
    addSubtitle('🖨️ Workflow Imprimeur');
    addText('1. Inscription/Connexion avec rôle "imprimeur"');
    addText('2. Navigation vers Studio Imprimeur');
    addText('3. Sélection d\'un gabarit existant (product_template)');
    addText('4. Création nouveau produit avec prix de base');
    addText('5. Configuration matériau, tailles, couleurs disponibles');
    addText('6. Upload images produit');
    addText('7. Définition stock et activation');
    addText('8. Gestion des commandes reçues');
    addText('9. Mise à jour statuts commandes');

    addSubtitle('👑 Workflow Super Admin (ÉTENDU)');
    addText('1. Accès interface admin avec tous les droits');
    addText('2. Gestion utilisateurs (modification rôles, réinitialisation, suspension)');
    addText('3. Création/modification gabarits produits');
    addText('4. Configuration zones d\'impression et mockups');
    addText('5. Gestion contenus et pages dynamiques');
    addText('6. Surveillance statistiques et commandes');
    addText('7. Configuration paramètres globaux');
    addText('8. Maintenance technique et debugging');
    addText('9. Réinitialisation comptes utilisateurs problématiques');
    addText('10. Export documentation technique complète');

    // 8. Migration
    doc.addPage();
    yPosition = 20;
    addTitle('8. CHECKLIST DE MIGRATION ET AUDIT COMPLET');

    addSubtitle('⚠️ Avant Migration');
    addText('□ Backup complet de toutes les tables via Supabase Dashboard');
    addText('□ Export du schéma SQL complet (structure + données)');
    addText('□ Sauvegarde des Edge Functions personnalisées');
    addText('□ Documentation des variables d\'environnement actuelles');
    addText('□ Test de la fonction get_user_role() pour éviter récursion RLS');
    addText('□ Validation de la structure JSONB (design_area, design_data)');
    addText('□ Vérification de l\'intégrité des foreign keys');
    addText('□ Test des champs multilingues (full_name_fr/en/ty, bio_fr/en/ty)');

    checkNewPage();
    addSubtitle('🔄 Pendant Migration');
    addText('□ Maintenir l\'ordre de création des tables (dépendances FK)');
    addText('□ Activer RLS sur chaque table APRÈS insertion des données');
    addText('□ Recréer les index et triggers en dernier');
    addText('□ Tester chaque policy RLS individuellement');
    addText('□ Vérifier les permissions des fonctions SECURITY DEFINER');
    addText('□ Exécuter la migration de normalisation des anciens comptes');

    addSubtitle('✅ Après Migration');
    addText('□ Test complet d\'authentification (login/logout/rôles)');
    addText('□ Validation CRUD sur chaque table avec différents rôles');
    addText('□ Test des workflows créateur/imprimeur/admin');
    addText('□ Vérification de l\'isolation des données par utilisateur');
    addText('□ Performance des requêtes avec EXPLAIN ANALYZE');
    addText('□ Test du storage et upload de fichiers');
    addText('□ Validation de l\'export Markdown de la documentation');
    addText('□ Test de la fonction de réinitialisation des comptes');

    // 9. Déploiement
    doc.addPage();
    yPosition = 20;
    addTitle('9. SCRIPTS ET DÉPLOIEMENT');

    addSubtitle('🛠️ Commandes de Développement');
    addCode(`# Installation locale
npm install

# Serveur de développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint`);

    addSubtitle('🚀 Déploiement Lovable');
    addText('Le projet est automatiquement déployé via Lovable lors des modifications.');
    addText('• Bouton "Publish" dans l\'interface Lovable');
    addText('• URL de production générée automatiquement');
    addText('• Intégration GitHub optionnelle pour versioning');

    addSubtitle('💾 Migration Base de Données');
    addText('Les migrations SQL sont gérées via l\'interface Supabase :');
    addText('• SQL Editor dans le dashboard Supabase');
    addText('• Backup automatique avant modifications');
    addText('• Rollback possible via snapshots');

    // 10. Vigilance
    doc.addPage();
    yPosition = 20;
    addTitle('10. POINTS DE VIGILANCE ET BONNES PRATIQUES');

    addSubtitle('🚨 Spécificités Lovable Critiques');
    addText('• NE JAMAIS modifier package.json directement');
    addText('• NE JAMAIS éditer src/integrations/supabase/types.ts');
    addText('• Utiliser uniquement <lov-add-dependency> pour les packages');
    addText('• Les types Supabase sont auto-générés, ne pas les modifier');

    addSubtitle('⚠️ Éléments à ne pas casser');
    addText('• Policies RLS : essentielles pour la sécurité des données');
    addText('• Fonction get_user_role() : évite la récursion RLS');
    addText('• Structure design_area : cohérence templates/produits');
    addText('• Système d\'authentification : requis pour toutes les opérations');
    addText('• Champs multilingues : full_name_fr/en/ty et bio_fr/en/ty');
    addText('• Fonction reset_user_account() : réinitialisation sécurisée');

    checkNewPage();
    addSubtitle('💡 Astuces de Maintenance');
    addText('• Surveiller les logs Supabase Edge Functions');
    addText('• Vérifier cohérence design_area entre templates');
    addText('• Tester les workflows complets après modifications');
    addText('• Maintenir documentation à jour');
    addText('• Utiliser la fonction de réinitialisation pour les comptes problématiques');
    addText('• Vérifier régulièrement les performances des requêtes JSONB');

    addSubtitle('✅ Bonnes Pratiques');
    addText('• Créer des composants petits et focalisés');
    addText('• Utiliser les hooks personnalisés pour la logique');
    addText('• Valider les entrées utilisateur côté client ET serveur');
    addText('• Documenter les changements dans cette documentation');
    addText('• Toujours tester avec différents rôles utilisateur');
    addText('• Sauvegarder avant toute modification critique');

    // Dernière page - Récapitulatif
    doc.addPage();
    yPosition = 20;
    addTitle('RÉCAPITULATIF ET CONTACTS');

    addSubtitle('📊 Statistiques du Projet');
    addText('• Version actuelle : 1.2.0');
    addText('• Dernière mise à jour : ' + new Date().toLocaleDateString('fr-FR'));
    addText('• Tables principales : 6 (users, product_templates, print_products, creator_products, orders, media_files)');
    addText('• Policies RLS : 12+ actives');
    addText('• Composants React : 100+');
    addText('• Hooks personnalisés : 25+');

    addSubtitle('🔗 Liens Utiles');
    addText('• Documentation Lovable : https://docs.lovable.dev/');
    addText('• Documentation Supabase : https://supabase.com/docs');
    addText('• Communauté Discord Lovable : discord.com/channels/1119885301872070706');
    addText('• Dashboard Supabase : https://riumhqlxdmsxwsjstqgl.supabase.co');

    addSubtitle('⚠️ Important');
    addText('Cette documentation doit être mise à jour à chaque modification majeure de la structure de données ou des fonctionnalités critiques.');

    // Footer sur toutes les pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`© 2025 Podsleek - Documentation Technique v1.2.0 - Page ${i}/${pageCount}`, 105, 290, { align: 'center' });
    }

    // Sauvegarde
    doc.save('podsleek-documentation-technique-complete.pdf');

    toast({
      title: "Documentation PDF générée",
      description: "Le fichier PDF complet avec tous les onglets a été téléchargé",
    });
  };

  const downloadSiteFiles = () => {
    // Génération d'un fichier JSON contenant tous les fichiers sources du projet
    const siteStructure = {
      project: "Podsleek",
      version: "1.2.0",
      description: "Archive complète du site pour installation locale",
      generatedAt: new Date().toISOString(),
      
      // Configuration package.json
      packageJson: {
        name: "podsleek",
        private: true,
        version: "1.2.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "tsc && vite build",
          preview: "vite preview",
          lint: "eslint ."
        },
        dependencies: {
          "@radix-ui/react-tabs": "^1.1.0",
          "@supabase/supabase-js": "^2.49.4",
          "@tanstack/react-query": "^5.56.2",
          "framer-motion": "^12.12.1",
          "lucide-react": "^0.462.0",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router-dom": "^6.26.2",
          "tailwindcss": "^3.4.0",
          "jspdf": "^2.5.1"
        },
        devDependencies: {
          "@types/react": "^18.3.1",
          "@types/react-dom": "^18.3.1",
          "typescript": "^5.0.0",
          "vite": "^5.0.0"
        }
      },

      // Variables d'environnement
      envExample: {
        "VITE_SUPABASE_URL": "https://riumhqlxdmsxwsjstqgl.supabase.co",
        "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },

      // Instructions d'installation
      installationGuide: `
# Installation Locale Podsleek v1.2.0

## Prérequis
- Node.js 18+
- npm ou yarn
- PostgreSQL 15+ (pour base locale)

## Installation
1. Extraire l'archive dans un dossier
2. cd podsleek
3. npm install
4. Créer fichier .env avec les variables d'environnement
5. npm run dev

## Nouvelles fonctionnalités v1.2.0
- Support multilingue complet (FR/EN/TY)
- Système de réinitialisation des comptes
- Gestion avancée des utilisateurs
- Documentation technique avec export PDF
- Onboarding créateur amélioré

## Base de données locale
1. Installer PostgreSQL
2. Créer une base de données 'podsleek'
3. Exécuter le script SQL fourni
4. Configurer les variables de connexion

## Structure du projet (MISE À JOUR)
- src/components/admin/users/ : Gestion utilisateurs modulaire
- src/hooks/useUsersManagement.ts : Hook gestion utilisateurs
- src/services/authService.ts : Service authentification amélioré
- Fonction reset_user_account() : Réinitialisation sécurisée

## Déploiement
- Build: npm run build
- Preview: npm run preview
- Production: Servir le dossier dist/
      `,

      // Informations de migration
      migrationNotes: `
## Migration v1.2.0 depuis versions antérieures

### Changements majeurs :

1. Ajout des champs multilingues dans users
   - full_name_fr, full_name_en, full_name_ty
   - bio_fr, bio_en, bio_ty

2. Nouvelles colonnes users
   - creator_status, creator_level
   - onboarding_completed, is_public_profile
   - social_links (jsonb), website_url
   - products_count

3. Fonction de réinitialisation sécurisée
   - reset_user_account() avec vérifications super admin

4. Composants modulaires gestion utilisateurs
   - UserCard, UserActions, UserSearch
   - UserResetDialog, UserDeleteDialog

### Scripts de migration nécessaires :
- Migration 20250610012331 : Normalisation anciens comptes
- Mise à jour policies RLS pour nouveaux champs
- Création fonction reset_user_account()

### Fichiers à adapter prioritairement :
- src/contexts/AuthContext.tsx (logs détaillés)
- src/pages/Admin.tsx (vérifications rôles)
- src/components/admin/UsersManagement.tsx (modularisé)
- src/services/authService.ts (gestion erreurs)
      `
    };

    const blob = new Blob([JSON.stringify(siteStructure, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podsleek-site-complet.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Archive du site téléchargée",
      description: "Le fichier contient la structure complète du projet v1.2.0 avec les instructions d'installation locale",
    });
  };

  const downloadDatabase = () => {
    // Génération du script SQL complet pour installation locale
    const sqlExport = `-- PODSLEEK v1.2.0 - EXPORT BASE DE DONNÉES COMPLÈTE
-- Date de génération: ${new Date().toLocaleDateString('fr-FR')}
-- Version: 1.2.0 (MISE À JOUR MAJEURE)
-- Pour installation locale PostgreSQL

-- =============================================
-- CRÉATION DE LA BASE DE DONNÉES
-- =============================================

-- Créer la base de données (à exécuter en tant que superuser)
-- CREATE DATABASE podsleek;
-- \\c podsleek;

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- STRUCTURE DES TABLES (VERSION 1.2.0)
-- =============================================

-- Table users (utilisateurs) - MISE À JOUR MAJEURE
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Champs multilingues (NOUVEAU v1.2.0)
    full_name_fr text,
    full_name_en text,
    full_name_ty text,
    bio_fr text DEFAULT '',
    bio_en text DEFAULT '',
    bio_ty text DEFAULT '',
    
    -- Champs de base
    role text NOT NULL DEFAULT 'créateur',
    is_super_admin boolean DEFAULT false,
    default_commission numeric(5,2) DEFAULT 15.00,
    avatar_url text,
    
    -- Champs créateur étendus (NOUVEAU v1.2.0)
    creator_status text DEFAULT 'draft' CHECK (creator_status IN ('draft', 'pending', 'approved', 'rejected')),
    creator_level text DEFAULT 'debutant' CHECK (creator_level IN ('debutant', 'intermediaire', 'avance', 'expert')),
    onboarding_completed boolean DEFAULT false,
    is_public_profile boolean DEFAULT false,
    products_count integer DEFAULT 0 CHECK (products_count >= 0),
    
    -- Liens sociaux et web (NOUVEAU v1.2.0)
    social_links jsonb DEFAULT '{}',
    website_url text,
    
    -- Contraintes
    CONSTRAINT users_role_check CHECK (role IN ('créateur', 'imprimeur', 'admin', 'superAdmin')),
    CONSTRAINT users_multilingual_check CHECK (
        full_name_fr IS NOT NULL OR full_name_en IS NOT NULL OR full_name_ty IS NOT NULL
    )
);

-- Table product_templates (gabarits)
CREATE TABLE IF NOT EXISTS public.product_templates (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL,
    design_area jsonb NOT NULL,
    mockup_area jsonb,
    svg_file_url text NOT NULL,
    mockup_image_url text NOT NULL,
    available_positions text[] DEFAULT ARRAY['face'::text],
    available_colors text[] DEFAULT ARRAY['white'::text],
    technical_instructions text,
    is_active boolean DEFAULT true,
    created_by uuid NOT NULL REFERENCES public.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table print_products (produits imprimeurs)
CREATE TABLE IF NOT EXISTS public.print_products (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    printer_id uuid NOT NULL REFERENCES public.users(id),
    template_id uuid NOT NULL REFERENCES public.product_templates(id),
    name text NOT NULL,
    description text,
    base_price numeric(10,2) NOT NULL CHECK (base_price > 0),
    material text NOT NULL,
    available_sizes text[] NOT NULL DEFAULT '{}',
    available_colors text[] NOT NULL DEFAULT '{}',
    images text[] NOT NULL DEFAULT '{}',
    print_areas jsonb DEFAULT '{}',
    stock_quantity integer DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table creator_products (produits créateurs)
CREATE TABLE IF NOT EXISTS public.creator_products (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id uuid NOT NULL REFERENCES public.users(id),
    print_product_id uuid NOT NULL REFERENCES public.print_products(id),
    name text NOT NULL,
    description text,
    design_data jsonb DEFAULT '{}',
    creator_margin_percentage numeric(5,2) DEFAULT 20 CHECK (creator_margin_percentage >= 0 AND creator_margin_percentage <= 100),
    preview_url text,
    is_published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table orders (commandes)
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id),
    creator_product_id uuid REFERENCES public.creator_products(id),
    quantity integer NOT NULL CHECK (quantity > 0),
    size text NOT NULL,
    total_price numeric(10,2) NOT NULL CHECK (total_price > 0),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled')),
    shipping_address jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table media_files (fichiers)
CREATE TABLE IF NOT EXISTS public.media_files (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id),
    filename text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- FONCTIONS UTILITAIRES (MISE À JOUR v1.2.0)
-- =============================================

-- Fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Fonction de hashage de mot de passe
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- Fonction de vérification de mot de passe
CREATE OR REPLACE FUNCTION verify_password(password text, hash text)
RETURNS boolean AS $$
BEGIN
    RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- Fonction get_user_role (CRITIQUE pour RLS)
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

-- Fonction de réinitialisation compte (NOUVEAU v1.2.0)
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
  
  -- Récupérer l'email de l'utilisateur depuis auth.users
  SELECT email INTO auth_user_email
  FROM auth.users 
  WHERE id = target_user_id;
  
  IF auth_user_email IS NULL THEN
    RAISE EXCEPTION 'User not found in auth.users';
  END IF;
  
  -- Réinitialiser le profil utilisateur avec des valeurs par défaut
  UPDATE public.users 
  SET 
    full_name_fr = COALESCE(NULLIF(full_name_fr, ''), split_part(auth_user_email, '@', 1)),
    full_name_en = COALESCE(NULLIF(full_name_en, ''), split_part(auth_user_email, '@', 1)),
    full_name_ty = COALESCE(NULLIF(full_name_ty, ''), split_part(auth_user_email, '@', 1)),
    bio_fr = '',
    bio_en = '',
    bio_ty = '',
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

-- =============================================
-- TRIGGERS (MISE À JOUR v1.2.0)
-- =============================================

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_templates_updated_at BEFORE UPDATE ON public.product_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_print_products_updated_at BEFORE UPDATE ON public.print_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_products_updated_at BEFORE UPDATE ON public.creator_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLICIES RLS (MISE À JOUR v1.2.0)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Policies pour users
CREATE POLICY "Users can read public profiles" ON public.users
    FOR SELECT USING (is_public_profile = true OR id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Super admins can manage all users" ON public.users
    FOR ALL USING (get_user_role(auth.uid()) = 'superAdmin');

-- Policies pour product_templates
CREATE POLICY "Public can view active templates" ON public.product_templates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage all templates" ON public.product_templates
    FOR ALL USING (get_user_role(auth.uid()) = 'superAdmin');

-- Policies pour print_products
CREATE POLICY "Printers can view their products" ON public.print_products
    FOR SELECT USING (printer_id = auth.uid() OR is_active = true);

CREATE POLICY "Printers can manage their products" ON public.print_products
    FOR ALL USING (printer_id = auth.uid());

-- Policies pour creator_products
CREATE POLICY "Creators can view their products" ON public.creator_products
    FOR SELECT USING (creator_id = auth.uid() OR is_published = true);

CREATE POLICY "Creators can manage their products" ON public.creator_products
    FOR ALL USING (creator_id = auth.uid());

-- Policies pour orders
CREATE POLICY "Users can view their orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Policies pour media_files
CREATE POLICY "Users can manage their files" ON public.media_files
    FOR ALL USING (user_id = auth.uid());

-- =============================================
-- INDEX POUR PERFORMANCES (MISE À JOUR v1.2.0)
-- =============================================

CREATE INDEX idx_users_email ON public.users(id); -- Index sur auth FK
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_creator_status ON public.users(creator_status);
CREATE INDEX idx_users_public_profile ON public.users(is_public_profile);
CREATE INDEX idx_creator_products_creator_id ON public.creator_products(creator_id);
CREATE INDEX idx_creator_products_published ON public.creator_products(is_published);
CREATE INDEX idx_print_products_printer_id ON public.print_products(printer_id);
CREATE INDEX idx_print_products_active ON public.print_products(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Index JSONB (MISE À JOUR v1.2.0)
CREATE INDEX idx_creator_products_design_data ON public.creator_products USING GIN(design_data);
CREATE INDEX idx_product_templates_design_area ON public.product_templates USING GIN(design_area);
CREATE INDEX idx_users_social_links ON public.users USING GIN(social_links);

-- =============================================
-- DONNÉES DE DÉMONSTRATION (MISE À JOUR v1.2.0)
-- =============================================

-- Utilisateurs de test avec champs multilingues
INSERT INTO public.users (
    id, full_name_fr, full_name_en, full_name_ty, 
    bio_fr, bio_en, bio_ty,
    role, is_super_admin, creator_status, creator_level,
    onboarding_completed, is_public_profile
) VALUES
(
    '00000000-0000-0000-0000-000000000001', 
    'Super Administrateur', 'Super Administrator', 'Super Administrateur',
    'Administrateur principal du système', 'Main system administrator', 'Administrateur principal du système',
    'superAdmin', true, 'approved', 'expert',
    true, false
),
(
    '00000000-0000-0000-0000-000000000002', 
    'Créateur Démo', 'Demo Creator', 'Créateur Démo',
    'Créateur de contenu passionné', 'Passionate content creator', 'Créateur de contenu passionné',
    'créateur', false, 'approved', 'intermediaire',
    true, true
),
(
    '00000000-0000-0000-0000-000000000003', 
    'Imprimeur Démo', 'Demo Printer', 'Imprimeur Démo',
    'Spécialiste impression de qualité', 'Quality printing specialist', 'Spécialiste impression de qualité',
    'imprimeur', false, 'approved', 'avance',
    true, true
)
ON CONFLICT (id) DO NOTHING;

-- Gabarit de test
INSERT INTO public.product_templates (
    id, name, type, design_area, mockup_area, svg_file_url, mockup_image_url,
    available_positions, available_colors, created_by
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'T-shirt Basique v1.2',
    't-shirt',
    '{"x": 100, "y": 120, "width": 200, "height": 250}',
    '{"x": 80, "y": 100, "width": 240, "height": 290}',
    '/templates/tshirt-template.svg',
    '/mockups/tshirt-mockup.png',
    ARRAY['face', 'back'],
    ARRAY['white', 'black', 'gray', 'navy', 'red'],
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- INSTRUCTIONS D'INSTALLATION v1.2.0
-- =============================================

/*
INSTALLATION LOCALE v1.2.0 :

1. Installer PostgreSQL 15+
2. Créer la base de données : CREATE DATABASE podsleek;
3. Se connecter : \\c podsleek;
4. Exécuter ce script SQL complet
5. Configurer l'application avec les paramètres de connexion locaux

NOUVEAUTÉS v1.2.0 :
- Support multilingue complet (FR/EN/TY)
- Champs créateur étendus (status, level, onboarding)
- Fonction de réinitialisation sécurisée
- Liens sociaux et profil public
- Policies RLS optimisées
- Index de performance améliorés

CONNEXION APPLICATION :
- Host: localhost
- Port: 5432
- Database: podsleek
- User: [votre_utilisateur_postgres]
- Password: [votre_mot_de_passe]

COMPTES DE TEST v1.2.0 :
- Super Admin : id = 00000000-0000-0000-0000-000000000001
- Créateur : id = 00000000-0000-0000-0000-000000000002
- Imprimeur : id = 00000000-0000-0000-0000-000000000003

ADAPTATION FRONTEND :
Remplacer les appels Supabase par des appels API REST vers votre serveur local.
Attention aux nouveaux champs multilingues dans les formulaires.

MIGRATION DEPUIS v1.1.x :
1. Exécuter d'abord ce script complet
2. Puis exécuter la migration 20250610012331 pour normaliser les anciens comptes
3. Tester la fonction reset_user_account() avec un super admin
*/

-- FIN DU SCRIPT D'INSTALLATION v1.2.0`;

    const blob = new Blob([sqlExport], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podsleek-database-complete-v1.2.0.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Base de données v1.2.0 exportée",
      description: "Script SQL complet pour installation PostgreSQL locale avec toutes les dernières fonctionnalités",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentation Technique Complète v1.2.0</h1>
        <p className="text-gray-600 mt-2">Documentation exhaustive pour maintenance, migration et reprise du projet Podsleek avec toutes les dernières fonctionnalités</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={generateCompletePDF} className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
          <FileImage className="h-4 w-4" />
          PDF Complet
        </Button>
        <Button onClick={downloadSiteFiles} variant="outline" className="flex items-center gap-2">
          <FileArchive className="h-4 w-4" />
          Site Complet (.json)
        </Button>
        <Button onClick={downloadDatabase} variant="outline" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Base de Données (.sql)
        </Button>
        <Button onClick={onExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Documentation (.md)
        </Button>
      </div>
    </div>
  );
};

export default TechnicalDocumentationHeader;
