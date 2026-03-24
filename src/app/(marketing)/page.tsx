"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  FileText,
  Receipt,
  FileCheck,
  Building2,
  Calculator,
  BarChart3,
  ChevronDown,
  Check,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

// Smooth scroll observer for fade-in animations
function useIntersectionObserver() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

function FadeInSection({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

// Navigation Bar
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded">
            <div className="text-2xl font-bold">
              <span className="text-primary">+</span>
              <span className="text-foreground">NOTA</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground/70 hover:text-foreground text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-foreground/70 hover:text-foreground text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-foreground/70 hover:text-foreground text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
            >
              FAQ
            </button>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left px-4 py-2 text-sm text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left px-4 py-2 text-sm text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            >
              Preços
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="block w-full text-left px-4 py-2 text-sm text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            >
              FAQ
            </button>
            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block px-4 py-2 text-sm font-medium border border-border rounded-lg text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Começar grátis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section with Dashboard Mockup
function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-foreground/80">
                Novo! Emissão de NFS-e Nacional integrada
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Emita notas fiscais
              <br />
              <span className="text-primary">sem complicação</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              NF-e, NFC-e e NFS-e em poucos cliques. O sistema fiscal mais
              simples do Brasil para contadores e empresas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/login"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center space-x-2"
              >
                <span>Começar grátis</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
              <button className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Ver demonstração
              </button>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">
              {/* Mockup Header */}
              <div className="bg-foreground/5 border-b border-border px-6 py-4 flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-foreground/50 ml-4">
                  dashboard.nota.com
                </span>
              </div>

              {/* Mockup Content */}
              <div className="p-8">
                {/* Header Row */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Dashboard
                    </h2>
                    <p className="text-sm text-foreground/60">
                      Bem-vindo de volta, Contador Silva
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20" />
                    <div className="w-10 h-10 rounded-full bg-accent/20" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Notas Emitidas", value: "248", color: "bg-primary" },
                    {
                      label: "Faturamento",
                      value: "R$ 48.2K",
                      color: "bg-success",
                    },
                    {
                      label: "Empresas Ativas",
                      value: "5",
                      color: "bg-accent",
                    },
                    { label: "Taxa Sucesso", value: "99.8%", color: "bg-warning" },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-muted rounded-lg p-4 border border-border"
                    >
                      <p className="text-xs font-medium text-foreground/60 mb-2">
                        {stat.label}
                      </p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <div className={`w-2 h-8 rounded-full ${stat.color}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Mockup */}
                <div className="bg-muted rounded-lg p-6 border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Emissões por mês
                  </h3>
                  <div className="flex items-end space-x-2 h-32">
                    {[
                      40, 35, 42, 38, 45, 50, 48, 52, 55, 58, 60, 62,
                    ].map((height, idx) => (
                      <div
                        key={idx}
                        className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl border border-border p-4 max-w-xs hidden lg:block">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    NF-e Autorizada
                  </p>
                  <p className="text-xs text-foreground/60">
                    Há 2 minutos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    {
      icon: FileText,
      title: "NF-e de Venda",
      description:
        "Emissão completa de NF-e modelo 55 com cálculo automático de impostos e transmissão à SEFAZ",
    },
    {
      icon: Receipt,
      title: "NFC-e / Cupom Fiscal",
      description:
        "NFC-e modelo 65 para vendas ao consumidor final com QR Code e DANFCE",
    },
    {
      icon: FileCheck,
      title: "NFS-e de Serviço",
      description:
        "Nota fiscal de serviço eletrônica integrada ao padrão nacional",
    },
    {
      icon: Building2,
      title: "Multi-empresa",
      description:
        "Gerencie múltiplas empresas. Ideal para escritórios de contabilidade",
    },
    {
      icon: Calculator,
      title: "Cálculo de Impostos",
      description:
        "ICMS, PIS, COFINS calculados automaticamente conforme o regime tributário",
    },
    {
      icon: BarChart3,
      title: "Dashboard Inteligente",
      description:
        "Visão completa de notas emitidas, faturamento e alertas importantes",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-foreground/60">
              Recursos completos para gerenciar suas emissões fiscais de forma
              simples e profissional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <FadeInSection key={idx}>
                  <div className="bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition group">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Cadastre sua empresa",
      description:
        "Informe CNPJ, regime tributário e certificado digital",
    },
    {
      number: 2,
      title: "Adicione produtos e clientes",
      description:
        "Cadastre seu catálogo com NCM, CFOP e dados fiscais",
    },
    {
      number: 3,
      title: "Emita notas em poucos cliques",
      description:
        "Selecione o cliente, adicione itens e envie. Simples assim.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-foreground/60">
              Um processo simples em 3 passos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Connecting line */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary to-primary/0" />
                )}

                <FadeInSection>
                  <div className="bg-background border border-border rounded-xl p-8 relative z-10 h-full">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-foreground/60">
                      {step.description}
                    </p>
                  </div>
                </FadeInSection>
              </div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// Pricing Section
function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-5xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-lg text-foreground/60 mb-8">
              Escolha o plano perfeito para você
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 bg-muted rounded-full p-1" role="tablist">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  !isAnnual
                    ? "bg-white text-primary shadow-md"
                    : "text-foreground/60"
                }`}
                role="tab"
                aria-selected={!isAnnual}
                aria-label="Plano mensal"
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isAnnual
                    ? "bg-white text-primary shadow-md"
                    : "text-foreground/60"
                }`}
                role="tab"
                aria-selected={isAnnual}
                aria-label="Plano anual"
              >
                Anual
              </button>
            </div>

            {isAnnual && (
              <p className="text-sm text-success font-medium mt-4">
                💰 Economia de R$ 120/ano
              </p>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <FadeInSection>
              <div className="bg-white border border-border rounded-2xl p-8 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Grátis
                  </h3>
                  <p className="text-4xl font-bold text-foreground">
                    R$ 0<span className="text-lg text-foreground/60">/mês</span>
                  </p>
                </div>

                <Link
                  href="/login"
                  className="w-full px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition mb-8"
                >
                  Começar grátis
                </Link>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold text-foreground/60 mb-4">
                    Incluído:
                  </p>
                  {[
                    "1 nota por mês",
                    "1 empresa",
                    "10 produtos",
                    "10 clientes",
                    "Suporte comunidade",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 text-foreground/70"
                    >
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>

            {/* Pro Plan */}
            <FadeInSection>
              <div className="bg-white border-2 border-primary rounded-2xl p-8 h-full flex flex-col relative overflow-hidden">
                {/* Highlight Badge */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full" />
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold">
                  Mais indicado
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    PRO
                  </h3>
                  <div>
                    <p className="text-4xl font-bold text-foreground">
                      {isAnnual ? "R$ 39,90" : "R$ 49,90"}
                      <span className="text-lg text-foreground/60">/mês</span>
                    </p>
                    {isAnnual && (
                      <p className="text-xs text-foreground/60 mt-2">
                        cobrado anualmente: R$ 478,80/ano
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition mb-8"
                >
                  Assinar PRO
                </Link>

                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold text-foreground/60 mb-4">
                    Incluído:
                  </p>
                  {[
                    "Nota Fiscal de Serviço (NFS-e)",
                    "Nota Fiscal de Venda (NF-e)",
                    "Cupom Fiscal de Venda (NFC-e)",
                    "Cadastro de Serviços",
                    "Cadastro de Produtos",
                    "Cadastro de Clientes",
                    "Emissões e cadastros ilimitados",
                    "Suporte via WhatsApp ou remoto",
                    "Implantação e treinamento grátis",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 text-foreground/70"
                    >
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <p className="text-xs text-foreground/50 pt-4 mt-4 border-t border-border">
                    ⓘ Não inclui certificado digital
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// FAQ Section
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "O +NOTA emite nota fiscal de verdade?",
      answer:
        "Sim! O +NOTA é integrado com a SEFAZ e emite NF-e, NFC-e e NFS-e com validade jurídica. Você precisa ter seu certificado digital A1.",
    },
    {
      question: "Preciso de certificado digital?",
      answer:
        "Sim, para emissão de NF-e e NFC-e é necessário um certificado digital A1. O +NOTA não fornece o certificado, mas é compatível com qualquer certificadora credenciada.",
    },
    {
      question: "Posso usar para múltiplas empresas?",
      answer:
        "Sim! No plano PRO você pode cadastrar quantas empresas quiser. Ideal para escritórios de contabilidade que gerenciam vários clientes.",
    },
    {
      question: "Como funciona o plano gratuito?",
      answer:
        "O plano Free permite emitir 1 nota fiscal por mês para 1 empresa, com até 10 produtos e 10 clientes cadastrados. Ideal para testar a plataforma.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer:
        "Sim, sem multa e sem burocracia. Ao cancelar, você volta automaticamente para o plano Free.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-3xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-foreground/60">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FadeInSection key={idx}>
                <div className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === idx ? null : idx)
                    }
                    className="w-full px-6 py-4 flex items-center justify-between bg-background hover:bg-muted transition text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                    aria-expanded={openIndex === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform flex-shrink-0 ${
                        openIndex === idx ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {openIndex === idx && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-6 py-4 bg-muted/50 border-t border-border text-foreground/70"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// Final CTA Section
function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <FadeInSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pronto para simplificar sua emissão fiscal?
          </h2>
          <p className="text-lg text-foreground/60 mb-8">
            Junte-se a milhares de contadores e empresas que já usam o +NOTA
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-lg"
          >
            <span>Criar conta grátis</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </FadeInSection>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-accent">+</span>NOTA
            </div>
            <p className="text-sm text-white/70">
              O sistema fiscal mais simples do Brasil
            </p>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Produto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Features
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Preços
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">FAQ</button>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Suporte</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button className="hover:text-white transition flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Central de ajuda
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Termos de uso
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">
                  Privacidade
                </button>
              </li>
              <li>
                <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">LGPD</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white/60">
            © 2026 +NOTA. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0 text-sm text-white/60">
            <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">Status</button>
            <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">GitHub</button>
            <button className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1 py-0.5">Twitter</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Page
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
