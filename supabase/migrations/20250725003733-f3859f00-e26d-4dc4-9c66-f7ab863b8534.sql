-- Corriger les statuts des produits pour les rendre visibles
UPDATE creator_products 
SET status = 'published' 
WHERE is_published = true AND status = 'draft';

-- Approuver les créateurs qui ont des produits et les rendre publics
UPDATE users 
SET 
  creator_status = 'approved',
  is_public_profile = true
WHERE role = 'créateur' 
  AND products_count > 0 
  AND creator_status = 'draft';

-- S'assurer que les créateurs sans produits mais avec des données peuvent être vus
UPDATE users 
SET is_public_profile = true,
    creator_status = 'approved'
WHERE role = 'créateur' 
  AND full_name_fr IS NOT NULL 
  AND full_name_fr != '';