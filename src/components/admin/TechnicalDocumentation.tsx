import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TechnicalDocumentationHeader from './technical-docs/TechnicalDocumentationHeader';
import OverviewTab from './technical-docs/OverviewTab';
import DatabaseSchemaTab from './technical-docs/DatabaseSchemaTab';
import TablesDetailTab from './technical-docs/TablesDetailTab';
import RlsPoliciesTab from './technical-docs/RlsPoliciesTab';
import SqlQueriesTab from './technical-docs/SqlQueriesTab';
import WorkflowsTab from './technical-docs/WorkflowsTab';
import MigrationTab from './technical-docs/MigrationTab';
import DeploymentTab from './technical-docs/DeploymentTab';
import VigilanceTab from './technical-docs/VigilanceTab';

const TechnicalDocumentation = () => {
  const { toast } = useToast();

  const exportDocumentation = () => {
    const markdownContent = generateMarkdownDoc();
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'podsleek-documentation-technique-complete-v1.2.1.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Documentation exportée",
      description: "Le fichier documentation technique complète v1.2.1 a été téléchargé",
    });
  };

  const generateMarkdownDoc = () => {
    return `# Podsleek - Documentation Technique Complète v1.2.1

**Date de génération**: ${new Date().toLocaleDateString('fr-FR')}  
**Version**: 1.2.1 — Correctif priorité super admin  
**Maintenu par**: Équipe Podsleek  
**Niveau**: Production

## 🗒️ Changelog & Suivi Incident Critique

- **15/06/2025 \[RESOLU CRITIQUE]**  
  **Bug découvert** : Un super admin connecté arrivait par défaut sur \`/studio\` et non \`/admin\` — ce qui empêchait l’accès direct à l’admin dès login.  
  **Correctif** : Ajout d’une redirection immédiate dans la page \`/studio\` : tout super admin est maintenant automatiquement envoyé sur \`/admin\` dès connexion.  
  **À tester** :  
    \`1.\` Se connecter avec un compte super admin.  
    \`2.\` Vérifier qu’on est bien redirigé vers l’espace admin \`/admin\` et pas vers \`/studio\`.  
    \`3.\` Tester logout/login pour s’assurer de la robustesse du correctif.

- ... (historique existant ou autres incidents à compléter)

---

## 🦾 Suivi Incident & Correction : Accès super admin

- **Problème rencontré** : À la connexion d'un compte super admin, la page \`/studio\` s’affichait au lieu de la \`/admin\`.  
- **Impact** : Bloquant pour l’accès rapide à la console d’administration, gênant pour le lancement et la supervision des workflows globaux.
- **Correction** :  
  \`\`\`tsx
  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin && isSuperAdmin()) {
        navigate('/admin');
        return;
      }
    }
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate, isSuperAdmin]);
  \`\`\`
- **Recommandation** : Tester l’accès admin après chaque déploiement, lister ici tout nouveau bug critique et la date/solution associée.
---

Version documentation : 1.2.1 — Dernière mise à jour : ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <div className="space-y-6">
      <TechnicalDocumentationHeader onExport={exportDocumentation} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="schema">Schéma BD</TabsTrigger>
          <TabsTrigger value="tables">Tables Détail</TabsTrigger>
          <TabsTrigger value="rls">Policies RLS</TabsTrigger>
          <TabsTrigger value="queries">Requêtes SQL</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="migration">Migration</TabsTrigger>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          <TabsTrigger value="vigilance">Vigilance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-green-800">🆕 MISE À JOUR v1.2.0 - Structure Étendue</h3>
            <pre className="text-sm overflow-x-auto">
{`src/
├── components/
│   ├── admin/           # Interface administration
│   │   ├── layout/      # Layout admin
│   │   ├── content/     # Gestion contenu
│   │   ├── pricing/     # Gestion prix
│   │   ├── templates/   # Gestion gabarits
│   │   ├── users/       # 🆕 Gestion utilisateurs (NOUVEAU v1.2.0)
│   │   │   ├── UserCard.tsx           # Carte utilisateur
│   │   │   ├── UserActions.tsx        # Actions utilisateur
│   │   │   ├── UserSearch.tsx         # Recherche utilisateurs
│   │   │   ├── UserResetDialog.tsx    # 🆕 Dialog réinitialisation
│   │   │   └── UserDeleteDialog.tsx   # Dialog suppression
│   │   └── technical-docs/ # Documentation technique
│   ├── creator/         # Studio créateur
│   │   ├── design-positioner/  # Positionnement designs
│   │   ├── design-uploader/    # Upload designs
│   │   └── onboarding/  # 🆕 Onboarding créateur (NOUVEAU v1.2.0)
│   ├── printer/         # Studio imprimeur
│   ├── ui/             # Composants UI de base
│   │   ├── MultilingualInput.tsx  # 🆕 Input multilingue (NOUVEAU v1.2.0)
│   │   └── LanguageSelector.tsx   # 🆕 Sélecteur langue (NOUVEAU v1.2.0)
│   └── content/        # Rendu contenu dynamique
├── hooks/              # Hooks personnalisés
│   └── useUsersManagement.ts  # 🆕 Hook gestion utilisateurs (NOUVEAU v1.2.0)
├── services/           # Services API
│   └── authService.ts  # 🔄 Service auth amélioré (MISE À JOUR v1.2.0)
├── contexts/           # Contexts React
│   ├── AuthContext.tsx # 🔄 Context auth avec logs (MISE À JOUR v1.2.0)
│   └── LanguageContext.tsx # 🆕 Context multilingue (NOUVEAU v1.2.0)
├── types/              # Types TypeScript
├── utils/              # Fonctions utilitaires
├── pages/              # Pages principales
│   ├── Admin.tsx       # 🔄 Page admin améliorée (MISE À JOUR v1.2.0)
│   └── CreatorOnboarding.tsx # 🆕 Onboarding créateur (NOUVEAU v1.2.0)
└── integrations/       # Intégrations Supabase`}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <DatabaseSchemaTab />
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <TablesDetailTab />
        </TabsContent>

        <TabsContent value="rls" className="space-y-4">
          <RlsPoliciesTab />
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <SqlQueriesTab />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <WorkflowsTab />
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <MigrationTab />
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <DeploymentTab />
        </TabsContent>

        <TabsContent value="vigilance" className="space-y-4">
          <VigilanceTab />
        </TabsContent>
      </Tabs>

      <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-lg border border-orange-200">
        <p className="text-sm text-gray-700">
          <strong className="text-green-600">🆕 Version 1.2.1</strong> • 
          <strong> Dernière mise à jour</strong>: ${new Date().toLocaleDateString('fr-FR')} • 
          <strong> Maintenu par</strong>: Équipe Podsleek • 
          <strong> Documentation</strong>: Niveau Production • 
          <strong className="text-red-600"> Export PDF Disponible</strong>
        </p>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
