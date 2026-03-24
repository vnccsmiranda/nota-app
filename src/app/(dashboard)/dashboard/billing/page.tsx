"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const proFeatures = [
  "Nota Fiscal de Serviço (NFS-e)",
  "Nota Fiscal de Venda (NF-e)",
  "Cupom Fiscal de Venda (NFC-e)",
  "Cadastro de Serviços",
  "Cadastro de Produtos",
  "Cadastro de Clientes",
  "Emissões e cadastros ilimitados",
  "Suporte via WhatsApp ou remoto",
  "Implantação e treinamento grátis",
];

const freeFeatures = [
  "1 nota fiscal por mês",
  "1 empresa",
  "10 produtos",
  "10 clientes",
  "Suporte da comunidade",
];

export default function BillingPage() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const [isLoading, setIsLoading] = useState(false);
  const currentPlan: string = "FREE";

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycle }),
      });
      const data = await res.json() as { url: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Plano & Cobrança
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerencie seu plano de assinatura.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Plano atual</p>
            <p className="text-lg font-semibold text-foreground">
              {currentPlan === "FREE" ? "Gratuito" : "PRO"}
            </p>
          </div>
          <Badge variant={currentPlan === "PRO" ? "default" : "secondary"}>
            {currentPlan}
          </Badge>
        </CardContent>
      </Card>

      {/* Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-sm ${
            cycle === "monthly"
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Mensal
        </span>
        <button
          onClick={() =>
            setCycle(cycle === "monthly" ? "yearly" : "monthly")
          }
          className={`relative h-7 w-14 rounded-full transition-colors ${
            cycle === "yearly" ? "bg-primary" : "bg-muted"
          }`}
          role="switch"
          aria-checked={cycle === "yearly"}
          aria-label="Alternar entre mensal e anual"
        >
          <div
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              cycle === "yearly" ? "translate-x-7" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm ${
            cycle === "yearly"
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Anual
          <Badge variant="success" className="ml-2">
            Economize ~R$120
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* FREE */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gratuito</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold text-foreground">R$ 0</span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="w-full"
              disabled={currentPlan === "FREE"}
            >
              {currentPlan === "FREE" ? "Plano atual" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        {/* PRO */}
        <Card className="relative border-primary">
          <div className="absolute -top-3 right-4">
            <Badge className="bg-primary text-primary-foreground">
              + Indicado
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-primary" />
              PRO
            </CardTitle>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">R$ </span>
              <span className="text-3xl font-bold text-foreground">
                {cycle === "yearly" ? "39,90" : "49,90"}
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
              {cycle === "yearly" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Cobrado R$ 478,80/ano
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              * Não inclui certificado digital
            </p>
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={isLoading || currentPlan === "PRO"}
            >
              {isLoading
                ? "Redirecionando..."
                : currentPlan === "PRO"
                ? "Plano atual"
                : "Assinar PRO"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
