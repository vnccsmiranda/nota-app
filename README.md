# +NOTA

Sistema SaaS de emissão de notas fiscais eletrônicas (NF-e, NFC-e, NFS-e) voltado para contadores e empresas brasileiras. Permite que um contador gerencie múltiplas empresas e emita notas para qualquer uma delas.

## Stack Tecnológico

| Tecnologia | Versão | Função |
|---|---|---|
| **Next.js** | 14+ | Framework full-stack (App Router) |
| **TypeScript** | - | Tipagem strict |
| **Tailwind CSS** | 4 | Estilização e design tokens |
| **TanStack Query** | - | Data fetching client-side |
| **Prisma** | 6 | ORM + migrations (PostgreSQL) |
| **Zod** | - | Validação de schemas |
| **Auth.js** | v5 | Autenticação (Google OAuth + Magic Link) |
| **Stripe SDK** | v20 | Pagamentos e assinaturas |
| **shadcn/ui** | - | Componentes UI customizados |
| **Resend** | - | Emails transacionais |
| **next-themes** | - | Light/Dark mode |

## Pré-requisitos

- **Node.js** 20+ (recomendado 20.x LTS)
- **npm** ou **yarn**
- **PostgreSQL** 14+ (Neon, Supabase ou local)
- **Conta Stripe** com API key
- **Projeto Google Cloud** com OAuth2 configurado
- **Resend API Key** para emails transacionais

## Instalação e Setup

### 1. Clone o repositório
```bash
git clone <seu-repo-url>
cd nota-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com seus valores:
- `DATABASE_URL`: String de conexão PostgreSQL
- `AUTH_SECRET`: Gerado com `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`: Do Google Cloud Console
- `AUTH_RESEND_KEY`: API key do Resend
- `STRIPE_*`: Keys do Stripe
- `NEXT_PUBLIC_APP_URL`: URL da aplicação

### 4. Configure o banco de dados
```bash
npx prisma migrate dev
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev com hot reload

# Build e produção
npm run build           # Build otimizado para produção
npm run start           # Inicia servidor em modo produção

# Design System
npm run tokens          # Regenera globals.css a partir de tokens.ts

# Storybook (componentes)
npm run storybook       # Inicia Storybook em http://localhost:6006
npm run storybook:build # Build do Storybook

# Lint e format
npm run lint            # ESLint
npm run format          # Prettier
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/                 # Páginas de autenticação
│   │   └── login/
│   ├── (dashboard)/            # Área logada do SaaS
│   │   ├── layout.tsx          # Sidebar + Header + Theme toggle
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── companies/          # CRUD de empresas
│   │   ├── customers/          # CRUD de clientes
│   │   ├── products/           # CRUD de produtos/serviços
│   │   ├── invoices/           # Emissão e listagem de notas
│   │   ├── billing/            # Planos e pagamento
│   │   └── settings/           # Configurações da conta
│   ├── (marketing)/            # Landing page pública
│   │   ├── page.tsx            # Home/Landing
│   │   └── pricing/            # Página de preços
│   ├── api/                    # API routes
│   │   ├── auth/               # Auth.js routes
│   │   ├── companies/          # CRUD endpoints
│   │   ├── customers/          # CRUD endpoints
│   │   ├── products/           # CRUD endpoints
│   │   ├── invoices/           # Emissão e cancelamento
│   │   └── stripe/             # Webhooks
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Sidebar, Header, ThemeToggle
│   ├── invoices/               # Componentes de emissão
│   └── shared/                 # Componentes reutilizáveis
├── lib/
│   ├── auth.ts                 # Configuração Auth.js v5
│   ├── prisma.ts               # Singleton Prisma client
│   ├── stripe.ts               # Stripe client (lazy init)
│   ├── subscription.ts         # Lógica de planos e limites
│   └── utils.ts                # Helpers gerais
├── design-system/
│   ├── tokens.ts               # Fonte única de verdade dos tokens
│   ├── generate-css.ts         # Gerador de CSS global
│   └── utils.ts                # Helpers de conversão (hex↔HSL, rem↔px)
├── middleware.ts               # Middleware Edge (autenticação)
├── globals.css                 # CSS gerado automaticamente
└── prisma/
    └── schema.prisma           # Schema do banco de dados
