"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PaywallGateProps {
  children: React.ReactNode;
  allowed: boolean;
  current: number;
  limit: number;
  resource: string;
}

export function PaywallGate({
  children,
  allowed,
  current,
  limit,
  resource,
}: PaywallGateProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => setShowModal(true)}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
        role="button"
        tabIndex={0}
        aria-label={`Limite atingido: ${current}/${limit} ${resource}`}
      >
        <div className="pointer-events-none opacity-50">{children}</div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Upgrade necessário"
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={() => {}}
            role="document"
          >
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Limite atingido
              </h3>
              <p className="text-sm text-muted-foreground">
                Você atingiu o limite de{" "}
                <span className="font-medium text-foreground">
                  {limit} {resource}
                </span>{" "}
                do plano gratuito ({current}/{limit}).
              </p>
              <p className="text-sm text-muted-foreground">
                Faça upgrade para o plano PRO e tenha acesso ilimitado.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Depois
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push("/dashboard/billing")}
                >
                  Ver planos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
