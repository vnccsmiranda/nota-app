"use client";

import { useState } from "react";
import { Users, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function formatCpfCnpj(value: string): string {
  if (value.length === 11) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

const mockCustomers = [
  {
    id: "1",
    cpfCnpj: "12345678901",
    name: "João da Silva",
    email: "joao@email.com",
    phone: "11999998888",
    isCompany: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    cpfCnpj: "98765432000199",
    name: "Tech Solutions LTDA",
    email: "contato@tech.com",
    phone: "1133334444",
    isCompany: true,
    createdAt: new Date().toISOString(),
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const customers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cpfCnpj.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Destinatários das suas notas fiscais.
          </p>
        </div>
        <Button className="gap-2">
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

      {/* Table */}
      {customers.length === 0 ? (
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
      ) : (
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
                  <td className="px-4 py-3 text-sm text-muted-foreground">{customer.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
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
