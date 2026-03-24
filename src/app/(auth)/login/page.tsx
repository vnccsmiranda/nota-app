"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    if (process.env.NODE_ENV === "development") {
      await signIn("credentials", { email: "dev@maisnota.com", callbackUrl: "/dashboard" });
    } else {
      await signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    if (process.env.NODE_ENV === "development") {
      await signIn("credentials", { email, callbackUrl: "/dashboard" });
    } else {
      await signIn("resend", { email, callbackUrl: "/dashboard" });
      setEmailSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-primary">+</span>
            <span className="text-3xl font-bold text-foreground">NOTA</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Entrar no +NOTA
          </p>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full gap-3"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar com Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Email Magic Link */}
        {emailSent ? (
          <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-center">
            <p className="text-sm font-medium text-success">
              Link mágico enviado!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifique sua caixa de entrada em {email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email}
            >
              Enviar link mágico
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Ao entrar, você concorda com os{" "}
          <a href="/termos" className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="/privacidade" className="underline hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded px-1">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
