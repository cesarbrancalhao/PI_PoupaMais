# PI_PoupaMais

**Projeto acadêmico do IFPR.**

PoupaMais é um sistema completo para gestão de finanças pessoais, desenvolvido para ajudar usuários a registrar despesas, receitas, definir metas financeiras e visualizar sua saúde financeira por meio de dashboards interativos.

## Documentação Detalhada

Para informações aprofundadas sobre partes específicas da aplicação, consulte a documentação dedicada:

- **[Documentação do Frontend (Cliente)](client/README.md)**: Detalhes sobre Next.js 15, componentes de UI, gráficos e estilização.
- **[Documentação do Backend (Servidor)](server/README.md)**: Detalhes sobre API NestJS, schema do banco, autenticação e endpoints.

---

## Tecnologias Utilizadas

### Frontend (Cliente)
- **Frameworks:** Next.js 15, React 19
- **Estilização:** Tailwind CSS 4, Framer Motion
- **Visualização:** Chart.js, React-Chartjs-2
- **Ferramentas:** TypeScript, Jest, Lucide React

### Backend (Servidor)
- **Frameworks:** NestJS (Node.js)
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker & Docker Compose
- **Segurança:** Passport, JWT, Bcrypt, Throttler
- **Validação:** class-validator, class-transformer

---

## Estrutura do Projeto

```
PI_PoupaMais/
├── client/                 # Aplicação Frontend Next.js
│   ├── src/app/            # Páginas do App Router
│   ├── src/components/     # Componentes de UI e Gráficos
│   └── ...
├── server/                 # API Backend NestJS
│   ├── src/                # Módulos da API (Auth, Usuários, Transações)
│   ├── data.sql            # Schema do Banco & Triggers
│   └── ...
├── Makefile                # Scripts de automação
└── README.md               # Este arquivo
```

---

## Início Rápido & Comandos Makefile

Este projeto inclui um **Makefile** para facilitar o desenvolvimento, instalação e gerenciamento do banco de dados. Você pode usar **Docker** ou **Podman** (Utilize <comando>-pod para comandos Podman).

### Fluxo de Desenvolvimento

| Comando        | Descrição                                                                                  |
| :------------- | :----------------------------------------------------------------------------------------- |
| `make init`    | Instala dependências de client/server, sobe o banco e executa em modo dev.                 |
| `make dev`     | Inicia o Client e o Server em modo desenvolvimento (requer banco ativo).                   |
| `make prod`    | Faz build e executa Client e Server em produção.                                           |

### Instalação & Manutenção

| Comando           | Descrição                                                    |
| :---------------- | :----------------------------------------------------------  |
| `make install`    | Instala as dependências npm de `client` e `server`.          |
| `make clean`      | Remove arquivos de build e para containers Docker.           |

### Gerenciamento do Banco de Dados

| Comando              | Descrição                                          |
| :------------------- | :--------------------------------------------------|
| `make db`            | Sobe o container PostgreSQL.                       |
| `make db-purge`      | Remove container e volume do banco de dados.       |

## Requisitos

- **Node.js**: v20+
- **Runtime de Containers**: Docker ou Podman
- **Gerenciador de Pacotes**: npm ou yarn