
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplates } from "@/hooks/useTemplates";
import TemplatesGrid from "./templates/TemplatesGrid";
import TemplateDialog from "./templates/TemplateDialog";
import TemplatesHeader from "./templates/TemplatesHeader";

const TemplatesManagement = () => {
  const { isSuperAdmin, user } = useAuth();
  const {
    templates,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingTemplate,
    formData,
    setFormData,
    handleSaveTemplate,
    handleDeleteTemplate,
    openEditDialog,
    openCreateDialog
  } = useTemplates();

  console.log('🔐 TemplatesManagement - User auth state:', {
    user: user?.id,
    isSuperAdmin: isSuperAdmin(),
    templates: templates?.length || 0
  });

  // Vérifications d'authentification avec gestion d'erreur
  if (!user) {
    console.log('❌ No user - showing login required message');
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Vous devez être connecté pour accéder à cette page</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSuperAdmin()) {
    console.log('❌ User is not super admin - showing access denied');
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Accès refusé - Réservé aux super administrateurs</p>
        </CardContent>
      </Card>
    );
  }

  console.log('✅ User authenticated and authorized, rendering templates management');

  try {
    return (
      <div className="space-y-6">
        <Card>
          <TemplatesHeader onCreateTemplate={openCreateDialog} />
          <CardContent>
            <TemplatesGrid
              templates={templates || []}
              isLoading={isLoading}
              onEditTemplate={openEditDialog}
              onDeleteTemplate={handleDeleteTemplate}
            />
          </CardContent>
        </Card>

        <TemplateDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          editingTemplate={editingTemplate}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveTemplate}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ Error rendering TemplatesManagement:', error);
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-red-500">Erreur lors du chargement de la page des gabarits</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez rafraîchir la page</p>
        </CardContent>
      </Card>
    );
  }
};

export default TemplatesManagement;
