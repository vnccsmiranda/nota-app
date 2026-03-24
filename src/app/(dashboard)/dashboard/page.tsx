"use client";

import {
  FileText,
  TrendingUp,
  Clock,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FreeBanner } from "@/components/shared/free-banner";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Mock data
const stats = [
  {
    title: "Notas Emitidas",
    value: "12",
    change: "+8%",
    trend: "up" as const,
    icon: FileText,
    subtitle: "este mês",
  },
  {
    title: "Faturado",
    value: formatCurrency(45890),
    change: "+12%",
    trend: "up" as const,
    icon: TrendingUp,
    subtitle: "este mês",
  },
  {
    title: "Pendentes",
    value: "3",
    change: "-2",
    trend: "down" as const,
    icon: Clock,
    subtitle: "aguardando",
  },
  {
    title: "Clientes Ativos",
    value: "28",
    change: "+3",
    trend: "up" as const,
    icon: Users,
    subtitle: "cadastrados",
  },
];

const recentInvoices = [
  {
    id: "1",
    number: 12,
    model: "NF-e",
    customer: "Tech Solutions LTDA",
    value: 8500.0,
    status: "AUTHORIZED" as const,
    date: "23/03/2026",
  },
  {
    id: "2",
    number: 11,
    model: "NFC-e",
    customer: "João da Silva",
    value: 299.9,
    status: "AUTHORIZED" as const,
    date: "22/03/2026",
  },
  {
    id: "3",
    number: 10,
    model: "NFS-e",
    customer: "Empresa ABC",
    value: 5000.0,
    status: "PENDING" as const,
    date: "21/03/2026",
  },
  {
    id: "4",
    number: 9,
    model: "NF-e",
    customer: "Distribuidora XYZ",
    value: 12350.0,
    status: "AUTHORIZED" as const,
    date: "20/03/2026",
  },
  {
    id: "5",
    number: 8,
    model: "NF-e",
    customer: "Comércio Central",
    value: 3200.0,
    status: "CANCELLED" as const,
    date: "19/03/2026",
  },
];

const statusConfig: Record<string, { label: string; variant: "authorized" | "pending" | "cancelled" | "rejected" | "draft" }> = {
  AUTHORIZED: { label: "Autorizada", variant: "authorized" },
  PENDING: { label: "Pendente", variant: "pending" },
  CANCELLED: { label: "Cancelada", variant: "cancelled" },
  REJECTED: { label: "Rejeitada", variant: "rejected" },
  DRAFT: { label: "Rascunho", variant: "draft" },
};

// Mock monthly revenue for chart
const monthlyRevenue = [
  { month: "Out", value: 32000 },
  { month: "Nov", value: 38000 },
  { month: "Dez", value: 29000 },
  { month: "Jan", value: 41000 },
  { month: "Fev", value: 35000 },
  { month: "Mar", value: 45890 },
];

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Free plan banner */}
      <FreeBanner show={false} />

      {/* Greeting */}
      <div role="region" aria-label="Saudação e empresa ativa">
        <h1 className="text-2xl font-semibold text-foreground">
          Bom dia, Miranda
        </h1>
        <p className="text-sm text-muted-foreground">
          Empresa: <span className="font-medium text-foreground">Exemplo Corp</span>
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button asChild className="gap-2">
          <Link href="/dashboard/invoices/new">
            <Plus className="h-4 w-4" />
            Nova Nota
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/dashboard/customers">
            <Users className="h-4 w-4" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Estatísticas principais">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10" aria-hidden="true">
                  <stat.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Recent */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2" style={{ height: "200px" }} role="img" aria-label={`Gráfico de faturamento mensal: ${monthlyRevenue.map(m => `${m.month} ${formatCurrency(m.value)}`).join(', ')}`}>
              {monthlyRevenue.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    style={{
                      height: `${(item.value / maxRevenue) * 160}px`,
                    }}
                    title={`${item.month}: ${formatCurrency(item.value)}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.month}: ${formatCurrency(item.value)}`}
                  />
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Últimas Notas</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/invoices" className="gap-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary rounded">
                Ver todas
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" role="list">
              {recentInvoices.map((invoice) => {
                const status = statusConfig[invoice.status] ?? statusConfig.DRAFT;
                return (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    role="listitem"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted" aria-hidden="true">
                        <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {invoice.model} #{invoice.number.toString().padStart(6, "0")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.customer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(invoice.value)}
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {invoice.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
