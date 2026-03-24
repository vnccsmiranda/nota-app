"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu, X, FileText, Receipt, FileCheck, Building2, Calculator, BarChart3,
  ChevronDown, Check, ArrowRight, MessageCircle, Star, Shield, Mail,
  Twitter, Linkedin, Instagram, Lock, Zap, Users, Award, TrendingUp,
  Bell, CheckCircle2, AlertCircle, ChevronRight,
} from "lucide-react";

// ─── Utilities ───────────────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

function useCountUp(target: number, duration = 2000, started = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);
  return value;
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useIntersectionObserver();
  return (
    <div
      ref={ref}
      className={`motion-safe:transition-[opacity,transform] motion-safe:duration-700 ${
        isVisible ? "" : "motion-safe:opacity-0 motion-safe:translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
      aria-label="Navegação principal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-1"
          >
            <span className="text-2xl font-black text-primary leading-none">+</span>
            <span className="text-2xl font-black text-foreground leading-none">NOTA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {(
              [
                ["features", "Funcionalidades"],
                ["pricing", "Preços"],
                ["faq", "FAQ"],
              ] as [string, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => scroll(id)}
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Começar grátis
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="md:hidden p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {open ? (
              <X className="w-5 h-5" aria-hidden />
            ) : (
              <Menu className="w-5 h-5" aria-hidden />
            )}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 border-x border-b border-border bg-white/98 rounded-b-xl">
            <div className="space-y-1 px-2 py-2">
              {(
                [
                  ["features", "Funcionalidades"],
                  ["pricing", "Preços"],
                  ["faq", "FAQ"],
                ] as [string, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => scroll(id)}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="px-4 pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="block py-2.5 text-sm font-semibold text-center border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="block py-2.5 text-sm font-semibold text-center bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
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

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative pt-28 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
      aria-label="Início"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center max-w-4xl mx-auto">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 mb-8 text-sm font-semibold text-primary">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Novo! Emissão de NFS-e Nacional integrada
              <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            </div>
          </FadeUp>

          <FadeUp delay={80}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.04] tracking-tight mb-6 text-balance">
              Emita notas fiscais{" "}
              <span className="relative inline-block">
                <span className="text-primary">sem complicação</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C60 4 120 2 160 4C200 6 250 8 298 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={160}>
            <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
              NF-e, NFC-e e NFS-e em poucos cliques. O sistema fiscal mais
              simples do Brasil para contadores e empresas.
            </p>
          </FadeUp>

          <FadeUp delay={220}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Começar grátis
                <ArrowRight className="w-5 h-5" aria-hidden />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground/5 text-foreground rounded-xl font-semibold text-base hover:bg-foreground/10 active:scale-[0.98] transition-all border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Ver demonstração
              </button>
            </div>
          </FadeUp>

          <FadeUp delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 text-sm text-foreground/50">
              <div className="flex -space-x-2" aria-hidden>
                {(["bg-primary", "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500"] as string[]).map(
                  (bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white ${bg} flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {["A", "B", "C", "D", "E"][i]}
                    </div>
                  )
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label="5 de 5 estrelas">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" aria-hidden />
                  ))}
                </div>
                <span>
                  <strong className="text-foreground tabular-nums">500+</strong>{" "}
                  empresas e contadores confiam no +NOTA
                </span>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Dashboard Mockup */}
        <FadeUp delay={380}>
          <div className="relative max-w-5xl mx-auto">
            <div
              className="absolute -inset-4 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-3xl blur-2xl -z-10"
              aria-hidden
            />
            <div
              className="rounded-t-2xl border border-border/80 bg-white shadow-[0_32px_80px_-12px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ transform: "perspective(1800px) rotateX(3deg)" }}
            >
              {/* Browser bar */}
              <div className="flex items-center gap-3 px-5 py-3 bg-muted border-b border-border">
                <div className="flex gap-1.5" aria-hidden>
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-3 py-1 text-xs text-foreground/40 flex items-center gap-1.5 max-w-xs w-full border border-border/60">
                    <Lock className="w-3 h-3" aria-hidden />
                    app.maisnota.com.br
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-5 bg-muted/20">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider mb-0.5">Dashboard</p>
                    <h2 className="text-lg font-bold text-foreground">Bom dia, Contador Silva 👋</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-success" aria-hidden />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white">
                      CS
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Notas emitidas", value: "248", sub: "+12%", Icon: FileText, iconBg: "bg-primary/10", iconColor: "text-primary" },
                    { label: "Faturamento", value: "R$ 48K", sub: "+8%", Icon: TrendingUp, iconBg: "bg-success/10", iconColor: "text-success" },
                    { label: "Empresas ativas", value: "5", sub: "clientes", Icon: Building2, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
                    { label: "Taxa SEFAZ", value: "99.8%", sub: "aprovação", Icon: Award, iconBg: "bg-warning/10", iconColor: "text-warning" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-3.5 border border-border/60 shadow-sm">
                      <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center mb-2.5`}>
                        <s.Icon className={`w-3.5 h-3.5 ${s.iconColor}`} aria-hidden />
                      </div>
                      <p className="text-[11px] text-foreground/50 mb-0.5">{s.label}</p>
                      <p className="text-base font-bold text-foreground tabular-nums">{s.value}</p>
                      <p className="text-[11px] text-success font-medium">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-white rounded-xl p-4 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-foreground">Emissões por mês</p>
                      <span className="text-xs text-primary font-medium">2024</span>
                    </div>
                    <div className="flex items-end gap-1 h-16" role="img" aria-label="Gráfico de emissões mensais">
                      {[30, 42, 38, 55, 48, 60, 52, 58, 65, 70, 68, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 11 ? "hsl(var(--primary))" : "hsl(var(--primary)/0.25)",
                          }}
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm">
                    <p className="text-xs font-semibold text-foreground mb-3">Recentes</p>
                    <div className="space-y-2.5">
                      {[
                        { type: "NF-e #0248", status: "Autorizada", ok: true },
                        { type: "NFC-e #0247", status: "Autorizada", ok: true },
                        { type: "NFS-e #0246", status: "Pendente", ok: false },
                      ].map((n, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-[11px] text-foreground/60">{n.type}</span>
                          <span className={`text-[11px] font-semibold ${n.ok ? "text-success" : "text-warning"}`}>
                            {n.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge — success */}
            <div
              className="absolute -bottom-4 -left-4 lg:-left-16 bg-white rounded-2xl shadow-xl border border-border p-3.5 hidden lg:flex items-center gap-3 z-10"
              aria-hidden
            >
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">NF-e Autorizada!</p>
                <p className="text-[11px] text-foreground/50">Protocolo SEFAZ recebido</p>
              </div>
            </div>

            {/* Floating badge — speed */}
            <div
              className="absolute -bottom-4 -right-4 lg:-right-16 bg-white rounded-2xl shadow-xl border border-border p-3.5 hidden lg:flex items-center gap-3 z-10"
              aria-hidden
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground tabular-nums">{"< 5 segundos"}</p>
                <p className="text-[11px] text-foreground/50">por emissão</p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function StatCard({
  target,
  format,
  label,
  sublabel,
}: {
  target: number;
  format: (n: number) => string;
  label: string;
  sublabel: string;
}) {
  const { ref, isVisible } = useIntersectionObserver(0.3);
  const count = useCountUp(target, 2000, isVisible);
  return (
    <div ref={ref} className="text-center px-6 py-8">
      <p className="text-4xl sm:text-5xl font-black tabular-nums mb-1.5">
        <span className="text-primary">{format(count)}</span>
      </p>
      <p className="font-semibold text-foreground text-base mb-1">{label}</p>
      <p className="text-sm text-foreground/50">{sublabel}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-border" aria-label="Métricas">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border rounded-2xl overflow-hidden bg-muted/30 border border-border">
          <StatCard target={500} format={(n) => `${n}+`} label="Empresas ativas" sublabel="e crescendo todo mês" />
          <StatCard target={50000} format={(n) => `${n.toLocaleString("pt-BR")}+`} label="Notas emitidas" sublabel="com validade jurídica" />
          <StatCard target={998} format={(n) => `${(n / 10).toFixed(1)}%`} label="Aprovação SEFAZ" sublabel="taxa de sucesso" />
          <StatCard target={2} format={(n) => `< ${n}h`} label="Tempo de suporte" sublabel="resposta média" />
        </div>
      </div>
    </section>
  );
}

// ─── Features (Bento Grid) ────────────────────────────────────────────────────

const featureItems = [
  {
    Icon: FileText, title: "NF-e de Venda",
    description: "Emissão completa de NF-e modelo 55 com cálculo automático de ICMS, PIS e COFINS. Transmissão direta à SEFAZ e DANFE em segundos.",
    tag: "Mais usado", tagColor: "bg-primary/10 text-primary",
    iconBg: "bg-primary/10", iconColor: "text-primary", wide: true,
  },
  {
    Icon: Receipt, title: "NFC-e / Cupom Fiscal",
    description: "NFC-e modelo 65 para PDVs com QR Code, DANFCE e integração SAT.",
    tag: "Varejo", tagColor: "bg-blue-50 text-blue-600",
    iconBg: "bg-blue-50", iconColor: "text-blue-500",
  },
  {
    Icon: Building2, title: "Multi-empresa",
    description: "Gerencie dezenas de clientes em um único painel. Ideal para contadores.",
    tag: "Contadores", tagColor: "bg-violet-50 text-violet-600",
    iconBg: "bg-violet-50", iconColor: "text-violet-500",
  },
  {
    Icon: Calculator, title: "Impostos Automáticos",
    description: "ICMS, PIS, COFINS calculados automaticamente por regime tributário.",
    tag: "Inteligente", tagColor: "bg-rose-50 text-rose-600",
    iconBg: "bg-rose-50", iconColor: "text-rose-500",
  },
  {
    Icon: FileCheck, title: "NFS-e Nacional",
    description: "Nota fiscal de serviço pelo padrão nacional. Validação e transmissão integradas.",
    tag: "Serviços", tagColor: "bg-emerald-50 text-emerald-600",
    iconBg: "bg-emerald-50", iconColor: "text-emerald-500",
  },
  {
    Icon: BarChart3, title: "Dashboard Inteligente",
    description: "Visualize notas emitidas, faturamento e alertas de vencimento em tempo real.",
    tag: "Analytics", tagColor: "bg-amber-50 text-amber-600",
    iconBg: "bg-amber-50", iconColor: "text-amber-500", wide: true,
  },
] as const;

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="features-title">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Funcionalidades</p>
            <h2 id="features-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
              Tudo que você precisa,<br />sem nada que não precisa
            </h2>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto text-pretty">
              Recursos completos para emissão fiscal, sem complexidade desnecessária.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureItems.map((item, idx) => (
            <FadeUp key={idx} delay={idx * 60} className={"wide" in item && item.wide ? "sm:col-span-2 lg:col-span-2" : ""}>
              <div className={`group h-full bg-white border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${"wide" in item && item.wide ? "sm:flex-row sm:gap-8 sm:items-center" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <item.Icon className={`w-5 h-5 ${item.iconColor}`} aria-hidden />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed text-pretty">{item.description}</p>
                </div>
                {"wide" in item && item.wide && (
                  <div className="hidden sm:flex flex-shrink-0 items-center justify-center" aria-hidden>
                    <div className={`w-28 h-28 rounded-3xl ${item.iconBg} flex items-center justify-center`}>
                      <item.Icon className={`w-14 h-14 ${item.iconColor} opacity-60`} />
                    </div>
                  </div>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    Icon: Building2, title: "Cadastre sua empresa",
    description: "Informe CNPJ, regime tributário e faça upload do certificado digital A1. Em menos de 5 minutos você está pronto.",
    iconColor: "text-primary", iconBg: "bg-primary/10", borderColor: "border-primary/20", numColor: "text-primary",
  },
  {
    Icon: Users, title: "Adicione produtos e clientes",
    description: "Cadastre seu catálogo com NCM, CFOP e dados fiscais. Importe planilhas ou adicione individualmente.",
    iconColor: "text-blue-500", iconBg: "bg-blue-50", borderColor: "border-blue-100", numColor: "text-blue-500",
  },
  {
    Icon: Zap, title: "Emita em poucos cliques",
    description: "Selecione o cliente, adicione os itens e confirme. Receba o protocolo SEFAZ em segundos.",
    iconColor: "text-success", iconBg: "bg-success/10", borderColor: "border-success/20", numColor: "text-success",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Como funciona</p>
            <h2 id="how-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
              Do cadastro à nota fiscal<br />em 3 passos
            </h2>
            <p className="text-lg text-foreground/60 max-w-xl mx-auto text-pretty">Simples, direto e sem burocracia.</p>
          </div>
        </FadeUp>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="hidden md:block absolute top-8 left-[22%] right-[22%] h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" aria-hidden />
          {steps.map((step, idx) => (
            <FadeUp key={idx} delay={idx * 120}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 z-10">
                  <div className={`w-16 h-16 rounded-2xl ${step.iconBg} border-2 ${step.borderColor} flex items-center justify-center`}>
                    <step.Icon className={`w-7 h-7 ${step.iconColor}`} aria-hidden />
                  </div>
                  <div className={`absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-white border-2 ${step.borderColor} text-xs font-black ${step.numColor} flex items-center justify-center shadow-sm`} aria-hidden>
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed text-pretty max-w-xs">{step.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const planRows = [
  { label: "Notas fiscais/mês", free: "1 nota", pro: "Ilimitadas" },
  { label: "Empresas", free: "1 empresa", pro: "Ilimitadas" },
  { label: "Produtos/serviços", free: "Até 10", pro: "Ilimitados" },
  { label: "Clientes", free: "Até 10", pro: "Ilimitados" },
  { label: "Tipos de nota", free: "NF-e, NFC-e", pro: "NF-e, NFC-e, NFS-e" },
  { label: "Relatórios", free: false, pro: true },
  { label: "Suporte", free: "Comunidade", pro: "WhatsApp & Remoto" },
  { label: "Implantação e treinamento", free: false, pro: "Grátis" },
] as const;

function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="pricing-title">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Preços</p>
            <h2 id="pricing-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
              Simples e transparente
            </h2>
            <p className="text-lg text-foreground/60 mb-8">Comece grátis. Escale quando precisar.</p>

            <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-full border border-border" role="group" aria-label="Ciclo de cobrança">
              {([["Mensal", false], ["Anual", true]] as [string, boolean][]).map(([label, val]) => (
                <button
                  key={label}
                  onClick={() => setAnnual(val)}
                  aria-pressed={annual === val}
                  className={`relative px-6 py-2 text-sm font-semibold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                    annual === val ? "bg-white text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {label}
                  {val && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      -20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free */}
          <FadeUp delay={0}>
            <div className="h-full bg-white border border-border rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-[11px] font-black uppercase tracking-widest text-foreground/40 mb-3">Gratuito</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-black text-foreground">R$ 0</span>
                  <span className="text-foreground/40 text-base mb-1.5">/mês</span>
                </div>
                <p className="text-sm text-foreground/50">Para conhecer a plataforma</p>
              </div>
              <Link href="/login" className="w-full py-3 text-center text-sm font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 block">
                Começar grátis
              </Link>
              <div className="flex-1 space-y-0">
                {planRows.map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground/60">{row.label}</span>
                    {typeof row.free === "boolean" ? (
                      <span className="text-foreground/25 text-sm">—</span>
                    ) : (
                      <span className="text-sm font-medium text-foreground">{row.free}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Pro */}
          <FadeUp delay={80}>
            <div className="relative h-full bg-foreground rounded-2xl p-8 flex flex-col overflow-hidden">
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" aria-hidden />

              <div className="relative mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/40">PRO</p>
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">Mais indicado</span>
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl font-black text-white tabular-nums">
                    {annual ? "R$ 39,90" : "R$ 49,90"}
                  </span>
                  <span className="text-white/40 text-base mb-1.5">/mês</span>
                </div>
                {annual ? (
                  <p className="text-sm text-white/50">cobrado anualmente · R$ 478,80/ano</p>
                ) : (
                  <p className="text-sm text-white/50">cobrado mensalmente</p>
                )}
              </div>

              <Link href="/login" className="relative w-full py-3 text-center text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground block shadow-lg shadow-primary/30">
                Assinar PRO →
              </Link>

              <div className="relative flex-1 space-y-0">
                {planRows.map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-sm text-white/60">{row.label}</span>
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-success" aria-label="Incluído" />
                      ) : (
                        <span className="text-white/20 text-sm">—</span>
                      )
                    ) : (
                      <span className="text-sm font-semibold text-white">{row.pro}</span>
                    )}
                  </div>
                ))}
                <p className="text-xs text-white/30 pt-4 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden />
                  Não inclui certificado digital. O cliente deve possuir o seu próprio certificado A1.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  { name: "Ana Paula Ferreira", role: "Contadora", company: "Ferreira Contabilidade", avatar: "AF", color: "bg-primary", stars: 5, text: "Reduzi o tempo de emissão em 80%. Antes levava 20 minutos por NF-e, agora são menos de 3 minutos com o +NOTA." },
  { name: "Carlos Mendes", role: "Dono de MEI", company: "Mendes Serviços", avatar: "CM", color: "bg-blue-500", stars: 5, text: "Finalmente consigo emitir minhas próprias notas sem precisar de contador para cada emissão. Simples demais!" },
  { name: "Juliana Costa", role: "Sócia-contadora", company: "Costa & Silva Contabilidade", avatar: "JC", color: "bg-emerald-500", stars: 5, text: "Gerencio 47 clientes no mesmo sistema. O painel multi-empresa é exatamente o que precisávamos." },
  { name: "Roberto Alves", role: "Empresário", company: "Alves Comércio LTDA", avatar: "RA", color: "bg-violet-500", stars: 5, text: "Integração com SEFAZ impecável. Nenhuma nota foi recusada desde que migramos para o +NOTA." },
  { name: "Fernanda Lima", role: "Microempreendedora", company: "FL Design", avatar: "FL", color: "bg-amber-500", stars: 5, text: "Suporte fantástico! Tive dúvida às 22h e responderam em menos de 1 hora. Impressionante." },
  { name: "Marcos Oliveira", role: "Contador", company: "MO Assessoria Fiscal", avatar: "MO", color: "bg-rose-500", stars: 5, text: "Melhor custo-benefício do mercado. O plano PRO vale cada centavo para quem tem vários clientes." },
];

function Testimonials() {
  const all = [...testimonials, ...testimonials];
  return (
    <section className="py-24 overflow-hidden bg-white" aria-labelledby="testimonials-title">
      <FadeUp>
        <div className="text-center px-4 mb-16">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 id="testimonials-title" className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4 text-balance">
            O que dizem nossos clientes
          </h2>
          <p className="text-lg text-foreground/60 max-w-xl mx-auto text-pretty">
            Mais de 500 contadores e empresas já transformaram sua gestão fiscal.
          </p>
        </div>
      </FadeUp>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" aria-hidden />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" aria-hidden />

        <div className="flex gap-5 w-max animate-marquee" aria-label="Carrossel de depoimentos">
          {all.map((t, i) => (
            <article
              key={i}
              aria-label={i < testimonials.length ? `Depoimento de ${t.name}` : undefined}
              aria-hidden={i >= testimonials.length}
              className="w-[300px] sm:w-[340px] flex-shrink-0 bg-white border border-border rounded-2xl p-6 shadow-sm"
            >
              <div className="flex gap-0.5 mb-4" aria-label={`${t.stars} estrelas`}>
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" aria-hidden />
                ))}
              </div>
              <blockquote className="text-sm text-foreground/70 leading-relaxed mb-5 text-pretty">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <footer className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`} aria-hidden>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground/50">{t.role} · {t.company}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqs = [
  { q: "O +NOTA emite notas fiscais de verdade?", a: "Sim! O +NOTA é integrado com a SEFAZ e emite NF-e, NFC-e e NFS-e com plena validade jurídica. Você precisa ter seu próprio certificado digital A1 para transmissão." },
  { q: "Preciso de certificado digital para usar?", a: "Sim, para emissão de NF-e e NFC-e é obrigatório um certificado digital A1. O +NOTA é compatível com qualquer certificadora credenciada pelo ICP-Brasil. O certificado não é fornecido pela plataforma." },
  { q: "Posso gerenciar múltiplas empresas?", a: "Sim! No plano PRO você pode cadastrar e alternar entre quantas empresas quiser. Ideal para escritórios de contabilidade que atendem vários clientes CNPJ." },
  { q: "O que inclui o plano gratuito?", a: "O plano Free permite emitir 1 nota fiscal por mês para 1 empresa, com até 10 produtos e 10 clientes. Perfeito para conhecer a plataforma sem compromisso." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem multa e sem burocracia. Ao cancelar, você mantém o acesso até o fim do período pago e depois migra automaticamente para o plano Free." },
];

function FAQ() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-labelledby="faq-title">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <FadeUp className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">FAQ</p>
              <h2 id="faq-title" className="text-3xl sm:text-4xl font-black text-foreground mb-4 text-balance">
                Perguntas frequentes
              </h2>
              <p className="text-foreground/60 mb-8 text-pretty leading-relaxed">
                Não encontrou o que procura? Nossa equipe está disponível via WhatsApp para ajudar.
              </p>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Falar no WhatsApp
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={100} className="lg:col-span-3">
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-border rounded-xl overflow-hidden">
                  <button
                    id={`faq-btn-${idx}`}
                    aria-expanded={open === idx}
                    aria-controls={`faq-panel-${idx}`}
                    onClick={() => setOpen(open === idx ? -1 : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${open === idx ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {open === idx && (
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      className="px-5 pb-5 pt-1 text-sm text-foreground/60 leading-relaxed text-pretty border-t border-border/50"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 bg-foreground overflow-hidden" aria-label="Chamada para ação">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-dots)" />
        </svg>
      </div>

      <FadeUp>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/70 mb-8">
            <Zap className="w-4 h-4 text-primary" aria-hidden />
            Sem cartão de crédito · Cancele quando quiser
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 text-balance leading-[1.05]">
            Pronto para simplificar<br />sua emissão fiscal?
          </h2>
          <p className="text-xl text-white/60 mb-10 text-pretty leading-relaxed">
            Junte-se a 500+ empresas e contadores que já emitem notas fiscais com mais agilidade e menos estresse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(249,115,22,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              Criar conta grátis
              <ArrowRight className="w-5 h-5" aria-hidden />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Ver demonstração
            </button>
          </div>
          <p className="text-sm text-white/30 mt-6">Configuração em menos de 5 minutos</p>
        </div>
      </FadeUp>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setEmail(""); };
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-foreground text-white px-4 sm:px-6 lg:px-8" aria-label="Rodapé">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-0.5 mb-4 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
              <span className="text-2xl font-black text-primary">+</span>
              <span className="text-2xl font-black text-white">NOTA</span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs mb-6 leading-relaxed">
              O sistema de emissão de notas fiscais mais simples do Brasil. NF-e, NFC-e e NFS-e sem complicação.
            </p>
            <div className="flex gap-2 mb-8">
              {([
                [Twitter, "Twitter / X"],
                [Linkedin, "LinkedIn"],
                [Instagram, "Instagram"],
              ] as [React.ElementType, string][]).map(([Icon, label]) => (
                <button key={label} aria-label={label} className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-white/15 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Icon className="w-4 h-4" aria-hidden />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                [Shield, "LGPD Conforme"],
                [Lock, "Dados Protegidos"],
              ] as [React.ElementType, string][]).map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/40">
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-5">Produto</h3>
            <ul className="space-y-3">
              {([["features", "Funcionalidades"], ["pricing", "Preços"], ["faq", "FAQ"]] as [string, string][]).map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scroll(id)} className="text-sm text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-5">Suporte</h3>
            <ul className="space-y-3">
              {["Central de ajuda", "WhatsApp", "Contato", "Status do sistema"].map((l) => (
                <li key={l}>
                  <button className="text-sm text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded">
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-5">Newsletter</h3>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              Dicas fiscais e novidades do sistema no seu email.
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="w-4 h-4" aria-hidden />
                Inscrito com sucesso!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2" aria-label="Inscrição na newsletter">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" aria-hidden />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    aria-label="Seu email"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/8 border border-white/15 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground">
                  Inscrever-se
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-xs text-white/30">© 2026 +NOTA. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Termos de uso", "Privacidade", "LGPD", "Cookies"].map((l) => (
              <button key={l} className="text-xs text-white/30 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
