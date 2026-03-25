"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  X,
  AlertCircle,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { cn, formatCurrency, formatCPF, formatCNPJ } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5;

type InvoiceModel = "NFE_55" | "NFCE_65" | "NFSE";

interface Customer {
  id: string;
  name: string;
  cpfCnpj: string;
  email?: string;
  isCompany: boolean;
}

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  unit: string;
  ncm?: string;
  cfop?: string;
  cst?: string;
}

interface InvoiceItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  ncm?: string;
  cfop?: string;
  cst?: string;
}

interface SuccessState {
  protocol: string;
  invoiceId: string;
  model: InvoiceModel;
  number: number;
}

const steps = [
  { number: 1 as const, label: "Tipo da Nota" },
  { number: 2 as const, label: "Destinatário" },
  { number: 3 as const, label: "Itens" },
  { number: 4 as const, label: "Pagamento" },
  { number: 5 as const, label: "Revisão" },
];

const invoiceTypes = [
  {
    model: "NFE_55" as InvoiceModel,
    label: "NF-e — Nota Fiscal de Venda",
    description: "Para vendas B2B e operações com mercadorias",
    icon: "📄",
    isPro: false,
  },
  {
    model: "NFCE_65" as InvoiceModel,
    label: "NFC-e — Cupom Fiscal",
    description: "Para vendas ao consumidor final (varejo)",
    icon: "🧾",
    isPro: false,
  },
  {
    model: "NFSE" as InvoiceModel,
    label: "NFS-e — Nota Fiscal de Serviço",
    description: "Para prestação de serviços",
    icon: "📋",
    isPro: true,
  },
];

const paymentMethods = [
  { id: "01", label: "Dinheiro", icon: "💵" },
  { id: "02", label: "Cartão de Crédito", icon: "💳" },
  { id: "03", label: "Cartão de Débito", icon: "💳" },
  { id: "04", label: "Pix", icon: "📱" },
  { id: "05", label: "Boleto", icon: "📄" },
  { id: "06", label: "Transferência", icon: "🏦" },
  { id: "99", label: "Outros", icon: "📋" },
];

const defaultNatOp: Record<InvoiceModel, string> = {
  NFE_55: "Venda de mercadoria",
  NFCE_65: "Venda a consumidor",
  NFSE: "Prestação de serviços",
};

