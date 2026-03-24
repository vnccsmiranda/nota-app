"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  FileText,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    label: "Clientes",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Notas Fiscais",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    label: "Plano & Cobrança",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    label: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card" aria-label="Menu principal">
      {/* Logo */}
      <div className="flex h-16 items-center gap-1 border-b border-border px-6">
        <span className="text-2xl font-bold text-primary">+</span>
        <span className="text-2xl font-bold text-foreground">NOTA</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4" role="navigation" aria-label="Navegação do dashboard">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
          aria-label="Sair da conta"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Sair
        </button>
      </div>
    </aside>
  );
}
