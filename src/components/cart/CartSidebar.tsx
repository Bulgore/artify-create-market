import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartButton } from './CartButton';

interface CartSidebarProps {
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ onCheckout }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCheckout = () => {
    setIsOpen(false);
    onCheckout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <CartButton onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Votre Panier</span>
            {state.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Vider
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Votre panier est vide</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="relative w-16 h-16">
                      <img
                        src={item.mockupUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      {item.designUrl && item.printArea && (
                        <img
                          src={item.designUrl}
                          alt="Design"
                          className="absolute object-contain"
                          style={{
                            left: `${(item.printArea.x / 500) * 100}%`,
                            top: `${(item.printArea.y / 500) * 100}%`,
                            width: `${(item.printArea.width / 500) * 100}%`,
                            height: `${(item.printArea.height / 500) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.price.toFixed(2)}€</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Badge variant="secondary" className="px-2">
                          {item.quantity}
                        </Badge>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.total.toFixed(2)}€</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Articles ({state.totalItems})</span>
                  <span>{state.totalPrice.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{state.totalPrice.toFixed(2)}€</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={state.items.length === 0}
                >
                  Procéder au paiement
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};