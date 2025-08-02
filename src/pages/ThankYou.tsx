import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  total_price: number;
  quantity: number;
  shipping_address: any;
  status: string;
  created_at: string;
}

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de votre commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Commande non trouvée</p>
            <Link to="/">
              <Button className="mt-4">Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Merci pour votre commande !
            </h1>
            <p className="text-muted-foreground">
              Votre commande a été reçue et est en cours de traitement.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails de la commande</span>
                <Badge variant="secondary">
                  {order.status === 'pending' ? 'En attente' : order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Numéro de commande</p>
                  <p className="font-medium">{order.id.substring(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Articles</p>
                  <p className="font-medium">{order.quantity} produit(s)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{order.total_price.toFixed(2)}€</p>
                </div>
              </div>

              {order.shipping_address && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Adresse de livraison</p>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <p className="font-medium">{order.shipping_address.name}</p>
                    {order.shipping_address.address && (
                      <p>{order.shipping_address.address}</p>
                    )}
                    {order.shipping_address.city && (
                      <p>
                        {order.shipping_address.postal_code} {order.shipping_address.city}
                      </p>
                    )}
                    <p>{order.shipping_address.country}</p>
                    <p className="text-muted-foreground">{order.shipping_address.email}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Étapes suivantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Confirmation par email</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un email de confirmation avec tous les détails.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Impression en cours</p>
                  <p className="text-sm text-muted-foreground">
                    Votre design est envoyé à l'imprimeur pour production.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Expédition</p>
                  <p className="text-sm text-muted-foreground">
                    Vous recevrez un numéro de suivi une fois l'article expédié.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Continuer mes achats
              </Button>
            </Link>
            <Button className="flex-1" disabled>
              <Mail className="w-4 h-4 mr-2" />
              Email de confirmation envoyé
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;