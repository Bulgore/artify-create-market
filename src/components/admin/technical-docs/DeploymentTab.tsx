
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CopyButton from './CopyButton';

const DeploymentTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scripts et Déploiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Commandes de Développement</h3>
              <pre className="bg-gray-50 p-4 rounded text-sm">
{`# Installation locale
npm install

# Serveur de développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint`}
              </pre>
              <CopyButton text="npm install && npm run dev" label="Commandes dev" />
            </div>

            <div>
              <h3 className="font-medium mb-2">Déploiement Lovable</h3>
              <p className="text-sm text-gray-600 mb-2">
                Le projet est automatiquement déployé via Lovable lors des modifications.
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Bouton "Publish" dans l'interface Lovable</li>
                <li>URL de production générée automatiquement</li>
                <li>Intégration GitHub optionnelle pour versioning</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Migration Base de Données</h3>
              <p className="text-sm text-gray-600 mb-2">
                Les migrations SQL sont gérées via l'interface Supabase :
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>SQL Editor dans le dashboard Supabase</li>
                <li>Backup automatique avant modifications</li>
                <li>Rollback possible via snapshots</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentTab;
