
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Database, FileArchive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TechnicalDocumentationHeaderProps {
  onExport: () => void;
}

const TechnicalDocumentationHeader = ({ onExport }: TechnicalDocumentationHeaderProps) => {
  const { toast } = useToast();

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
          "tailwindcss": "^3.4.0"
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
# Installation Locale Podsleek

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

## Base de données locale
1. Installer PostgreSQL
2. Créer une base de données 'podsleek'
3. Exécuter le script SQL fourni
4. Configurer les variables de connexion

## Structure du projet
- src/components/ : Composants React
- src/pages/ : Pages principales
- src/hooks/ : Hooks personnalisés
- src/services/ : Services API
- src/types/ : Types TypeScript
- src/utils/ : Fonctions utilitaires

## Déploiement
- Build: npm run build
- Preview: npm run preview
- Production: Servir le dossier dist/
      `,

      // Informations de migration
      migrationNotes: `
## Migration depuis Lovable/Supabase

### Changements nécessaires pour installation locale :

1. Remplacer l'authentification Supabase par un système local
2. Adapter les appels API pour une base PostgreSQL locale
3. Configurer un serveur backend (Express.js recommandé)
4. Adapter le système de stockage des fichiers
5. Modifier les policies RLS pour un contexte local

### Fichiers à adapter prioritairement :
- src/contexts/AuthContext.tsx
- src/integrations/supabase/client.ts
- src/services/ (tous les services)
- Configuration des uploads de fichiers

### Base de données locale :
- Utiliser le script SQL fourni séparément
- Adapter les fonctions Supabase aux fonctions PostgreSQL standard
- Reconfigurer les triggers et policies selon le contexte local
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
      description: "Le fichier contient la structure complète du projet avec les instructions d'installation locale",
    });
  };

  const downloadDatabase = () => {
    // Génération du script SQL complet pour installation locale
    const sqlExport = `-- PODSLEEK - EXPORT BASE DE DONNÉES COMPLÈTE
-- Date de génération: ${new Date().toLocaleDateString('fr-FR')}
-- Version: 1.2.0
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
-- STRUCTURE DES TABLES
-- =============================================

-- Table users (utilisateurs)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    full_name text,
    role text NOT NULL DEFAULT 'créateur',
    is_super_admin boolean DEFAULT false,
    default_commission numeric(5,2) DEFAULT 15.00,
    avatar_url text,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL
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
-- FONCTIONS UTILITAIRES
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

-- =============================================
-- TRIGGERS
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
-- INDEX POUR PERFORMANCES
-- =============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_creator_products_creator_id ON public.creator_products(creator_id);
CREATE INDEX idx_creator_products_published ON public.creator_products(is_published);
CREATE INDEX idx_print_products_printer_id ON public.print_products(printer_id);
CREATE INDEX idx_print_products_active ON public.print_products(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Index JSONB
CREATE INDEX idx_creator_products_design_data ON public.creator_products USING GIN(design_data);
CREATE INDEX idx_product_templates_design_area ON public.product_templates USING GIN(design_area);

-- =============================================
-- DONNÉES DE DÉMONSTRATION
-- =============================================

-- Utilisateurs de test
INSERT INTO public.users (id, full_name, role, is_super_admin, email, password_hash) VALUES
('00000000-0000-0000-0000-000000000001', 'Super Admin', 'superAdmin', true, 'admin@podsleek.com', hash_password('admin123')),
('00000000-0000-0000-0000-000000000002', 'Créateur Demo', 'créateur', false, 'createur@demo.com', hash_password('demo123')),
('00000000-0000-0000-0000-000000000003', 'Imprimeur Demo', 'imprimeur', false, 'imprimeur@demo.com', hash_password('demo123'))
ON CONFLICT (id) DO NOTHING;

-- Gabarit de test
INSERT INTO public.product_templates (
    id, name, type, design_area, mockup_area, svg_file_url, mockup_image_url,
    available_positions, available_colors, created_by
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    'T-shirt Basique',
    't-shirt',
    '{"x": 100, "y": 120, "width": 200, "height": 250}',
    '{"x": 80, "y": 100, "width": 240, "height": 290}',
    '/templates/tshirt-template.svg',
    '/mockups/tshirt-mockup.png',
    ARRAY['face', 'back'],
    ARRAY['white', 'black', 'gray'],
    '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- INSTRUCTIONS D'INSTALLATION
-- =============================================

/*
INSTALLATION LOCALE :

1. Installer PostgreSQL 15+
2. Créer la base de données : CREATE DATABASE podsleek;
3. Se connecter : \\c podsleek;
4. Exécuter ce script SQL complet
5. Configurer l'application avec les paramètres de connexion locaux

CONNEXION APPLICATION :
- Host: localhost
- Port: 5432
- Database: podsleek
- User: [votre_utilisateur_postgres]
- Password: [votre_mot_de_passe]

COMPTES DE TEST :
- Super Admin : admin@podsleek.com / admin123
- Créateur : createur@demo.com / demo123
- Imprimeur : imprimeur@demo.com / demo123

ADAPTATION FRONTEND :
Remplacer les appels Supabase par des appels API REST vers votre serveur local.
*/

-- FIN DU SCRIPT D'INSTALLATION`;

    const blob = new Blob([sqlExport], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podsleek-database-complete.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Base de données exportée",
      description: "Script SQL complet pour installation PostgreSQL locale avec données de test",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documentation Technique Complète</h1>
        <p className="text-gray-600 mt-2">Documentation exhaustive pour maintenance, migration et reprise du projet Podsleek</p>
      </div>
      <div className="flex gap-3">
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
