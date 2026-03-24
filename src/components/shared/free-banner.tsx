"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FreeBannerProps {
  show: boolean;
}

export function FreeBanner({ show }: FreeBannerProps) {
  if (!show) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
      <p className="text-sm text-foreground">
        Você está no plano{" "}
        <span className="font-semibold">gratuito</span>. Upgrade para PRO e
        emita notas ilimitadas.
      </p>
      <Button asChild size="sm">
        <Link href="/dashboard/billing">Ver planos</Link>
      </Button>
    </div>
  );
}
