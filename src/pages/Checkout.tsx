import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCart } from '@/contexts/CartContext';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();

  React.useEffect(() => {
    if (state.items.length === 0) {
      navigate('/');
    }
  }, [state.items.length, navigate]);

  const handleSuccess = (orderId: string) => {
    navigate(`/thank-you?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Finaliser votre commande</h1>
          <CheckoutForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;