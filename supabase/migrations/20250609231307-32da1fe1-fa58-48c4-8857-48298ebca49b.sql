
-- Modification de la table users pour supporter le multilingue
ALTER TABLE users 
ADD COLUMN full_name_en TEXT,
ADD COLUMN full_name_ty TEXT,
ADD COLUMN bio_en TEXT,
ADD COLUMN bio_ty TEXT;

-- Renommer les colonnes existantes pour clarifier qu'elles sont en français
ALTER TABLE users 
RENAME COLUMN full_name TO full_name_fr;
ALTER TABLE users 
RENAME COLUMN bio TO bio_fr;

-- Modification de la table creator_products pour supporter le multilingue
ALTER TABLE creator_products
ADD COLUMN name_en TEXT,
ADD COLUMN name_ty TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ty TEXT,
ADD COLUMN seo_title_en TEXT,
ADD COLUMN seo_title_ty TEXT,
ADD COLUMN seo_description_en TEXT,
ADD COLUMN seo_description_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE creator_products
RENAME COLUMN name TO name_fr;
ALTER TABLE creator_products
RENAME COLUMN description TO description_fr;
ALTER TABLE creator_products
RENAME COLUMN seo_title TO seo_title_fr;
ALTER TABLE creator_products
RENAME COLUMN seo_description TO seo_description_fr;

-- Modification de la table pages pour supporter le multilingue
ALTER TABLE pages
ADD COLUMN title_en TEXT,
ADD COLUMN title_ty TEXT,
ADD COLUMN content_en TEXT,
ADD COLUMN content_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE pages
RENAME COLUMN title TO title_fr;
ALTER TABLE pages
RENAME COLUMN content TO content_fr;

-- Modification de la table reusable_blocks pour supporter le multilingue
ALTER TABLE reusable_blocks
ADD COLUMN title_en TEXT,
ADD COLUMN title_ty TEXT,
ADD COLUMN button_text_en TEXT,
ADD COLUMN button_text_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE reusable_blocks
RENAME COLUMN title TO title_fr;
ALTER TABLE reusable_blocks
RENAME COLUMN button_text TO button_text_fr;

-- Modification de la table designs pour supporter le multilingue
ALTER TABLE designs
ADD COLUMN name_en TEXT,
ADD COLUMN name_ty TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE designs
RENAME COLUMN name TO name_fr;
ALTER TABLE designs
RENAME COLUMN description TO description_fr;

-- Modification de la table print_products pour supporter le multilingue
ALTER TABLE print_products
ADD COLUMN name_en TEXT,
ADD COLUMN name_ty TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE print_products
RENAME COLUMN name TO name_fr;
ALTER TABLE print_products
RENAME COLUMN description TO description_fr;

-- Modification de la table product_templates pour supporter le multilingue
ALTER TABLE product_templates
ADD COLUMN name_en TEXT,
ADD COLUMN name_ty TEXT,
ADD COLUMN technical_instructions_en TEXT,
ADD COLUMN technical_instructions_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE product_templates
RENAME COLUMN name TO name_fr;
ALTER TABLE product_templates
RENAME COLUMN technical_instructions TO technical_instructions_fr;

-- Modification de la table tshirt_templates pour supporter le multilingue
ALTER TABLE tshirt_templates
ADD COLUMN name_en TEXT,
ADD COLUMN name_ty TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN description_ty TEXT;

-- Renommer les colonnes existantes
ALTER TABLE tshirt_templates
RENAME COLUMN name TO name_fr;
ALTER TABLE tshirt_templates
RENAME COLUMN description TO description_fr;

-- Créer une table pour les préférences de langue des utilisateurs
CREATE TABLE user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  preferred_language TEXT NOT NULL DEFAULT 'fr' CHECK (preferred_language IN ('fr', 'en', 'ty')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir et modifier leurs préférences
CREATE POLICY "Users can view their own preferences" 
  ON user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Créer une table pour stocker les traductions des interfaces (labels, menus, etc.)
CREATE TABLE interface_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL,
  value_fr TEXT,
  value_en TEXT,
  value_ty TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(key)
);

-- Pas de RLS sur interface_translations car accessible publiquement
-- Insérer quelques traductions de base
INSERT INTO interface_translations (key, value_fr, value_en, value_ty, category) VALUES
('site.title', 'Podsleek', 'Podsleek', 'Podsleek', 'general'),
('nav.products', 'Produits', 'Products', 'Fare', 'navigation'),
('nav.artists', 'Artistes', 'Artists', 'Tahu''a', 'navigation'),
('nav.about', 'À propos', 'About', 'No te mea nei', 'navigation'),
('button.login', 'Connexion', 'Login', 'Hohora''a', 'auth'),
('button.register', 'S''inscrire', 'Register', 'I''oa', 'auth'),
('button.logout', 'Déconnexion', 'Logout', 'Haapi''ira''a', 'auth'),
('product.price', 'Prix', 'Price', 'Tau', 'product'),
('product.add_to_cart', 'Ajouter au panier', 'Add to cart', 'Fa''a''ite i te ete', 'product'),
('common.loading', 'Chargement...', 'Loading...', 'Hora''a...', 'common'),
('common.save', 'Sauvegarder', 'Save', 'Fa''apapu', 'common'),
('common.cancel', 'Annuler', 'Cancel', 'Fa''a''ore', 'common'),
('common.delete', 'Supprimer', 'Delete', 'Ha''apa''o', 'common'),
('common.edit', 'Modifier', 'Edit', 'Fa''anahonaho', 'common');

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_interface_translations_updated_at
  BEFORE UPDATE ON interface_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
