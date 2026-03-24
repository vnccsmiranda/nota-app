"use client";

import { useState } from "react";
import { Building2, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Company {
  id: string;
  nomeFantasia: string | null;
  razaoSocial: string;
  cnpj: string;
}

interface CompanySwitcherProps {
  companies: Company[];
  activeCompanyId: string | null;
  onSelect: (companyId: string) => void;
  onCreateNew?: () => void;
  canCreate?: boolean;
}

export function CompanySwitcher({
  companies,
  activeCompanyId,
  onSelect,
  onCreateNew,
  canCreate = true,
}: CompanySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCompany = companies.find((c) => c.id === activeCompanyId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:bg-muted"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 truncate">
          <p className="truncate text-sm font-medium text-foreground">
            {activeCompany?.nomeFantasia || activeCompany?.razaoSocial || "Selecionar empresa"}
          </p>
          {activeCompany && (
            <p className="truncate text-xs text-muted-foreground">
              {activeCompany.cnpj}
            </p>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          <div className="max-h-60 overflow-y-auto p-1" role="listbox">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  onSelect(company.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                  company.id === activeCompanyId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
                role="option"
                aria-selected={company.id === activeCompanyId}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium">
                    {company.nomeFantasia || company.razaoSocial}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {company.cnpj}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {canCreate && onCreateNew && (
            <div className="border-t border-border p-1">
              <button
                onClick={() => {
                  onCreateNew();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
                Nova empresa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
