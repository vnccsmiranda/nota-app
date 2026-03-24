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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar conta.");
      setIsLoading(false);
      return;
    }

    // Login automático após cadastro
    const loginRes = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (loginRes?.url) {
      window.location.href = loginRes.url;
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  if (success) {
    return (
      <section className="bg-muted min-h-screen">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="bg-background flex w-full max-w-sm flex-col items-center gap-y-6 rounded-xl border border-border px-6 py-12 shadow-md text-center">
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold text-primary">+</span>
              <span className="text-3xl font-bold text-foreground">NOTA</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-foreground">Conta criada! 🎉</p>
              <p className="text-sm text-muted-foreground">
                Acesse sua conta para começar a emitir notas fiscais.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Ir para o login
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
            <p className="text-sm text-muted-foreground">Crie sua conta gratuita</p>
          </div>

          {/* Google OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 focus:ring-2 focus:ring-primary"
            onClick={handleGoogle}
            disabled={isGoogleLoading || isLoading}
            aria-label="Cadastrar com Google"
          >
            <GoogleIcon />
            {isGoogleLoading ? "Redirecionando..." : "Continuar com Google"}
          </Button>

          {/* Divisor */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou cadastre com email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                autoComplete="name"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

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
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
                autoComplete="new-password"
                className="focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirm">Confirmar senha</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repita a senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                required
                autoComplete="new-password"
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
              disabled={isLoading || isGoogleLoading || !email || !password || !confirm}
            >
              {isLoading ? "Criando conta..." : "Criar conta grátis"}
            </Button>
          </form>

          <p className="text-muted-foreground flex justify-center gap-1 text-sm">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
