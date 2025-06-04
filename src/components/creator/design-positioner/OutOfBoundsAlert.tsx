
import React from 'react';

interface OutOfBoundsAlertProps {
  isOutOfBounds: boolean;
}

export const OutOfBoundsAlert: React.FC<OutOfBoundsAlertProps> = ({ isOutOfBounds }) => {
  if (!isOutOfBounds) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-center gap-2 text-red-700">
        <span className="text-lg">⚠️</span>
        <div>
          <p className="font-medium">Design hors de la zone d'impression</p>
          <p className="text-sm">Veuillez repositionner votre design dans la zone bleue délimitée.</p>
        </div>
      </div>
    </div>
  );
};
