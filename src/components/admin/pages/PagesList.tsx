
import React from "react";
import { Edit, Trash, RefreshCw } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageData } from "@/types/pages";

interface PagesListProps {
  pages: PageData[];
  isLoading: boolean;
  onEdit: (page: PageData) => void;
  onDelete: (pageId: string) => void;
}

const PagesList: React.FC<PagesListProps> = ({ 
  pages, 
  isLoading, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Dernière mise à jour</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
              </TableCell>
            </TableRow>
          ) : pages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                Aucune page trouvée. Créez votre première page !
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>
                  {new Date(page.updated_at).toLocaleDateString()} {new Date(page.updated_at).toLocaleTimeString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onEdit(page)}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(page.id)}
                    title="Supprimer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PagesList;
