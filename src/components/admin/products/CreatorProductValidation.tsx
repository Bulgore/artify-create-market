
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Eye, Check, X, AlertTriangle } from 'lucide-react';
import { CreatorProductPreview } from './CreatorProductPreview';

interface CreatorProduct {
  id: string;
  name_fr: string;
  description_fr: string;
  preview_url: string;
  original_design_url: string;
  design_file_info: any;
  status: string;
  creator_id: string;
  created_at: string;
  users: {
    full_name_fr: string;
    email: string;
  };
}

export const CreatorProductValidation: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewingProduct, setPreviewingProduct] = useState<string | null>(null);

  const fetchPendingProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('creator_products')
        .select(`
          id,
          name_fr,
          description_fr,
          preview_url,
          original_design_url,
          design_file_info,
          status,
          creator_id,
          created_at,
          users!creator_id (
            full_name_fr,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching pending products:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits en attente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProductStatus = async (productId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const { error } = await supabase
        .from('creator_products')
        .update({ 
          status,
          ...(status === 'rejected' && { rejection_reason: reason })
        })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: status === 'approved' ? "Produit approuvé" : "Produit rejeté",
        description: `Le produit a été ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`,
      });

      fetchPendingProducts();
    } catch (error: any) {
      console.error('Error updating product status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du produit.",
      });
    }
  };

  const downloadDesignFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-500">Chargement des produits en attente...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            Validation des Produits Créateurs
            <Badge variant="secondary">{products.length} en attente</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Check className="h-12 w-12 mx-auto mb-4 text-green-300" />
              <p>Aucun produit en attente de validation</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Créateur</TableHead>
                    <TableHead>Fichier HD</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.preview_url ? (
                            <img 
                              src={product.preview_url} 
                              alt={product.name_fr} 
                              className="h-12 w-12 rounded object-cover border" 
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 border rounded" />
                          )}
                          <div>
                            <p className="font-medium">{product.name_fr}</p>
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">
                              {product.description_fr}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.users?.full_name_fr}</p>
                          <p className="text-sm text-gray-500">{product.users?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.original_design_url ? (
                          <div className="space-y-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDesignFile(
                                product.original_design_url,
                                `design_${product.id}.jpg`
                              )}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Télécharger
                            </Button>
                            {product.design_file_info && (
                              <div className="text-xs text-gray-500">
                                {formatFileSize(product.design_file_info.size || 0)}
                                <br />
                                {product.design_file_info.type || 'N/A'}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">En attente</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(product.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewingProduct(product.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Aperçu
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateProductStatus(product.id, 'approved')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              const reason = prompt('Motif de rejet (optionnel):');
                              updateProductStatus(product.id, 'rejected', reason || undefined);
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {previewingProduct && (
        <CreatorProductPreview
          productId={previewingProduct}
          onClose={() => setPreviewingProduct(null)}
        />
      )}
    </div>
  );
};
