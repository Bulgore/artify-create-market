
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
    isSuperAdmin: isSuperAdmin()
  });

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Vous devez être connecté pour accéder à cette page</p>
        </CardContent>
      </Card>
    );
  }

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-gray-500">Accès refusé - Réservé aux super administrateurs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <TemplatesHeader onCreateTemplate={openCreateDialog} />
        <CardContent>
          <TemplatesGrid
            templates={templates}
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
};

export default TemplatesManagement;
