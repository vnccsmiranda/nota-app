"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const cpfSchema = z.string().length(11, "CPF deve ter 11 dígitos");
const cnpjSchema = z.string().length(14, "CNPJ deve ter 14 dígitos");

const addressSchema = z.object({
  cep: z.string().optional().default(""),
  logradouro: z.string().optional().default(""),
  numero: z.string().optional().default(""),
  complemento: z.string().optional().default(""),
  bairro: z.string().optional().default(""),
  cidade: z.string().optional().default(""),
  uf: z.string().optional().default(""),
});

type Address = z.infer<typeof addressSchema>;

interface Customer {
  id: string;
  cpfCnpj: string;
  name: string;
  email?: string;
  phone?: string;
  ie?: string;
  isCompany: boolean;
  address?: Address;
  companyId: string;
}

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  companyId: string;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  companyId,
}: CustomerFormDialogProps) {
  const [customerType, setCustomerType] = useState<"pf" | "pj">(
    customer?.isCompany ? "pj" : "pf"
  );
  const [expandAddress, setExpandAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cpfCnpj: "",
    name: "",
    email: "",
    phone: "",
    ie: "",
    address: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
    },
  });

  useEffect(() => {
    if (customer) {
      setCustomerType(customer.isCompany ? "pj" : "pf");
      setFormData({
        cpfCnpj: customer.cpfCnpj,
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        ie: customer.ie || "",
        address: customer.address || {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
        },
      });
    } else {
      setFormData({
        cpfCnpj: "",
        name: "",
        email: "",
        phone: "",
        ie: "",
        address: {
          cep: "",
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          uf: "",
        },
      });
    }
  }, [customer, open]);

  const queryClient = useQueryClient();

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const isCompany = customerType === "pj";

      if (isCompany) {
        cnpjSchema.parse(data.cpfCnpj);
      } else {
        cpfSchema.parse(data.cpfCnpj);
      }

      const payload = {
        ...data,
        isCompany,
        companyId,
      };

      const url = customer
        ? `/api/customers/${customer.id}`
        : "/api/customers";
      const method = customer ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar cliente");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers", companyId],
      });
      toast.success(
        customer ? "Cliente atualizado com sucesso" : "Cliente criado com sucesso"
      );
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao salvar cliente");
    },
  });

  const handleCepBlur = async () => {
    const cep = formData.address.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        setLoading(true);
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            },
          }));
          setExpandAddress(true);
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Error fetching CEP:", error);
        toast.error("Erro ao buscar CEP");
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCPF = (value: string): string => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    return cleaned
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      .replace(/\.(\d{0,3})\.(\d{0,3})-?/, ".$1.$2");
  };

  const formatCNPJ = (value: string): string => {
    const cleaned = value.replace(/\D/g, "").slice(0, 14);
    return cleaned
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      .replace(/\.(\d{0,3})\.(\d{0,3})\//, ".$1.$2/");
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handleCpfCnpjChange = (value: string) => {
    const isCompany = customerType === "pj";
    const formatted = isCompany ? formatCNPJ(value) : formatCPF(value);
    setFormData((prev) => ({ ...prev, cpfCnpj: formatted }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleCepChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 8);
    const formatted = cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
    handleAddressChange("cep", formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formData);
  };

  const displayName = customer?.name || "Novo Cliente";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? `Editar ${displayName}` : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Atualize as informações do cliente"
              : "Cadastre um novo cliente para emitir notas fiscais"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={customerType}
            onValueChange={(value) => {
              setCustomerType(value as "pf" | "pj");
              setFormData((prev) => ({ ...prev, cpfCnpj: "" }));
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pf">Pessoa Física</TabsTrigger>
              <TabsTrigger value="pj">Pessoa Jurídica</TabsTrigger>
            </TabsList>

            {customerType === "pf" && (
              <TabsContent value="pf" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpfCnpj}
                    onChange={(e) => handleCpfCnpjChange(e.target.value)}
                    disabled={!!customer}
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="João da Silva"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>
              </TabsContent>
            )}

            {customerType === "pj" && (
              <TabsContent value="pj" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cpfCnpj}
                    onChange={(e) => handleCpfCnpjChange(e.target.value)}
                    disabled={!!customer}
                    maxLength={18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="razaosocial">Razão Social</Label>
                  <Input
                    id="razaosocial"
                    placeholder="Tech Solutions LTDA"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input
                    id="ie"
                    placeholder="123.456.789.012"
                    value={formData.ie}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ie: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-pj">Email</Label>
                  <Input
                    id="email-pj"
                    type="email"
                    placeholder="contato@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-pj">Telefone</Label>
                  <Input
                    id="phone-pj"
                    placeholder="(11) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setExpandAddress(!expandAddress)}
              className="text-sm font-medium text-primary hover:underline"
            >
              {expandAddress ? "▼ Endereço" : "▶ Endereço"}
            </button>

            {expandAddress && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={formData.address.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      onBlur={handleCepBlur}
                      disabled={loading}
                      maxLength={9}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleCepBlur}
                      disabled={loading || formData.address.cep.length < 9}
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Buscar"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    placeholder="Rua, Avenida, etc."
                    value={formData.address.logradouro}
                    onChange={(e) =>
                      handleAddressChange("logradouro", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      placeholder="123"
                      value={formData.address.numero}
                      onChange={(e) => handleAddressChange("numero", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      placeholder="Apto 101"
                      value={formData.address.complemento}
                      onChange={(e) =>
                        handleAddressChange("complemento", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Vila Mariana"
                    value={formData.address.bairro}
                    onChange={(e) =>
                      handleAddressChange("bairro", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      placeholder="São Paulo"
                      value={formData.address.cidade}
                      onChange={(e) =>
                        handleAddressChange("cidade", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uf">UF</Label>
                    <Select
                      value={formData.address.uf}
                      onValueChange={(value) =>
                        handleAddressChange("uf", value)
                      }
                    >
                      <SelectTrigger id="uf">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZILIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {customer ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
