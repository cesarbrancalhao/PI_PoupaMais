# Client-side PoupaMais

Frontend para PoupaMais - Interface moderna, responsiva e intuitiva para gerenciamento completo de finanças pessoais.

## Stacks

- **Next.js 15** - Framework React com App Router e Server Actions
- **React 19** - Biblioteca para construção de interfaces
- **Tailwind CSS 4** - Framework de estilização utility-first
- **Chart.js & React-Chartjs-2** - Visualização de dados e gráficos interativos
- **Framer Motion** - Biblioteca de animações fluidas
- **Lucide React** - Ícones modernos e consistentes
- **Next Themes** - Gerenciamento de temas (Dark/Light mode)
- **Jest & React Testing Library** - Testes unitários e de integração

### Funcionalidades da Interface

- **Dashboard Interativo** - Visão geral com gráficos de saldo, tendências e distribuição.
- **Gestão de Transações** - Interfaces para adicionar, editar e excluir despesas e receitas.
- **Controle de Metas** - Visualização de progresso de metas financeiras.
- **Análises Detalhadas** - Gráficos de alocação de ativos e despesas por categoria.
- **Multi-idioma e Moeda** - Suporte a configurações regionais do usuário.
- **Autenticação Segura** - Login, registro e recuperação de senha.
- **Responsividade** - Layout adaptável para desktop, tablets e mobile.

## Requisitos

- Node.js 20+
- npm ou yarn
- API Backend (Server-side PoupaMais) rodando localmente

## Início Rápido (3 Passos)

```bash
# Instalar Dependências
cd client
npm i 

# Copie as variáveis de ambiente e atualize com seus dados se necessário
cp .env.local.example .env.local

# Iniciar aplicação
npm run dev
```

Pronto! Sua aplicação está rodando em `http://localhost:3000`

### Charts Interativos
Implementação robusta de gráficos para visualização financeira:
- **BalanceChart**: Evolução do saldo ao longo do tempo.
- **ExpenseDistribution**: Gráfico de rosca para categorias.
- **MonthlyTrend**: Comparativo mensal de receitas x despesas.
- **GoalAllocation**: Progresso visual das metas.

## Estrutura do Projeto

```
client/
├── src/
│   ├── app/                   # App Router (Páginas e Layouts)
│   │   ├── analise/           # Página de análises gráficas
│   │   ├── auth/              # Login
│   │   ├── cadastro/          # Registro de usuário
│   │   ├── configuracoes/     # Configurações de usuário/app
│   │   ├── dashboard/         # Painel principal
│   │   ├── metas/             # Gerenciamento de metas
│   │   ├── terminology/       # Contextos de idioma/moeda
│   │   ├── layout.tsx         # Layout raiz
│   │   └── page.tsx           # Landing page
│   ├── components/            # Componentes Reutilizáveis
│   │   ├── ...Chart.tsx       # Componentes de Gráficos (Chart.js)
│   │   ├── ...Modal.tsx       # Modais de formulário (Adicionar/Editar)
│   │   ├── sidebar.tsx        # Navegação lateral
│   │   └── ProtectedRoute.tsx # Guard de rotas protegidas
│   ├── contexts/              # Contextos React (Auth, Theme)
│   ├── services/              # Integração com API Backend
│   │   ├── api.ts             # Instância do Axios
│   │   ├── auth.service.ts    # Serviços de autenticação
│   │   └── ...service.ts      # Serviços de domínio (Despesas, Metas, etc.)
│   └── types/                 # Definições de Tipos TypeScript
├── public/                    # Assets estáticos (imagens, ícones)
├── .env.local.example         # Exemplo de variáveis de ambiente
├── tailwind.config.ts         # Configuração de estilos
└── next.config.ts             # Configuração do Next.js
```

## Scripts Disponíveis

```bash
# Servidor de Desenvolvimento
npm run dev

# Build de Produção
npm run build

# Iniciar Produção
npm run start

# Linting
npm run lint

# Testes
npm run test
npm run test:watch
```

## Conexão com Backend

O frontend se comunica com a API através da pasta `src/services`.
O arquivo `src/services/api.ts` configura o interceptor do Axios para incluir automaticamente o token JWT (armazenado em cookies) em todas as requisições autenticadas.

## Componentes Principais

### Gráficos (Chart.js)
Localizados em `src/components`, utilizam `react-chartjs-2` para renderizar visualizações financeiras responsivas.

### Modais
Utilizados para formulários de criação e edição (ex: `addDespesaModal.tsx`, `editMetaModal.tsx`), garantindo uma experiência de usuário fluida sem navegação excessiva.

### Contextos
- **AuthContext**: Gerencia o estado de autenticação do usuário e persistência de sessão.
- **ThemeContext**: Gerencia a alternância entre temas Claro/Escuro.
- **LanguageContext**: Gerencia a localização (i18n) e formatação de moeda.