"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName?: string;
  companyName?: string;
}

export function Header({ userName, companyName }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6" role="banner">
      {/* Left: Company info */}
      <div role="region" aria-label="Empresa selecionada">
        {companyName && (
          <p className="text-sm text-muted-foreground">
            Empresa: <span className="font-medium text-foreground">{companyName}</span>
          </p>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2" role="toolbar" aria-label="Ações do header">
        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Alternar para tema claro" : "Alternar para tema escuro"}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
          <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
        </Button>

        {/* User */}
        {userName && (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5" role="region" aria-label={`Usuário: ${userName}`}>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground" aria-hidden="true">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground">{userName}</span>
          </div>
        )}
      </div>
    </header>
  );
}