function getActiveCompanyId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("activeCompany="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function formatDocument(doc: string, isCompany: boolean): string {
  if (!doc) return doc;
  const clean = doc.replace(/\D/g, "");
  return isCompany ? formatCNPJ(clean) : formatCPF(clean);
}

export default function NewInvoicePage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedModel, setSelectedModel] = useState<InvoiceModel | null>(null);
  const [natOp, setNatOp] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [series, setSeries] = useState<number>(1);
  const [infoComplementar, setInfoComplementar] = useState<string>("");
  const [successState, setSuccessState] = useState<SuccessState | null>(null);
  const [isEmitting, setIsEmitting] = useState(false);
  const [emitError, setEmitError] = useState<string>("");

  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const customerSearchTimeout = useRef<NodeJS.Timeout>();

  const [productSearch, setProductSearch] = useState<string>("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const productSearchTimeout = useRef<NodeJS.Timeout>();

  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState<string>("");
  const [newCustomerCpfCnpj, setNewCustomerCpfCnpj] = useState<string>("");
  const [newCustomerIsCompany, setNewCustomerIsCompany] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const companyId = getActiveCompanyId();

  useEffect(() => {
    if (selectedModel && natOp === "") {
      setNatOp(defaultNatOp[selectedModel]);
    }
  }, [selectedModel, natOp]);

  const handleSearchCustomers = (query: string) => {
    setCustomerSearch(query);
    if (customerSearchTimeout.current) {
      clearTimeout(customerSearchTimeout.current);
    }

    if (!query.trim()) {
      setCustomerResults([]);
      setShowCustomerDropdown(false);
      return;
    }

    setIsSearchingCustomer(true);
    customerSearchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/customers?search=${encodeURIComponent(query)}&companyId=${companyId}`
        );
        if (res.ok) {
          const data = await res.json();
          setCustomerResults(data);
          setShowCustomerDropdown(true);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setIsSearchingCustomer(false);
      }
    }, 300);
  };

  const handleSearchProducts = (query: string) => {
    setProductSearch(query);
    if (productSearchTimeout.current) {
      clearTimeout(productSearchTimeout.current);
    }

    if (!query.trim()) {
      setProductResults([]);
      setShowProductDropdown(false);
      return;
    }

    setIsSearchingProduct(true);
    productSearchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&companyId=${companyId}`
        );
        if (res.ok) {
          const data = await res.json();
          setProductResults(data);
          setShowProductDropdown(true);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsSearchingProduct(false);
      }
    }, 300);
  };

  const addItem = (product: Product) => {
    const newItem: InvoiceItem = {
      id: `${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      total: product.price,
      ncm: product.ncm,
      cfop: product.cfop,
      cst: product.cst,
    };
    setInvoiceItems([...invoiceItems, newItem]);
    setProductSearch("");
    setProductResults([]);
    setShowProductDropdown(false);
    toast.success(`${product.name} adicionado à nota`);
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.total = updated.quantity * updated.unitPrice - updated.discount;
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const estimatedTaxes = {
    icms: subtotal * 0.12,
    pis: subtotal * 0.0065,
    cofins: subtotal * 0.03,
  };
  const totalTaxes = estimatedTaxes.icms + estimatedTaxes.pis + estimatedTaxes.cofins;
  const finalTotal = subtotal + totalTaxes;

  const handleAddNewCustomer = async () => {
    if (!newCustomerName.trim() || !newCustomerCpfCnpj.trim()) {
      toast.error("Preencha nome e CPF/CNPJ");
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          name: newCustomerName,
          cpfCnpj: newCustomerCpfCnpj.replace(/\D/g, ""),
          isCompany: newCustomerIsCompany,
        }),
      });

      if (res.ok) {
        const newCustomer = await res.json();
        setSelectedCustomer(newCustomer);
        setNewCustomerName("");
        setNewCustomerCpfCnpj("");
        setNewCustomerIsCompany(false);
        setShowNewCustomerForm(false);
        toast.success("Cliente criado com sucesso");
      } else {
        toast.error("Erro ao criar cliente");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar cliente");
    }
  };

  const handleEmit = async () => {
    if (!companyId) {
      toast.error("Empresa não selecionada");
      return;
    }

    setIsEmitting(true);
    setEmitError("");

    try {
      const invoicePayload = {
        model: selectedModel,
        companyId,
        customerId: selectedCustomer?.id || null,
        natOp,
        paymentMethod: selectedPaymentMethod,
        infoComplementar,
        items: invoiceItems.map((item) => ({
          productId: item.productId || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          cfop: item.cfop || null,
          ncm: item.ncm || null,
          cst: item.cst || null,
        })),
      };

      const createRes = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      });

      if (!createRes.ok) {
        const error = await createRes.json();
        throw new Error(error.error || "Erro ao criar nota");
      }

      const invoice = await createRes.json();

      const emitRes = await fetch(`/api/invoices/${invoice.id}/emit`, {
        method: "POST",
      });

      if (!emitRes.ok) {
        const error = await emitRes.json();
        throw new Error(error.error || "Erro ao emitir nota");
      }

      const emitData = await emitRes.json();

      setSuccessState({
        protocol: emitData.invoice.protocol,
        invoiceId: emitData.invoice.id,
        model: emitData.invoice.model,
        number: emitData.invoice.number,
      });

      toast.success("Nota emitida com sucesso");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao emitir nota";
      setEmitError(message);
      toast.error(message);
    } finally {
      setIsEmitting(false);
    }
  };

  const canProceed = {
    1: !!selectedModel,
    2: selectedModel !== "NFCE_65" ? !!selectedCustomer : true,
    3: invoiceItems.length > 0,
    4: !!selectedPaymentMethod,
    5: true,
  };

  if (successState) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="py-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-success/20 p-4">
                <Check className="h-8 w-8 text-success" />
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Nota Fiscal Emitida com Sucesso!
            </h2>
            <p className="mb-4 text-muted-foreground">
              Protocolo: <span className="font-mono font-semibold">{successState.protocol}</span>
            </p>
            <div className="mb-6 flex justify-center gap-3">
              <Button
                asChild
                className="gap-2"
              >
                <Link href={`/dashboard/invoices/${successState.invoiceId}`}>
                  <FileText className="h-4 w-4" />
                  Ver Nota
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedModel(null);
                  setNatOp("");
                  setSelectedCustomer(null);
                  setInvoiceItems([]);
                  setSelectedPaymentMethod("");
                  setSeries(1);
                  setInfoComplementar("");
                  setSuccessState(null);
                  setEmitError("");
                }}
              >
                Nova Nota
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
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

      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {invoiceTypes.map((type) => (
              <Card
                key={type.model}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedModel === type.model
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => {
                  setSelectedModel(type.model);
                  setNatOp(defaultNatOp[type.model]);
                }}
                role="radio"
                aria-checked={selectedModel === type.model}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedModel(type.model);
                    setNatOp(defaultNatOp[type.model]);
                  }
                }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto text-4xl">{type.icon}</div>
                  <div className="mt-2 flex items-start justify-center gap-2">
                    <CardTitle className="text-base">{type.label}</CardTitle>
                    {type.isPro && (
                      <Badge variant="secondary" className="mt-0.5">
                        PRO
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedModel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Natureza da Operação</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={natOp}
                  onChange={(e) => setNatOp(e.target.value)}
                  placeholder="Natureza da operação"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          {!showNewCustomerForm ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Buscar Destinatário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Input
                      placeholder="Digite nome ou CPF/CNPJ"
                      value={customerSearch}
                      onChange={(e) => handleSearchCustomers(e.target.value)}
                      onFocus={() =>
                        customerResults.length > 0 &&
                        setShowCustomerDropdown(true)
                      }
                    />
                    {isSearchingCustomer && (
                      <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                    )}

                    {showCustomerDropdown && customerResults.length > 0 && (
                      <div className="absolute top-full z-10 mt-1 w-full border border-border bg-background shadow-md rounded-md">
                        {customerResults.map((customer) => (
                          <button
                            key={customer.id}
                            className="block w-full border-b border-border/50 px-4 py-3 text-left hover:bg-muted last:border-b-0"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setCustomerSearch("");
                              setCustomerResults([]);
                              setShowCustomerDropdown(false);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {customer.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDocument(customer.cpfCnpj, customer.isCompany)}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {customer.isCompany ? "PJ" : "PF"}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowNewCustomerForm(true)}
                  >
                    + Novo Destinatário
                  </Button>
                </CardContent>
              </Card>

              {selectedCustomer && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedCustomer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDocument(
                            selectedCustomer.cpfCnpj,
                            selectedCustomer.isCompany
                          )}
                        </p>
                        {selectedCustomer.email && (
                          <p className="text-xs text-muted-foreground">
                            {selectedCustomer.email}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedCustomer(null)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Novo Destinatário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newCustomerName" className="text-sm">
                    Nome / Razão Social
                  </Label>
                  <Input
                    id="newCustomerName"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <Label htmlFor="newCustomerCpfCnpj" className="text-sm">
                    CPF / CNPJ
                  </Label>
                  <Input
                    id="newCustomerCpfCnpj"
                    value={newCustomerCpfCnpj}
                    onChange={(e) => setNewCustomerCpfCnpj(e.target.value)}
                    placeholder="CPF ou CNPJ"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isCompany"
                    checked={newCustomerIsCompany}
                    onChange={(e) => setNewCustomerIsCompany(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isCompany" className="text-sm font-normal">
                    É uma pessoa jurídica (PJ)?
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowNewCustomerForm(false);
                      setNewCustomerName("");
                      setNewCustomerCpfCnpj("");
                      setNewCustomerIsCompany(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleAddNewCustomer}
                  >
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedModel === "NFCE_65" && (
            <Card className="border-blue-200/50 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/10">
              <CardContent className="pt-4 text-sm text-muted-foreground">
                Para NFC-e, o destinatário é opcional.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adicionar Itens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Digite nome ou código do produto"
                  value={productSearch}
                  onChange={(e) => handleSearchProducts(e.target.value)}
                  onFocus={() =>
                    productResults.length > 0 && setShowProductDropdown(true)
                  }
                />
                {isSearchingProduct && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}

                {showProductDropdown && productResults.length > 0 && (
                  <div className="absolute top-full z-10 mt-1 w-full border border-border bg-background shadow-md rounded-md max-h-48 overflow-y-auto">
                    {productResults.map((product) => (
                      <button
                        key={product.id}
                        className="block w-full border-b border-border/50 px-4 py-3 text-left hover:bg-muted last:border-b-0"
                        onClick={() => addItem(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cód: {product.code} | {product.unit}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {invoiceItems.length > 0 && (
            <Card>
              <CardContent className="overflow-x-auto pt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-2 py-2 text-left font-semibold text-foreground">
                        #
                      </th>
                      <th className="px-2 py-2 text-left font-semibold text-foreground">
                        Produto
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-foreground">
                        Qtd
                      </th>
                      <th className="px-2 py-2 text-right font-semibold text-foreground">
                        Valor Unit
                      </th>
                      <th className="px-2 py-2 text-right font-semibold text-foreground">
                        Desc %
                      </th>
                      <th className="px-2 py-2 text-right font-semibold text-foreground">
                        Total
                      </th>
                      <th className="px-2 py-2 text-center font-semibold text-foreground">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="px-2 py-3 text-foreground">{index + 1}</td>
                        <td className="px-2 py-3 text-foreground">
                          {item.productName}
                        </td>
                        <td className="px-2 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, {
                                quantity: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="h-8 w-16 text-center"
                          />
                        </td>
                        <td className="px-2 py-3 text-right">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, {
                                unitPrice: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="h-8 w-24 text-right"
                          />
                        </td>
                        <td className="px-2 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.discount}
                            onChange={(e) =>
                              updateItem(item.id, {
                                discount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="h-8 w-20 text-right"
                          />
                        </td>
                        <td className="px-2 py-3 text-right font-semibold text-foreground">
                          {formatCurrency(item.total)}
                        </td>
                        <td className="px-2 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-between p-0 text-sm"
                    onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
                  >
                    <span className="text-muted-foreground">
                      Impostos Estimados:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(totalTaxes)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showTaxBreakdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </Button>

                  {showTaxBreakdown && (
                    <div className="space-y-1 bg-muted/30 rounded px-3 py-2">
                      <div className="flex justify-between text-xs">
                        <span>ICMS (12%):</span>
                        <span>{formatCurrency(estimatedTaxes.icms)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>PIS (0,65%):</span>
                        <span>{formatCurrency(estimatedTaxes.pis)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>COFINS (3%):</span>
                        <span>{formatCurrency(estimatedTaxes.cofins)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-border pt-4">
                    <span className="text-lg font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left transition-all",
                      selectedPaymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-medium text-foreground text-sm">
                        {method.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Série</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                min="1"
                value={series}
                onChange={(e) => setSeries(parseInt(e.target.value) || 1)}
                className="max-w-xs"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Complementares</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={infoComplementar}
                onChange={(e) => setInfoComplementar(e.target.value)}
                placeholder="Informações adicionais sobre a nota (opcional)"
                className="min-h-20"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revisão da Nota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Nota</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedModel}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Natureza da Operação
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {natOp}
                  </p>
                </div>

                {selectedCustomer && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Destinatário</p>
                    <div className="mt-1 rounded-lg border border-border p-3 bg-muted/30">
                      <p className="text-sm font-medium text-foreground">
                        {selectedCustomer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDocument(
                          selectedCustomer.cpfCnpj,
                          selectedCustomer.isCompany
                        )}{" "}
                        ({selectedCustomer.isCompany ? "PJ" : "PF"})
                      </p>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground mb-2">Itens</p>
                  <div className="space-y-2">
                    {invoiceItems.map((item, index) => (
                      <div key={item.id} className="text-sm text-foreground">
                        {index + 1}. {item.quantity}x {item.productName} ={" "}
                        <span className="font-semibold">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impostos Est.:</span>
                    <span className="font-semibold">
                      {formatCurrency(totalTaxes)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-lg font-bold text-foreground">
                      TOTAL:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Forma de Pagamento</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {paymentMethods.find((m) => m.id === selectedPaymentMethod)
                      ?.label || "Não selecionada"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200/50 bg-yellow-50/30 dark:border-yellow-900/30 dark:bg-yellow-950/10 p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-600">
                    Esta é uma emissão simulada. A integração com a SEFAZ será
                    ativada em breve.
                  </p>
                </div>
              </div>

              {emitError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3">
                  <p className="text-xs text-destructive">{emitError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1) as Step)}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentStep === 5 ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              disabled={isEmitting}
            >
              Salvar Rascunho
            </Button>
            <Button
              onClick={handleEmit}
              disabled={isEmitting}
              className="gap-2"
            >
              {isEmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Emitindo...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Emitir Nota
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setCurrentStep((s) => Math.min(5, s + 1) as Step)}
            disabled={!canProceed[currentStep]}
            className="gap-2"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
