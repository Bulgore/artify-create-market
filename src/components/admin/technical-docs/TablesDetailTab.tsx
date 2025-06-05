
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Table as TableIcon } from 'lucide-react';
import CopyButton from './CopyButton';

const TablesDetailTab = () => {
  const tablesSchema = [
    {
      name: "users",
      description: "Table principale des utilisateurs avec rôles et permissions",
      columns: [
        { name: "id", type: "uuid", constraint: "PK, FK auth.users", description: "Identifiant unique" },
        { name: "full_name", type: "text", constraint: "nullable", description: "Nom complet utilisateur" },
        { name: "role", type: "text", constraint: "NOT NULL", description: "Rôle : créateur, imprimeur, admin, superAdmin" },
        { name: "is_super_admin", type: "boolean", constraint: "DEFAULT false", description: "Flag super administrateur" },
        { name: "avatar_url", type: "text", constraint: "nullable", description: "URL photo de profil" },
        { name: "default_commission", type: "numeric(5,2)", constraint: "DEFAULT 15.00", description: "Commission par défaut %" },
        { name: "created_at", type: "timestamptz", constraint: "DEFAULT now()", description: "Date de création" },
        { name: "updated_at", type: "timestamptz", constraint: "DEFAULT now()", description: "Dernière modification" }
      ]
    },
    {
      name: "product_templates",
      description: "Gabarits de produits créés par les super admins",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du gabarit" },
        { name: "type", type: "text", constraint: "NOT NULL", description: "Type de produit (t-shirt, tote-bag...)" },
        { name: "design_area", type: "jsonb", constraint: "NOT NULL", description: "Zone d'impression {x,y,width,height}" },
        { name: "mockup_area", type: "jsonb", constraint: "nullable", description: "Zone du mockup {x,y,width,height}" },
        { name: "svg_file_url", type: "text", constraint: "NOT NULL", description: "URL du fichier SVG gabarit" },
        { name: "mockup_image_url", type: "text", constraint: "NOT NULL", description: "URL image de présentation" },
        { name: "available_positions", type: "text[]", constraint: "DEFAULT ['face']", description: "Positions d'impression disponibles" },
        { name: "available_colors", type: "text[]", constraint: "DEFAULT ['white']", description: "Couleurs disponibles" },
        { name: "technical_instructions", type: "text", constraint: "nullable", description: "Instructions techniques impression" },
        { name: "is_active", type: "boolean", constraint: "DEFAULT true", description: "Statut actif/inactif" },
        { name: "created_by", type: "uuid", constraint: "FK users(id)", description: "Créateur du gabarit" }
      ]
    },
    {
      name: "print_products",
      description: "Produits créés par les imprimeurs basés sur des gabarits",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "printer_id", type: "uuid", constraint: "FK users(id)", description: "Propriétaire imprimeur" },
        { name: "template_id", type: "uuid", constraint: "FK product_templates(id)", description: "Gabarit utilisé" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du produit" },
        { name: "description", type: "text", constraint: "nullable", description: "Description détaillée" },
        { name: "base_price", type: "numeric(10,2)", constraint: "NOT NULL", description: "Prix de base imprimeur" },
        { name: "material", type: "text", constraint: "NOT NULL", description: "Matériau du produit" },
        { name: "available_sizes", type: "text[]", constraint: "NOT NULL", description: "Tailles disponibles" },
        { name: "available_colors", type: "text[]", constraint: "NOT NULL", description: "Couleurs disponibles" },
        { name: "images", type: "text[]", constraint: "NOT NULL", description: "URLs des images produit" },
        { name: "print_areas", type: "jsonb", constraint: "DEFAULT '{}'", description: "Zones d'impression configurées" },
        { name: "stock_quantity", type: "integer", constraint: "DEFAULT 0", description: "Quantité en stock" },
        { name: "is_active", type: "boolean", constraint: "DEFAULT true", description: "Produit actif/inactif" }
      ]
    },
    {
      name: "creator_products",
      description: "Produits finaux créés par les créateurs avec leurs designs",
      columns: [
        { name: "id", type: "uuid", constraint: "PK", description: "Identifiant unique" },
        { name: "creator_id", type: "uuid", constraint: "FK users(id)", description: "Créateur du produit" },
        { name: "print_product_id", type: "uuid", constraint: "FK print_products(id)", description: "Produit de base utilisé" },
        { name: "name", type: "text", constraint: "NOT NULL", description: "Nom du produit final" },
        { name: "description", type: "text", constraint: "nullable", description: "Description marketing" },
        { name: "design_data", type: "jsonb", constraint: "DEFAULT '{}'", description: "Données du design {url,position,size}" },
        { name: "creator_margin_percentage", type: "numeric(5,2)", constraint: "DEFAULT 20", description: "Marge créateur en %" },
        { name: "preview_url", type: "text", constraint: "nullable", description: "URL aperçu produit fini" },
        { name: "is_published", type: "boolean", constraint: "DEFAULT false", description: "Produit publié/brouillon" }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Structure Détaillée des Tables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tablesSchema.map((table) => (
              <div key={table.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-600">{table.name}</h3>
                  <CopyButton text={`Table: ${table.name}`} label={`Schema ${table.name}`} />
                </div>
                <p className="text-sm text-gray-600 mb-4">{table.description}</p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colonne</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contraintes</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.columns.map((column) => (
                      <TableRow key={column.name}>
                        <TableCell className="font-mono text-sm">{column.name}</TableCell>
                        <TableCell className="font-mono text-sm text-blue-600">{column.type}</TableCell>
                        <TableCell className="text-sm">{column.constraint}</TableCell>
                        <TableCell className="text-sm">{column.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TablesDetailTab;
