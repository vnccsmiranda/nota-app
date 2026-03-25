"use client"

import * as React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { toast } from "sonner"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: {
    id: string
    code: string
    name: string
    description: string | null
    ncm: string | null
    cfop: string | null
    cst: string | null
    unit: string
    price: number
    gtin: string | null
    type: "PRODUCT" | "SERVICE"
    companyId: string
  } | null
  companyId: string
}

const productFormSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  ncm: z.string().optional(),
  cfop: z.string().optional(),
  cst: z.string().optional(),
  unit: z.string().min(1, "Unidade é obrigatória"),
  price: z.number().min(0, "Preço não pode ser negativo"),
  gtin: z.string().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]),
  companyId: z.string(),
})

type ProductFormData = z.infer<typeof productFormSchema>

const UNIT_OPTIONS = [
  { value: "UN", label: "Unidade (UN)" },
  { value: "KG", label: "Quilograma (KG)" },
  { value: "G", label: "Grama (G)" },
  { value: "L", label: "Litro (L)" },
  { value: "ML", label: "Mililitro (ML)" },
  { value: "M", label: "Metro (M)" },
  { value: "M2", label: "Metro Quadrado (M2)" },
  { value: "M3", label: "Metro Cúbico (M3)" },
  { value: "CX", label: "Caixa (CX)" },
  { value: "PC", label: "Peça (PC)" },
  { value: "HR", label: "Hora (HR)" },
  { value: "DIA", label: "Dia (DIA)" },
  { value: "MÊS", label: "Mês (MÊS)" },
  { value: "SV", label: "Serviço (SV)" },
]

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  companyId,
}: ProductFormDialogProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = React.useState<ProductFormData>({
    code: "",
    name: "",
    description: "",
    ncm: "",
    cfop: "",
    cst: "",
    unit: "UN",
    price: 0,
    gtin: "",
    type: "PRODUCT",
    companyId,
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [priceInput, setPriceInput] = React.useState("")

  React.useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || "",
        ncm: product.ncm || "",
        cfop: product.cfop || "",
        cst: product.cst || "",
        unit: product.unit,
        price: product.price,
        gtin: product.gtin || "",
        type: product.type,
        companyId: product.companyId,
      })
      setPriceInput(product.price.toFixed(2))
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        ncm: "",
        cfop: "",
        cst: "",
        unit: "UN",
        price: 0,
        gtin: "",
        type: "PRODUCT",
        companyId,
      })
      setPriceInput("")
    }
    setErrors({})
  }, [product, open])

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar produto")
      }
      return response.json()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await fetch(`/api/products/${product!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar produto")
      }
      return response.json()
    },
  })

  const isLoading = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const price = parseFloat(priceInput) || 0
      const dataToSubmit = {
        ...formData,
        price,
      }

      productFormSchema.parse(dataToSubmit)

      if (product) {
        await updateMutation.mutateAsync(dataToSubmit)
        queryClient.invalidateQueries({ queryKey: ["products"] })
        toast.success("Produto atualizado com sucesso!")
      } else {
        await createMutation.mutateAsync(dataToSubmit)
        queryClient.invalidateQueries({ queryKey: ["products"] })
        toast.success("Produto criado com sucesso!")
      }
      onOpenChange(false)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          const path = error.path.join(".")
          newErrors[path] = error.message
        })
        setErrors(newErrors)
      } else if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const handlePriceChange = (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, "")
    const normalized = cleaned.replace(",", ".")
    setPriceInput(normalized)
  }

  const unitLabel = UNIT_OPTIONS.find((u) => u.value === formData.unit)?.label || "Unidade"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto/Serviço" : "Novo Produto/Serviço"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex gap-2 rounded-lg border border-border p-1">
            {["PRODUCT", "SERVICE"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type: type as "PRODUCT" | "SERVICE",
                  }))
                }
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  formData.type === type
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {type === "PRODUCT" ? "Produto" : "Serviço"}
              </button>
            ))}
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código interno <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="PROD001"
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code}
                </div>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço unitário <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="price"
                  type="text"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0,00"
                  className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                />
              </div>
              {errors.price && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.price}
                </div>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Camiseta Estampada"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descrição adicional (opcional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unidade */}
            <div className="space-y-2">
              <Label htmlFor="unit">
                Unidade <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.unit} onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, unit: value }))
              }>
                <SelectTrigger id="unit" className={errors.unit ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.unit}
                </div>
              )}
            </div>

            {/* GTIN/EAN (para Produtos) */}
            {formData.type === "PRODUCT" && (
              <div className="space-y-2">
                <Label htmlFor="gtin">GTIN/EAN (Código de barras)</Label>
                <Input
                  id="gtin"
                  value={formData.gtin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gtin: e.target.value }))
                  }
                  placeholder="1234567890123"
                />
              </div>
            )}
          </div>

          {/* Product-specific fields */}
          {formData.type === "PRODUCT" && (
            <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
              {/* NCM */}
              <div className="space-y-2">
                <Label htmlFor="ncm">NCM (8 dígitos)</Label>
                <Input
                  id="ncm"
                  value={formData.ncm}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 8)
                    setFormData((prev) => ({ ...prev, ncm: value }))
                  }}
                  placeholder="61091000"
                  maxLength={8}
                />
              </div>

              {/* CFOP */}
              <div className="space-y-2">
                <Label htmlFor="cfop">CFOP (4 dígitos)</Label>
                <Input
                  id="cfop"
                  value={formData.cfop}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 4)
                    setFormData((prev) => ({ ...prev, cfop: value }))
                  }}
                  placeholder="5102"
                  maxLength={4}
                />
              </div>

              {/* CST ICMS */}
              <div className="space-y-2">
                <Label htmlFor="cst">CST ICMS</Label>
                <Input
                  id="cst"
                  value={formData.cst}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 3)
                    setFormData((prev) => ({ ...prev, cst: value }))
                  }}
                  placeholder="102"
                  maxLength={3}
                />
              </div>
            </div>
          )}

          {/* Service-specific fields */}
          {formData.type === "SERVICE" && (
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
              {/* CFOP */}
              <div className="space-y-2">
                <Label htmlFor="cfop-service">CFOP (4 dígitos)</Label>
                <Input
                  id="cfop-service"
                  value={formData.cfop}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 4)
                    setFormData((prev) => ({ ...prev, cfop: value }))
                  }}
                  placeholder="5933"
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground">
                  Ex: 5933 para serviços
                </p>
              </div>

              {/* LC116 Code */}
              <div className="space-y-2">
                <Label htmlFor="lc116">Código LC116 (opcional)</Label>
                <Input
                  id="lc116"
                  value={formData.cst}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cst: e.target.value }))
                  }
                  placeholder="LC116"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : product ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
