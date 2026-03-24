"use client";

import { useState } from "react";
import { Package, Plus, Search, Pencil, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const mockProducts = [
  {
    id: "1",
    code: "PROD001",
    name: "Camiseta Estampada",
    ncm: "61091000",
    cfop: "5102",
    cst: "102",
    unit: "UN",
    price: 59.9,
    type: "PRODUCT" as const,
  },
  {
    id: "2",
    code: "SERV001",
    name: "Consultoria Tributária",
    ncm: "",
    cfop: "5933",
    cst: "102",
    unit: "HR",
    price: 200.0,
    type: "SERVICE" as const,
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PRODUCT" | "SERVICE">("ALL");

  const products = mockProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "ALL" || p.type === filter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Produtos e Serviços
          </h1>
          <p className="text-sm text-muted-foreground">
            Itens utilizados na emissão de notas fiscais.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {(["ALL", "PRODUCT", "SERVICE"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "ALL" ? "Todos" : type === "PRODUCT" ? "Produtos" : "Serviços"}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhum item encontrado
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre produtos e serviços para usar na emissão de notas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Código</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">NCM</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CFOP</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Unidade</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Preço</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{product.code}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{product.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={product.type === "PRODUCT" ? "default" : "secondary"}>
                      {product.type === "PRODUCT" ? "Produto" : "Serviço"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{product.ncm || "—"}</td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{product.cfop || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{product.unit}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Duplicar">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
