
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow } from 'lucide-react';

const WorkflowsTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Workflows Principaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-600">Workflow Créateur</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Inscription/Connexion avec rôle "créateur"</li>
              <li>Navigation vers Studio Créateur</li>
              <li>Sélection d'un produit existant (print_product)</li>
              <li>Upload d'un fichier design (image/svg)</li>
              <li>Positionnement automatique selon design_area du gabarit</li>
              <li>Ajustement manuel position/taille dans la zone bleue</li>
              <li>Configuration nom, description, marge créateur</li>
              <li>Aperçu temps réel sur mockup produit</li>
              <li>Publication du produit (creator_product)</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600">Workflow Imprimeur</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Inscription/Connexion avec rôle "imprimeur"</li>
              <li>Navigation vers Studio Imprimeur</li>
              <li>Sélection d'un gabarit existant (product_template)</li>
              <li>Création nouveau produit avec prix de base</li>
              <li>Configuration matériau, tailles, couleurs disponibles</li>
              <li>Upload images produit</li>
              <li>Définition stock et activation</li>
              <li>Gestion des commandes reçues</li>
              <li>Mise à jour statuts commandes</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-600">Workflow Super Admin</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Accès interface admin avec tous les droits</li>
              <li>Gestion utilisateurs (modification rôles, suspension)</li>
              <li>Création/modification gabarits produits</li>
              <li>Configuration zones d'impression et mockups</li>
              <li>Gestion contenus et pages dynamiques</li>
              <li>Surveillance statistiques et commandes</li>
              <li>Configuration paramètres globaux</li>
              <li>Maintenance technique et debugging</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowsTab;
