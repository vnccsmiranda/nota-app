"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validação básica antes de chamar a API
    if (!email.trim()) {
      setError("Por favor, informe seu email.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Por favor, informe sua senha.");
      setIsLoading(false);
      return;
    }

    // Verifica se o email existe antes de tentar o login
    try {
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const checkData = await checkRes.json();

      if (!checkRes.ok || !checkData.exists) {
        setError("Não encontramos uma conta com esse email. Deseja criar uma conta?");
        setIsLoading(false);
        return;
      }

      if (!checkData.hasPassword) {
        setError("Essa conta foi criada via Google. Use o botão 'Continuar com Google' para entrar.");
        setIsLoading(false);
        return;
      }
    } catch {
      // Se a rota não existir ainda, continua o fluxo normal
    }

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (res?.error) {
      setError("Senha incorreta. Verifique e tente novamente.");
      setIsLoading(false);
    } else if (res?.url) {
      window.location.href = res.url;
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className="bg-muted min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-xl border border-border px-6 py-12 shadow-md">

          {/* Logo */}
          <div className="flex flex-col items-center gap-y-1">
            <Link href="/" className="flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded">
              <span className="text-3xl font-bold text-primary">+</span>
              <span className="text-3xl font-bold text-foreground">NOTA</span>
            </Link>
            <p className="text-sm text-muted-foreground">Entrar na sua conta</p>
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 focus:ring-2 focus:ring-primary"
            onClick={handleGoogle}
            disabled={isGoogleLoading || isLoading}
            aria-label="Entrar com Google"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Redirecionando..." : "Continuar com Google"}
          </Button>

          {/* Divisor */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou entre com email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form email/senha */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
                autoComplete="email"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
                autoComplete="current-password"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full mt-1"
              disabled={isLoading || isGoogleLoading || !email || !password}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-muted-foreground flex justify-center gap-1 text-sm">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
