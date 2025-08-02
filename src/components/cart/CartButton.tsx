import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ onClick }) => {
  const { state } = useCart();

  return (
    <Button
      variant="outline"
      size="sm"
      className="relative"
      onClick={onClick}
    >
      <ShoppingCart className="h-4 w-4" />
      {state.totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {state.totalItems}
        </Badge>
      )}
      <span className="ml-2 hidden sm:inline">
        Panier ({state.totalPrice.toFixed(2)}€)
      </span>
    </Button>
  );
};