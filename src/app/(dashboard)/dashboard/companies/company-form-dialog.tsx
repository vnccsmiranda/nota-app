"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyFormDialogProps {
  onClose: () => void;
}

export function CompanyFormDialog({ onClose }: CompanyFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: integrar com API
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Nova Empresa</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="00.000.000/0001-00" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razaoSocial">Razão Social</Label>
            <Input id="razaoSocial" placeholder="Empresa LTDA" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
            <Input id="nomeFantasia" placeholder="Nome Fantasia (opcional)" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ie">Inscrição Estadual</Label>
              <Input id="ie" placeholder="IE" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uf">UF</Label>
              <Input id="uf" placeholder="SP" maxLength={2} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crt">Regime Tributário</Label>
            <select
              id="crt"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              <option value="SIMPLES_NACIONAL">Simples Nacional</option>
              <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
              <option value="LUCRO_REAL">Lucro Real</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
