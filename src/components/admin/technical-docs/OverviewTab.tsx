
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const OverviewTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Présentation Générale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Objectifs du projet</h3>
            <p className="text-gray-700">
              Podsleek est une plateforme de print-on-demand permettant aux créateurs de designer des produits personnalisés 
              (t-shirts, tote bags, etc.) et aux imprimeurs de proposer leurs services et produits.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Contexte d'usage</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Créateurs</strong> : uploadent des designs, les positionnent sur des produits, définissent leurs marges</li>
              <li><strong>Imprimeurs</strong> : ajoutent leurs produits, définissent les zones d'impression, gèrent les commandes</li>
              <li><strong>Super Admin</strong> : gère les utilisateurs, templates, contenus et paramètres globaux</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Stack Technique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Vite (bundler)</li>
                  <li>• Tailwind CSS + Shadcn/UI</li>
                  <li>• Framer Motion</li>
                  <li>• React Router DOM</li>
                  <li>• Tanstack Query</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supabase (BaaS)</li>
                  <li>• PostgreSQL</li>
                  <li>• Auth & Storage</li>
                  <li>• Edge Functions</li>
                  <li>• Row Level Security</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
