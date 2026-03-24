"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4 | 5;

const steps = [
  { number: 1 as const, label: "Tipo da Nota" },
  { number: 2 as const, label: "Destinatário" },
  { number: 3 as const, label: "Itens" },
  { number: 4 as const, label: "Pagamento" },
  { number: 5 as const, label: "Revisão" },
];

const invoiceTypes = [
  {
    model: "NFE_55",
    label: "NF-e — Nota Fiscal de Venda",
    description: "Para vendas B2B e operações com mercadorias",
    icon: "📄",
  },
  {
    model: "NFCE_65",
    label: "NFC-e — Cupom Fiscal",
    description: "Para vendas ao consumidor final (varejo)",
    icon: "🧾",
  },
  {
    model: "NFSE",
    label: "NFS-e — Nota Fiscal de Serviço",
    description: "Para prestação de serviços",
    icon: "📋",
  },
];

export default function NewInvoicePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Nova Nota Fiscal</h1>
          <p className="text-sm text-muted-foreground">
            Preencha os dados para emitir uma nova nota.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.number
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`hidden text-sm sm:block ${
                  currentStep === step.number
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-3 h-px w-8 bg-border sm:w-16" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="grid gap-4 md:grid-cols-3">
          {invoiceTypes.map((type) => (
            <Card
              key={type.model}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedModel === type.model
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedModel(type.model)}
              role="radio"
              aria-checked={selectedModel === type.model}
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && setSelectedModel(type.model)
              }
            >
              <CardHeader className="text-center">
                <div className="mx-auto text-4xl">{type.icon}</div>
                <CardTitle className="text-base">{type.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm text-muted-foreground">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 2 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              Seleção de destinatário — será implementado com busca nos clientes cadastrados
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              Adição de itens — busca em produtos, quantidade, preço e cálculo de impostos
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              Forma de pagamento — Dinheiro, Cartão, Pix, Boleto etc.
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardContent className="space-y-4 py-8">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Revisão da Nota
              </h3>
              <p className="text-sm text-muted-foreground">
                Tipo: <Badge variant="outline">{selectedModel}</Badge>
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Revise os dados e confirme a emissão.
              </p>
            </div>
            <div className="flex justify-center">
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                Emitir Nota
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1) as Step)}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentStep((s) => Math.min(5, s + 1) as Step)}
          disabled={currentStep === 5 || (currentStep === 1 && !selectedModel)}
          className="gap-2"
        >
          Próximo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
