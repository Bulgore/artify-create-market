-- Nettoyage des anciens mockups en blob
UPDATE public.product_mockups
SET mockup_url = NULL
WHERE mockup_url LIKE 'blob:%';
