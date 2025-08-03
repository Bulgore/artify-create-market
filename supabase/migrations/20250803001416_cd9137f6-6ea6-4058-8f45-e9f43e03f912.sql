-- Update orders table to support e-commerce items
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;

-- Update existing policies for orders to support guest checkouts
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;
CREATE POLICY "Service role can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);