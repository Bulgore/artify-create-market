
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { calculateRawPrice, calculateFinalPrice } from "@/services/pricingService";
import { useAuth } from "@/contexts/AuthContext";
import { checkUserSubscription } from "@/services/pricingService";

interface PriceCalculatorProps {
  basePrice: number;
  margin: number;
  onMarginChange: (margin: number) => void;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ 
  basePrice, 
  margin, 
  onMarginChange 
}) => {
  const { user } = useAuth();
  const [commissionRate, setCommissionRate] = useState<number>(15);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  useEffect(() => {
    if (user) {
      checkUserSubscription(user.id).then(({ isSubscribed, commissionRate }) => {
        setIsSubscribed(isSubscribed);
        setCommissionRate(commissionRate);
      });
    }
  }, [user]);
  
  // Calculer les différents prix
  const subtotal = calculateRawPrice(basePrice, margin);
  const finalPrice = calculateFinalPrice(basePrice, margin, commissionRate);
  const platformFee = subtotal * (commissionRate / 100);
  
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="margin-slider" className="block mb-2">
              Votre marge ({margin.toFixed(2)}€)
            </Label>
            <Slider
              id="margin-slider"
              max={50}
              step={0.5}
              value={[margin]}
              onValueChange={(values) => onMarginChange(values[0])}
              className="mb-4"
            />
            <Input
              type="number"
              min={0}
              step={0.5}
              value={margin}
              onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)}
              className="mb-4"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Prix de base (imprimeur):</span>
              <span className="font-medium">{basePrice.toFixed(2)}€</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Votre marge:</span>
              <span className="font-medium">{margin.toFixed(2)}€</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                Commission Podsleek:
                {isSubscribed && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    Premium
                  </span>
                )}
              </span>
              <span className="font-medium">{platformFee.toFixed(2)}€ ({commissionRate}%)</span>
            </div>
            
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Prix final (client):</span>
              <span className="text-blue-600">{finalPrice.toFixed(2)}€</span>
            </div>
          </div>
          
          {!isSubscribed && (
            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              Économisez sur les commissions avec un abonnement Premium
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
