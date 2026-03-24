"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie sua conta e preferências.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" defaultValue="Miranda" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue="vnccs.miranda@gmail.com"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              O email não pode ser alterado por aqui.
            </p>
          </div>
          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Zona de perigo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Excluir sua conta é irreversível. Todos os dados, empresas, clientes
            e notas fiscais serão permanentemente removidos.
          </p>
          <Button variant="destructive">Excluir minha conta</Button>
        </CardContent>
      </Card>
    </div>
  );
}
