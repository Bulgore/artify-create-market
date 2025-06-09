
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, CheckCircle } from 'lucide-react';

interface OnboardingBannerProps {
  productsCount: number;
  creatorStatus: string;
}

const OnboardingBanner: React.FC<OnboardingBannerProps> = ({ productsCount, creatorStatus }) => {
  const navigate = useNavigate();
  const requiredProducts = 3;
  const remainingProducts = Math.max(0, requiredProducts - productsCount);

  if (creatorStatus === 'approved') {
    return null; // Masquer le bandeau si le créateur est approuvé
  }

  const getStatusMessage = () => {
    if (productsCount < requiredProducts) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
        title: `Il vous manque ${remainingProducts} produit${remainingProducts > 1 ? 's' : ''} pour la validation`,
        description: `Créez ${remainingProducts} produit${remainingProducts > 1 ? 's' : ''} de qualité supplémentaire${remainingProducts > 1 ? 's' : ''} pour soumettre votre profil à validation.`,
        bgColor: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-800',
        buttonText: 'Créer un produit',
        action: () => navigate('/studio') // Aller à l'onglet création de produits
      };
    } else if (creatorStatus === 'draft') {
      return {
        icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
        title: 'Prêt pour la validation !',
        description: 'Vous avez créé 3 produits. Vous pouvez maintenant soumettre votre profil pour validation.',
        bgColor: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-800',
        buttonText: 'Soumettre pour validation',
        action: () => {
          // Logique de soumission pour validation
          console.log('Soumettre pour validation');
        }
      };
    } else if (creatorStatus === 'pending') {
      return {
        icon: <CheckCircle className="h-5 w-5 text-yellow-500" />,
        title: 'Validation en cours',
        description: 'Votre profil et vos produits sont en cours de validation par notre équipe.',
        bgColor: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-800',
        buttonText: null,
        action: null
      };
    }

    return null;
  };

  const statusInfo = getStatusMessage();
  if (!statusInfo) return null;

  return (
    <Card className={`mb-6 ${statusInfo.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {statusInfo.icon}
          <div className="flex-1">
            <h3 className={`font-semibold ${statusInfo.textColor}`}>
              {statusInfo.title}
            </h3>
            <p className={`text-sm mt-1 ${statusInfo.textColor}`}>
              {statusInfo.description}
            </p>
            {productsCount < requiredProducts && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className={statusInfo.textColor}>Progression :</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(productsCount / requiredProducts) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${statusInfo.textColor}`}>
                    {productsCount}/{requiredProducts}
                  </span>
                </div>
              </div>
            )}
          </div>
          {statusInfo.buttonText && statusInfo.action && (
            <Button
              onClick={statusInfo.action}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {statusInfo.buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingBanner;
