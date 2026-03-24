"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  XCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const modelLabels: Record<string, string> = {
  NFE_55: "NF-e",
  NFCE_65: "NFC-e",
  NFSE: "NFS-e",
};

const statusConfig: Record<string, { label: string; variant: "authorized" | "rejected" | "pending" | "draft" | "cancelled" }> = {
  DRAFT: { label: "Rascunho", variant: "draft" },
  PENDING: { label: "Pendente", variant: "pending" },
  AUTHORIZED: { label: "Autorizada", variant: "authorized" },
  REJECTED: { label: "Rejeitada", variant: "rejected" },
  CANCELLED: { label: "Cancelada", variant: "cancelled" },
  CONTINGENCY: { label: "Contingência", variant: "pending" },
};

const mockInvoices = [
  {
    id: "1",
    model: "NFE_55",
    number: 1,
    status: "AUTHORIZED",
    totalValue: 1500.0,
    customer: { name: "Tech Solutions LTDA", cpfCnpj: "98765432000199" },
    createdAt: new Date().toISOString(),
    protocol: "135792468001234",
  },
  {
    id: "2",
    model: "NFCE_65",
    number: 1,
    status: "DRAFT",
    totalValue: 299.9,
    customer: { name: "João da Silva", cpfCnpj: "12345678901" },
    createdAt: new Date().toISOString(),
    protocol: null,
  },
  {
    id: "3",
    model: "NFSE",
    number: 1,
    status: "REJECTED",
    totalValue: 5000.0,
    customer: { name: "Empresa ABC LTDA", cpfCnpj: "11222333000155" },
    createdAt: new Date().toISOString(),
    protocol: null,
  },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Notas Fiscais
          </h1>
          <p className="text-sm text-muted-foreground">
            Emita e gerencie NF-e, NFC-e e NFS-e.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/invoices/new">
            <Plus className="h-4 w-4" />
            Nova Nota
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {mockInvoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhuma nota fiscal emitida
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua primeira nota fiscal clicando em &quot;Nova Nota&quot;.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nº</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Valor</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => {
                const status = statusConfig[invoice.status] ?? statusConfig.DRAFT;
                return (
                  <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-foreground">
                      #{invoice.number.toString().padStart(6, "0")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {modelLabels[invoice.model] ?? invoice.model}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {invoice.customer?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                      {formatCurrency(invoice.totalValue)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(invoice.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver detalhes">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {invoice.status === "AUTHORIZED" && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Download XML">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Cancelar">
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
