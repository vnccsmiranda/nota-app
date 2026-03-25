"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerFormDialog } from "@/components/customers/customer-form-dialog";

function formatCpfCnpj(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

function formatPhone(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

interface Customer {
  id: string;
  cpfCnpj: string;
  name: string;
  email?: string;
  phone?: string;
  ie?: string;
  isCompany: boolean;
  createdAt: string;
  address?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  companyId: string;
}

function getActiveCompanyFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "activeCompany") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [activeCompany, setActiveCompany] = useState<string | null>(null);

  useEffect(() => {
    const company = getActiveCompanyFromCookie();
    setActiveCompany(company);
  }, []);

  const queryClient = useQueryClient();

  const { data: customers = [], isLoading, error } = useQuery<Customer[]>({
    queryKey: ["customers", activeCompany, search],
    queryFn: async () => {
      if (!activeCompany) return [];
      const params = new URLSearchParams({
        companyId: activeCompany,
        ...(search ? { search } : {}),
      });
      const response = await fetch(`/api/customers?${params}`);
      if (!response.ok) {
        throw new Error("Erro ao carregar clientes");
      }
      return response.json();
    },
    enabled: !!activeCompany,
  });

  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation({
    mutationFn: async (customerId: string) => {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar cliente");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente deletado com sucesso");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erro ao deletar cliente");
    },
  });

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm("Tem certeza que deseja deletar este cliente?")) {
      deleteCustomer(customerId);
    }
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(undefined);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedCustomer(undefined);
    }
  };

  if (!activeCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Destinatários das suas notas fiscais.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhuma empresa selecionada
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione uma empresa para visualizar seus clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        customer={selectedCustomer}
        companyId={activeCompany}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Destinatários das suas notas fiscais.
          </p>
        </div>
        <Button className="gap-2" onClick={handleNewCustomer}>
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou CPF/CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CPF/CNPJ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Telefone</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-6 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-8 w-16 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && customers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhum cliente encontrado
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre clientes para emitir notas fiscais para eles.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && customers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CPF/CNPJ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Telefone</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {formatCpfCnpj(customer.cpfCnpj)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={customer.isCompany ? "default" : "secondary"}>
                      {customer.isCompany ? "PJ" : "PF"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {customer.phone ? formatPhone(customer.phone) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        disabled={isDeleting}
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

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-8 text-destructive">
            <p>Erro ao carregar clientes. Tente novamente.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
