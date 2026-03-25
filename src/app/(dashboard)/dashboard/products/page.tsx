"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Package, Plus, Search, Pencil, Trash2, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { ProductFormDialog } from "@/components/products/product-form-dialog"
import { useActiveCompany } from "@/hooks/use-active-company"

interface Product {
  id: string
  code: string
  name: string
  ncm: string | null
  cfop: string | null
  cst: string | null
  unit: string
  price: number
  gtin: string | null
  type: "PRODUCT" | "SERVICE"
  companyId: string
  description: string | null
}

function ProductsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"ALL" | "PRODUCT" | "SERVICE">("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()
  const { activeCompanyId } = useActiveCompany()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", activeCompanyId, search, filter],
    queryFn: async () => {
      if (!activeCompanyId) return []

      const params = new URLSearchParams({
        companyId: activeCompanyId,
        ...(search && { search }),
        ...(filter !== "ALL" && { type: filter }),
      })

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error("Failed to fetch products")
      return response.json() as Promise<Product[]>
    },
    enabled: !!activeCompanyId,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete product")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Produto deletado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao deletar produto")
    },
  })

  const duplicateMutation = useMutation({
    mutationFn: async (product: Product) => {
      const newProduct = {
        ...product,
        id: undefined,
        code: `${product.code}-CÓPIA`,
        name: `${product.name} (cópia)`,
        companyId: activeCompanyId,
      }
      delete (newProduct as any).id

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
      if (!response.ok) throw new Error("Failed to duplicate product")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Produto duplicado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao duplicar produto")
    },
  })

  const handleDeleteClick = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleDuplicate = (product: Product) => {
    duplicateMutation.mutate(product)
  }

  const handleOpenDialog = (product?: Product) => {
    setSelectedProduct(product || null)
    setDialogOpen(true)
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
    const matchType = filter === "ALL" || p.type === filter
    return matchSearch && matchType
  })

  if (!activeCompanyId) {
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
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Selecione uma empresa
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione uma empresa no menu superior para continuar.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
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
              {type === "ALL"
                ? "Todos"
                : type === "PRODUCT"
                  ? "Produtos"
                  : "Serviços"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProductsSkeleton />
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhum item encontrado
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || filter !== "ALL"
                ? "Nenhum produto corresponde aos filtros aplicados."
                : "Cadastre produtos e serviços para usar na emissão de notas."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  NCM
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  CFOP
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Unidade
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Preço
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {product.code}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        product.type === "PRODUCT" ? "default" : "secondary"
                      }
                    >
                      {product.type === "PRODUCT" ? "Produto" : "Serviço"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {product.ncm || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {product.cfop || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {product.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Duplicar"
                        onClick={() => handleDuplicate(product)}
                        disabled={duplicateMutation.isPending}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Editar"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        title="Deletar"
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={deleteMutation.isPending}
                      >
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

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        companyId={activeCompanyId || ""}
      />
    </div>
  )
}