```

## Conceito de Multi-Empresa

O modelo central é: **User → Companies → (Customers, Products, Invoices)**

Um usuário (contador) pode:
1. **Cadastrar múltiplas empresas** (seus clientes)
2. **Selecionar uma empresa ativa** via company switcher no header
3. Todos os CRUDs (clientes, produtos, notas) são **filtrados pela empresa selecionada**
4. No plano **FREE**, só pode ter **1 empresa**
5. No plano **PRO**, pode ter **empresas ilimitadas**

### Fluxo de Emissão de Nota (Simplificado para MVP)

1. Seleciona empresa ativa (company switcher)
2. Clica "Nova Nota"
3. Escolhe tipo (NF-e, NFC-e, NFS-e)
4. Seleciona destinatário (cliente) ou cria novo
5. Adiciona itens (produtos/serviços)
6. Sistema calcula impostos automaticamente
7. Preview da nota
8. Confirma e envia para processamento
9. Status atualizado (Autorizada / Rejeitada)
10. DANFE disponível para download/impressão

**Observação MVP:** A transmissão real à SEFAZ é simulada (mock). A integração real com WebService SOAP da SEFAZ será implementada na v2. O MVP foca na UX completa do fluxo.

## Planos e Limites

### Plano FREE
- 1 nota por mês
- 1 empresa
- 10 produtos
- 10 clientes
- Sem relatórios
- Suporte community

### Plano PRO
- Notas ilimitadas por mês
- Empresas ilimitadas
- Produtos ilimitados
- Clientes ilimitados
- Relatórios avançados
- Suporte prioritário (WhatsApp/Remoto)
- Implantação e treinamento grátis

**Preços:**
- Mensal: R$ 49,90/mês
- Anual: R$ 39,90/mês (R$ 478,80/ano) — **20% de desconto**

**Nota:** O certificado digital deve ser fornecido pelo cliente (não incluso no plano)

## Design System

O design system tem uma **fonte única de verdade**: `src/design-system/tokens.ts`

### Paleta de Cores

**Cor Primária:** #F55E00 (laranja)

**Modo Light:**
- Fundo: #FFFFFF (branco)
- Foreground: #1A1A1A (cinza escuro)
- Border: #E5E5E5 (cinza claro)

**Modo Dark:**
- Fundo: #0F0F0F (preto profundo)
- Foreground: #F5F5F5 (branco)
- Border: #2A2A2A (cinza escuro)

### Usar Tokens Semânticos

Nunca use hex hardcoded em componentes. Use tokens Tailwind:

```tsx
// ✗ Evitar
<div className="bg-[#FFFFFF] text-[#1A1A1A]">

// ✓ Fazer
<div className="bg-background text-foreground">
```

### Regenerar CSS Global

Toda vez que editar `tokens.ts`:

```bash
npm run tokens
```

Isso regenera `src/globals.css` com as variáveis CSS `:root` e `.dark`

## Autenticação

Utiliza **Auth.js v5** com:
- **Google OAuth 2.0** para login social
- **Magic Link via Email** (Resend) como alternativa

### Variáveis de Ambiente Auth
```
AUTH_SECRET=                    # Gerado com: openssl rand -base64 32
AUTH_GOOGLE_ID=                 # Do Google Cloud Console
AUTH_GOOGLE_SECRET=             # Do Google Cloud Console
AUTH_RESEND_KEY=                # API key do Resend
AUTH_URL=http://localhost:3000  # URL da app (para OAuth callback)
```

### Middleware

O middleware em `src/middleware.ts` valida a sessão via cookie `authjs.session-token` e redireciona usuarios não autenticados para `/login`.

**Observação:** O middleware roda na Edge (<1MB), portanto:
- ✓ Permitido: Verificar cookies, headers
- ✗ Não permitido: Importar Prisma, Auth config, Resend, etc.

## Stripe Integration

**API Version:** 2026-02-25

### Webhook Events Tratados
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Variáveis Stripe
```
STRIPE_SECRET_KEY=              # Chave secreta
STRIPE_WEBHOOK_SECRET=          # Webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Chave pública
STRIPE_PRO_MONTHLY_PRICE_ID=    # ID do preço mensal
STRIPE_PRO_YEARLY_PRICE_ID=     # ID do preço anual
```

## Regras Absolutas de Desenvolvimento

### TypeScript
- ✓ `strict: true` sempre ativado
- ✓ Tipos explícitos em APIs, componentes e funções
- ✗ Nunca usar `any` — use `unknown` + type guard

### Estilização
- ✓ Tokens semânticos Tailwind (bg-primary, text-foreground)
- ✗ Hex hardcoded em componentes
- ✓ next-themes para Light/Dark

### API Routes
- ✓ Validação Zod em todos os endpoints
- ✓ Tratamento de erros consistente
- ✓ Status HTTP apropriados

### Banco de Dados
- ✓ Prisma 6 com PostgreSQL
- ✓ Migrações versionadas
- ✓ Índices para queries frequentes

## Deployment

### Vercel

A forma recomendada é deploy na **Vercel**:

```bash
git push origin main
```

Vercel detecará uma aplicação Next.js e fará o build automaticamente.

**Variáveis de Ambiente na Vercel:**
1. Vá para Settings → Environment Variables
2. Adicione todas as variáveis de `.env.local`
3. Faça deploy

### Variáveis Obrigatórias
- `DATABASE_URL` (banco de dados PostgreSQL)
- `AUTH_SECRET` (gerado)
- `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`
- `AUTH_RESEND_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL` (URL de produção)

## Licença

Proprietária. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para contadores brasileiros.**
