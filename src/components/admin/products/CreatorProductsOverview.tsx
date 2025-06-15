
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User2, Search } from "lucide-react";

interface CreatorProduct {
  id: string;
  name: string;
  preview_url: string | null;
  is_published: boolean;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  created_at: string;
}

const CreatorProductsOverview: React.FC = () => {
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllCreatorProducts();
  }, []);

  const fetchAllCreatorProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("creator_products")
      .select("id, name_fr, preview_url, is_published, creator_id, created_at, users(full_name_fr, avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setProducts(
      (data || []).map((p: any) => ({
        id: p.id,
        name: p.name_fr ?? "",
        preview_url: p.preview_url ?? "",
        is_published: p.is_published,
        creator_id: p.creator_id,
        creator_name: p.users?.full_name_fr ?? "Inconnu",
        creator_avatar: p.users?.avatar_url ?? null,
        created_at: p.created_at,
      }))
    );
    setIsLoading(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.creator_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User2 className="h-6 w-6" />
          Modération — Tous les produits créateurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Rechercher par créateur ou nom de produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96"
          />
          <Button variant="outline" onClick={fetchAllCreatorProducts}>
            <Search className="h-4 w-4 mr-1" />
            Actualiser
          </Button>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Créateur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.preview_url ? (
                          <img src={product.preview_url} alt={product.name} className="h-10 w-10 rounded object-cover border" />
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 border rounded" />
                        )}
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={product.creator_avatar ?? undefined} />
                          <AvatarFallback>
                            {product.creator_name?.charAt(0).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span>{product.creator_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.is_published ? (
                        <span className="text-green-600 font-semibold">Publié</span>
                      ) : (
                        <span className="text-orange-600">Brouillon</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(product.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorProductsOverview;
