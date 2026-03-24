"use client";

import { useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyFormDialog } from "./company-form-dialog";

// Mock data for MVP (will be replaced with TanStack Query)
const mockCompanies = [
  {
    id: "1",
    cnpj: "12345678000190",
    razaoSocial: "Empresa Exemplo LTDA",
    nomeFantasia: "Exemplo Corp",
    ie: "123456789",
    crt: "SIMPLES_NACIONAL" as const,
    uf: "SP",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const crtLabels: Record<string, string> = {
  SIMPLES_NACIONAL: "Simples Nacional",
  LUCRO_PRESUMIDO: "Lucro Presumido",
  LUCRO_REAL: "Lucro Real",
};

function formatCNPJ(cnpj: string): string {
  return cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
}

export default function CompaniesPage() {
  const [showForm, setShowForm] = useState(false);
  const [companies] = useState(mockCompanies);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Empresas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as empresas para as quais você emite notas fiscais.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Nenhuma empresa cadastrada
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre sua primeira empresa para começar a emitir notas.
            </p>
            <Button onClick={() => setShowForm(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Cadastrar Empresa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {company.nomeFantasia || company.razaoSocial}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {formatCNPJ(company.cnpj)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={company.isActive ? "success" : "draft"}
                  >
                    {company.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regime:</span>
                    <span className="font-medium text-foreground">
                      {crtLabels[company.crt]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UF:</span>
                    <span className="font-medium text-foreground">
                      {company.uf || "—"}
                    </span>
                  </div>
                  {company.ie && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IE:</span>
                      <span className="font-medium text-foreground">
                        {company.ie}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog placeholder */}
      {showForm && (
        <CompanyFormDialog onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
