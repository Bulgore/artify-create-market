import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  onSuccess: (orderId: string) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { state, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.email || !customerInfo.name) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order in database first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_price: state.totalPrice,
          quantity: state.totalItems,
          size: 'M', // Default size for now
          shipping_address: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: customerInfo.address,
            city: customerInfo.city,
            postal_code: customerInfo.postalCode,
            country: customerInfo.country,
          },
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          orderId: orderData.id,
          items: state.items,
          customerInfo,
          totalAmount: Math.round(state.totalPrice * 100), // Convert to cents
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Clear cart and redirect to success page
        clearCart();
        onSuccess(orderData.id);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement de votre commande",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Jean Dupont"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={customerInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="123 Rue de la Paix"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={customerInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Paris"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={customerInfo.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="75000"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              value={customerInfo.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="France"
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de la commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.mockupUrl}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{item.total.toFixed(2)}€</p>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{state.totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{state.totalPrice.toFixed(2)}€</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading || state.items.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Payer avec Stripe'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};