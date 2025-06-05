
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import CopyButton from './CopyButton';

const RlsPoliciesTab = () => {
  const rlsPolicies = [
    {
      table: "product_templates",
      policies: [
        {
          name: "Public can view active templates",
          type: "SELECT",
          condition: "is_active = true",
          description: "Permet la lecture publique des gabarits actifs"
        },
        {
          name: "Super admins can manage all templates",
          type: "ALL",
          condition: "get_user_role(auth.uid()) = 'superAdmin'",
          description: "Super admins ont tous les droits sur les gabarits"
        }
      ]
    },
    {
      table: "print_products",
      policies: [
        {
          name: "Printers can view their products",
          type: "SELECT",
          condition: "printer_id = auth.uid() OR is_active = true",
          description: "Imprimeurs voient leurs produits + produits actifs publics"
        },
        {
          name: "Printers can manage their products",
          type: "ALL",
          condition: "printer_id = auth.uid()",
          description: "Imprimeurs peuvent CRUD leurs propres produits"
        }
      ]
    },
    {
      table: "creator_products",
      policies: [
        {
          name: "Creators can view their products",
          type: "SELECT",
          condition: "creator_id = auth.uid() OR is_published = true",
          description: "Créateurs voient leurs produits + produits publiés"
        },
        {
          name: "Creators can manage their products",
          type: "ALL",
          condition: "creator_id = auth.uid()",
          description: "Créateurs peuvent CRUD leurs propres produits"
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Policies Row Level Security (RLS)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">🔒 Importance Critique des Policies RLS</h4>
              <p className="text-sm text-red-700">
                Les policies RLS garantissent l'isolation des données entre utilisateurs. 
                Leur suppression ou modification accidentelle peut exposer des données privées.
              </p>
            </div>

            {rlsPolicies.map((tablePolicy) => (
              <div key={tablePolicy.table} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-600 mb-3">
                  Table: {tablePolicy.table}
                </h3>
                
                <div className="space-y-3">
                  {tablePolicy.policies.map((policy, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{policy.name}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {policy.type}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>Condition:</strong> <code className="bg-white px-1">{policy.condition}</code></div>
                        <div><strong>Description:</strong> {policy.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3">
                  <CopyButton text={`RLS Policies for ${tablePolicy.table}`} label={`Policies ${tablePolicy.table}`} />
                </div>
              </div>
            ))}

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Fonction get_user_role() Anti-Récursion</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Cette fonction SECURITY DEFINER évite les erreurs "infinite recursion detected in policy".
              </p>
              <pre className="bg-white p-2 rounded text-xs">
{`CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT CASE WHEN is_super_admin = true THEN 'superAdmin' ELSE role END 
          FROM public.users WHERE id = user_id);
END;
$$;`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RlsPoliciesTab;
