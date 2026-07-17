# Horizon Finance

Sistema pessoal de controle financeiro multi-país e multi-moeda (BR/EUA): contas,
cartões de crédito, categorias customizáveis, orçamento, metas e dashboard.

Refatorado de um protótipo single-file (`controle-financeiro.jsx`) para uma
aplicação **Next.js (App Router) + TypeScript** com arquitetura modular por
domínio, persistência real em **Supabase**, e camadas bem separadas de estado.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 14 (App Router) + React 18 + TypeScript |
| Dados remotos | Supabase (Postgres + Auth + RLS) |
| Server state | TanStack Query |
| Estado global de UI | Zustand |
| Formulários | React Hook Form |
| Validação | Zod |
| Gráficos / ícones | Recharts · lucide-react |

## Arquitetura (feature-based)

```
src/
├── app/                      # App Router: layouts, rotas, providers, middleware
│   ├── (auth)/login/         # Rota pública de autenticação
│   ├── (app)/                # Rotas protegidas (dashboard, contas, …)
│   ├── providers.tsx         # QueryClientProvider
│   └── layout.tsx
│
├── features/                 # Um módulo por domínio (components + hooks + schemas)
│   ├── auth/
│   ├── accounts/
│   ├── transactions/
│   ├── categories/
│   ├── goals/
│   ├── budget/
│   ├── cards/
│   ├── dashboard/
│   └── settings/
│
├── components/
│   ├── ui/                   # Design system: Button, Input, Modal, Card, …
│   └── layouts/              # AppShell, Sidebar, Topbar, ModalHost
│
├── services/
│   ├── supabase/             # Client + um service por entidade (queries/mutations)
│   └── api/                  # Seam para APIs REST externas (não-Supabase)
│
├── hooks/                    # Hooks transversais (useFinanceData)
├── stores/                   # Zustand stores (UI global)
├── types/                    # Modelos de domínio + linhas do banco
├── constants/                # Tokens de tema, ícones, navegação, opções
├── utils/                    # Funções puras (moeda, datas, cálculos financeiros, CSV)
└── lib/                      # Infra (env, query client, helpers de estilo)

supabase/
└── migrations/0001_init.sql  # Schema + Row Level Security
```

### Responsabilidades por camada

- **components** — apenas renderização e interação. Sem regra de negócio.
- **features/\*/hooks** — estado, chamadas a services, formulários e regras da feature.
- **services/supabase** — *toda* comunicação com o banco. Componentes nunca
  chamam o Supabase diretamente.
- **utils** — funções puras reutilizáveis (cálculos financeiros são testáveis
  isoladamente, sem React).
- **types / constants** — contratos de tipo e valores fixos centralizados.

### Estados

- **UI** (mês selecionado, modais abertos) → Zustand (`stores/ui-store.ts`).
- **Autenticação** → Supabase Auth via `features/auth`.
- **Dados do servidor** (contas, lançamentos, categorias, metas, settings) →
  TanStack Query, com chaves de cache centralizadas em `lib/react-query.ts`.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e rode a migração
   `supabase/migrations/0001_init.sql` no SQL Editor (cria as tabelas + RLS).

3. Copie o exemplo de variáveis de ambiente e preencha com as credenciais do seu
   projeto (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

4. Rode em desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse http://localhost:3000, crie uma conta e — se a confirmação de e-mail
   estiver desativada no Supabase — os dados iniciais de exemplo são semeados
   automaticamente no primeiro acesso.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (tsc) |

## Segurança

- **Isolamento por usuário:** cada tabela tem `user_id` + políticas RLS que
  restringem toda operação às linhas do usuário autenticado.
- **Sem segredos no client:** apenas a chave *anon* pública é exposta
  (`NEXT_PUBLIC_*`); o acesso é limitado pelas políticas RLS.
- **Guarda de rotas:** o middleware (`src/middleware.ts`) exige sessão válida
  para as rotas de aplicação e redireciona para `/login`.
- **Validação de entrada:** todos os formulários validam com Zod antes de
  enviar ao banco.

## Roadmap

- [ ] PWA instalável / app nativo (Capacitor ou Expo)
- [ ] Leitura automática de faturas em PDF (hoje CSV)
- [ ] Recorrências automáticas (assinaturas, contas fixas)
- [ ] Cotação de câmbio ao vivo via `services/api`
- [ ] Testes (Vitest para `utils/finance`, Playwright para os fluxos)
