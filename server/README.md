# Server-side PoupaMais

API Backend para PoupaMais - Sistema completo de gerenciamento de finanças pessoais.

## Stacks

- **NestJS** - Framework Node.js
- **PostgreSQL** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização
- **Passport & JWT** - Autenticação e autorização
- **bcrypt** - Hash de senhas
- **class-validator & class-transformer** - Validação de requests
- **Swagger** - Documentação interativa da API
- **Throttler** - Rate limiting para proteção contra abuso

### Banco de Dados

- **usuario** - Contas de usuário
- **config** - Configurações do usuário (tema, idioma, moeda)
- **categoria_despesa** - Categorias de despesas personalizadas (com ícones)
- **fonte_receita** - Fontes de receita personalizadas (com ícones)
- **despesa** - Registros de despesas (suporta recorrência e vencimentos)
- **receita** - Registros de receitas (suporta recorrência e vencimentos)
- **despesa_exclusao** - Exclusões específicas de despesas recorrentes
- **receita_exclusao** - Exclusões específicas de receitas recorrentes
- **meta** - Metas/objetivos financeiros (com tracking automático)
- **contribuicao_meta** - Contribuições para metas

### Módulos da API

- **Auth** - Registro, login, tokens JWT
- **Users** - Gerenciamento de perfil de usuário
- **Configs** - Configurações do usuário (tema, idioma, moeda)
- **Categoria Despesa** - CRUD para categorias de despesas
- **Fonte Receita** - CRUD para fontes de receita
- **Despesas** - CRUD completo para despesas + gerenciamento de exclusões
- **Receitas** - CRUD completo para receitas + gerenciamento de exclusões
- **Metas** - CRUD para metas/objetivos financeiros
- **Contribuicao Meta** - CRUD para contribuições às metas

### Recursos de Segurança

- Hash de senhas com bcrypt (salt rounds: 10)
- Autenticação JWT com estratégia Passport
- Rate limiting (100 requisições por minuto por IP)
- Consultas SQL parametrizadas (proteção contra SQL injection)
- Validação rigorosa de entrada com class-validator
- Isolamento total de dados por usuário
- Configuração CORS restritiva
- Validação de variáveis de ambiente obrigatórias
- Filtro global de exceções para tratamento de erros

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

## Início Rápido (3 Passos)

```bash
# Instalar Dependências
cd server
npm i 
# Iniciar Banco de Dados
docker compose up postgres -d
# Iniciar app
npm run start:dev
```

Pronto! Sua API está rodando em `http://localhost:3001`

## ✨ O Que Há de Novo

Desde a primeira versão, o servidor foi significativamente expandido:

### Novos Recursos
- **Sistema de Exclusões**: Exclua ocorrências específicas de despesas/receitas recorrentes
- **Sistema de Metas**: Crie metas financeiras com tracking automático
- **Contribuições**: Registre contribuições para suas metas com atualização automática do progresso
- **Ícones Personalizados**: Categorias e fontes agora suportam ícones customizados
- **Paginação**: Todos os endpoints de listagem suportam paginação
- **Rate Limiting**: Proteção contra abuso com throttling de requisições
- **Datas de Vencimento**: Despesas e receitas agora suportam data_vencimento
- **Validação Aprimorada**: Validação de variáveis de ambiente obrigatórias no startup
- **Tratamento de Erros**: Filtro global de exceções para respostas consistentes
- **Deleção Inteligente**: Ao deletar categorias/fontes, as referências são automaticamente removidas

### Melhorias no Banco de Dados
- **Triggers SQL**: Atualização automática de `valor_atual` nas metas
- **Novas Tabelas**: `despesa_exclusao`, `receita_exclusao`, `contribuicao_meta`
- **Índices Otimizados**: Performance melhorada em queries por usuário
- **Constraints Robustos**: Validações a nível de banco de dados

### Melhorias de Segurança
- Rate limiting (Throttler)
- Validação rigorosa de environment variables
- Filtro global de exceções
- Validação de tipos com class-transformer

## Estrutura do Projeto

```
server/
├── src/
│   ├── auth/                      # Módulo de autenticação
│   │   ├── dto/                   # DTOs de login e registro
│   │   ├── guards/                # Guards JWT e Local
│   │   ├── strategies/            # Estratégias Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── database/                  # Pool PostgreSQL
│   │   ├── database.service.ts
│   │   └── database.module.ts
│   ├── users/                     # Gerenciamento de usuários
│   ├── configs/                   # Configurações (tema, idioma, moeda)
│   ├── categoria-despesa/         # Categorias com ícones
│   ├── fonte-receita/             # Fontes de receita com ícones
│   ├── despesas/                  # Despesas + exclusões
│   │   ├── dto/
│   │   ├── despesas.controller.ts
│   │   ├── despesas.service.ts   # Inclui lógica de exclusões
│   │   └── despesas.module.ts
│   ├── receitas/                  # Receitas + exclusões
│   │   ├── dto/
│   │   ├── receitas.controller.ts
│   │   ├── receitas.service.ts   # Inclui lógica de exclusões
│   │   └── receitas.module.ts
│   ├── metas/                     # Metas financeiras
│   ├── contribuicao-meta/         # Contribuições para metas
│   │   ├── dto/
│   │   ├── contribuicao-meta.controller.ts
│   │   ├── contribuicao-meta.service.ts
│   │   └── contribuicao-meta.module.ts
│   ├── common/                    # Compartilhado
│   │   ├── dto/                   # DTOs globais (paginação)
│   │   ├── filters/               # Filtros de exceção
│   │   └── interfaces/            # Interfaces compartilhadas
│   ├── app.module.ts              # Módulo raiz
│   └── main.ts                    # Bootstrap da aplicação
├── data.sql                       # Schema + triggers + índices
├── docker compose.yml             # PostgreSQL containerizado
├── Dockerfile
├── package.json
└── README.md
```

## Ambiente

Crie um arquivo `.env` na raiz do projeto server:

```bash
touch .env
```

Adicione as seguintes variáveis de ambiente:

```bash
# Ambiente
NODE_ENV=development
PORT=3001

# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=poupa_mais

# JWT (OBRIGATÓRIO - mude para uma chave segura em produção)
JWT_SECRET=sua-chave-secreta-jwt-mude-em-producao
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

**⚠️ IMPORTANTE**: As variáveis `JWT_SECRET`, `DB_HOST` e `DB_PASSWORD` são obrigatórias. A aplicação não iniciará sem elas.

## Documentação da API

Documentação Swagger disponível em: **`http://localhost:3001/api/docs`**

## Endpoints da API

### Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/auth/register | Registrar novo usuário | Não |
| POST | /api/v1/auth/login | Login de usuário | Não |

### Usuários
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | /api/v1/users/profile | Obter perfil do usuário | Sim |
| PUT | /api/v1/users/profile | Atualizar perfil | Sim |
| DELETE | /api/v1/users/account | Excluir conta | Sim |

### Configurações
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | /api/v1/configs | Obter configurações do usuário | Sim |
| PUT | /api/v1/configs | Atualizar configurações (tema, idioma, moeda) | Sim |

### Categorias de Despesas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/categoria-despesa | Criar categoria (nome + ícone) | Sim |
| GET | /api/v1/categoria-despesa | Listar todas as categorias | Sim |
| GET | /api/v1/categoria-despesa/:id | Obter categoria por ID | Sim |
| PUT | /api/v1/categoria-despesa/:id | Atualizar categoria | Sim |
| DELETE | /api/v1/categoria-despesa/:id | Excluir categoria | Sim |

### Fontes de Receitas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/fonte-receita | Criar fonte (nome + ícone) | Sim |
| GET | /api/v1/fonte-receita | Listar todas as fontes | Sim |
| GET | /api/v1/fonte-receita/:id | Obter fonte por ID | Sim |
| PUT | /api/v1/fonte-receita/:id | Atualizar fonte | Sim |
| DELETE | /api/v1/fonte-receita/:id | Excluir fonte | Sim |

### Despesas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/despesas | Criar despesa (suporta recorrência) | Sim |
| GET | /api/v1/despesas?page=1&limit=10 | Listar despesas (paginado) | Sim |
| GET | /api/v1/despesas/:id | Obter despesa por ID | Sim |
| PUT | /api/v1/despesas/:id | Atualizar despesa | Sim |
| DELETE | /api/v1/despesas/:id | Excluir despesa | Sim |
| POST | /api/v1/despesas/:id/exclusoes | Criar exclusão para despesa recorrente | Sim |
| GET | /api/v1/despesas/exclusoes/all | Listar todas as exclusões | Sim |
| DELETE | /api/v1/despesas/exclusoes/:id | Remover exclusão | Sim |

### Receitas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/receitas | Criar receita (suporta recorrência) | Sim |
| GET | /api/v1/receitas?page=1&limit=10 | Listar receitas (paginado) | Sim |
| GET | /api/v1/receitas/:id | Obter receita por ID | Sim |
| PUT | /api/v1/receitas/:id | Atualizar receita | Sim |
| DELETE | /api/v1/receitas/:id | Excluir receita | Sim |
| POST | /api/v1/receitas/:id/exclusoes | Criar exclusão para receita recorrente | Sim |
| GET | /api/v1/receitas/exclusoes/all | Listar todas as exclusões | Sim |
| DELETE | /api/v1/receitas/exclusoes/:id | Remover exclusão | Sim |

### Metas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/metas | Criar meta financeira | Sim |
| GET | /api/v1/metas?page=1&limit=10 | Listar metas (paginado) | Sim |
| GET | /api/v1/metas/:id | Obter meta por ID | Sim |
| PUT | /api/v1/metas/:id | Atualizar meta | Sim |
| DELETE | /api/v1/metas/:id | Excluir meta | Sim |

### Contribuições de Metas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/contribuicao-meta | Criar contribuição para uma meta | Sim |
| GET | /api/v1/contribuicao-meta?page=1&limit=10 | Listar todas as contribuições | Sim |
| GET | /api/v1/contribuicao-meta/meta/:metaId | Listar contribuições por meta | Sim |
| GET | /api/v1/contribuicao-meta/:id | Obter contribuição por ID | Sim |
| PUT | /api/v1/contribuicao-meta/:id | Atualizar contribuição | Sim |
| DELETE | /api/v1/contribuicao-meta/:id | Excluir contribuição | Sim |

### Autenticação

Todos os endpoints exceto `/auth/register` e `/auth/login` requerem autenticação JWT.

Inclua o token JWT na header Authorization:

```js
Authorization: Bearer <seu_token>
```

## Recursos Avançados

### 1. Sistema de Exclusões para Recorrências

Permite excluir ocorrências específicas de despesas/receitas recorrentes sem afetar as outras:

- Despesa/receita recorrente continua ativa
- Exclusões são registradas com data específica
- Sistema ignora ocorrências excluídas em cálculos

**Exemplo de uso**: Seu aluguel é recorrente todo mês, mas em dezembro você não pagou porque estava viajando. Crie uma exclusão para dezembro/2025.

### 2. Sistema de Metas com Contribuições

Metas financeiras com tracking automático:

- `valor`: Valor total da meta
- `valor_atual`: Calculado automaticamente pela soma das contribuições
- `economia_mensal`: Valor planejado para economizar por mês
- `data_inicio` e `data_alvo`: Período para alcançar a meta

**Trigger automático**: Quando você adiciona/remove/atualiza contribuições, o `valor_atual` da meta é recalculado automaticamente.

### 3. Paginação

Todos os endpoints de listagem suportam paginação via query params:

```
?page=1&limit=10
```

Defaults: `page=1`, `limit=10`

### 4. Ícones Personalizados

Categorias de despesas e fontes de receita suportam ícones customizados (ex: "ShoppingCart", "Home", "Car", "DollarSign").

### 5. Configurações Multi-idioma e Multi-moeda

Cada usuário pode configurar:
- **Tema**: Claro (false) ou Escuro (true)
- **Idioma**: português, inglês, espanhol
- **Moeda**: real, dólar, euro

### 6. Rate Limiting

Proteção contra abuso: máximo de 100 requisições por minuto por IP.

## Request flow da API

1. Entry point: Controller

```js
@Controller('auth')
export class AuthController {
  @Post('register')
  @Post('login')
}
```

2. Validação DTO

```js
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}
```

3. Guards de autenticação (em rotas protegidas)

```js
@UseGuards(LocalAuthGuard)
@Post('login')
async login(@Body() loginDto: LoginDto, @Request() req) {
  return this.authService.login(req.user);
}
```

4. Execução de Strategies

```js
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }
}
```

5. BLL (regras de negócio)

```js
export class AuthService {
  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.databaseService.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email],
    );
    if (!await bcrypt.compare(password, user.senha)) {
      return null;
    }
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
```

## Testando a API

### Usando Swagger UI
Abra `http://localhost:3001/api/docs` no seu navegador para testar todos os endpoints interativamente.

### Usando cURL

**1. Registrar um usuário:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com","password":"password123"}'
```

**2. Login:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password123"}'
```

Copie o `access_token` da resposta.

**3. Criar uma categoria de despesa (com ícone):**

```bash
curl -X POST http://localhost:3001/api/v1/categoria-despesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Alimentação","icone":"ShoppingCart"}'
```

**4. Criar uma despesa recorrente:**

```bash
curl -X POST http://localhost:3001/api/v1/despesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome":"Aluguel",
    "valor":1200.00,
    "recorrente":true,
    "data":"2025-11-05",
    "data_vencimento":"2025-11-05",
    "categoria_despesa_id":1
  }'
```

**5. Obter despesas (com paginação):**

```bash
curl -X GET "http://localhost:3001/api/v1/despesas?page=1&limit=10" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**6. Criar uma exclusão para despesa recorrente:**

```bash
curl -X POST http://localhost:3001/api/v1/despesas/1/exclusoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"data_exclusao":"2025-12-05"}'
```

**7. Criar uma meta financeira:**

```bash
curl -X POST http://localhost:3001/api/v1/metas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome":"Viagem para Europa",
    "descricao":"Férias de verão",
    "valor":10000.00,
    "economia_mensal":500.00,
    "data_inicio":"2025-01-01",
    "data_alvo":"2025-12-31"
  }'
```

**8. Adicionar contribuição a uma meta:**

```bash
curl -X POST http://localhost:3001/api/v1/contribuicao-meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "meta_id":1,
    "valor":500.00,
    "data":"2025-11-20",
    "observacao":"Contribuição de novembro"
  }'
```

## Desenvolvimento

```bash
# Executar em Dev
npm run start:dev

# Em prod
npm run build
npm run start:prod

# Formatação
npm run format

# Linting
npm run lint
```

## Docker comms

```bash
# Iniciar todos os serviços
docker compose up -d

# Iniciar só o banco de dados
docker compose up postgres -d

# Ver logs
docker compose logs -f

# Parar todos os serviços
docker compose down

# Parar e remover volumes (deleta dados do banco)
docker compose down -v
```

## Gerenciamento do Banco de Dados

### Conectar ao PostgreSQL

```bash
docker exec -it poupa_mais_db psql -U postgres -d poupa_mais
```

### Comandos Úteis SQL

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d+ despesa

-- Verificar triggers
\dS+ contribuicao_meta

-- Consultar metas com valor atual
SELECT id, nome, valor, valor_atual, 
       ROUND((valor_atual / valor * 100), 2) as progresso_percentual
FROM meta 
WHERE usuario_id = 1;

-- Ver contribuições de uma meta
SELECT c.id, c.valor, c.data, c.observacao, m.nome as meta_nome
FROM contribuicao_meta c
JOIN meta m ON c.meta_id = m.id
WHERE c.usuario_id = 1
ORDER BY c.data DESC;

-- Verificar exclusões de despesas recorrentes
SELECT d.nome as despesa, de.data_exclusao
FROM despesa_exclusao de
JOIN despesa d ON de.despesa_id = d.id
WHERE de.usuario_id = 1
ORDER BY de.data_exclusao;
```

### Schema Highlights

**Triggers Automáticos:**
- `trigger_atualizar_meta`: Atualiza automaticamente `valor_atual` da meta quando contribuições são inseridas/atualizadas/deletadas

**Constraints:**
- Valores decimais com 2 casas (DECIMAL(11,2))
- Checks de valores positivos em despesas, receitas e metas
- Foreign keys com ON DELETE CASCADE para limpeza automática

**Índices:**
- Índices em todas as foreign keys
- Índices em `usuario_id` para queries rápidas por usuário
- Índices compostos para exclusões (despesa_id, receita_id)

**Enums e Tipos:**
```sql
-- Idiomas suportados
idioma_enum: 'portugues', 'ingles', 'espanhol'

-- Moedas suportadas
moeda_enum: 'real', 'dolar', 'euro'
```

## Arquivos Chave para Entender

1. **data.sql** - Esquema completo do banco de dados com triggers e índices
2. **src/database/database.service.ts** - Pool de conexão PostgreSQL e execução de consultas SQL
3. **src/auth/auth.service.ts** - Registro, login e validação de usuário com bcrypt
4. **src/despesas/despesas.service.ts** - Operações CRUD de despesas + exclusões recorrentes
5. **src/receitas/receitas.service.ts** - Operações CRUD de receitas + exclusões recorrentes
6. **src/metas/metas.service.ts** - Gerenciamento de metas financeiras
7. **src/contribuicao-meta/contribuicao-meta.service.ts** - Sistema de contribuições com atualização automática de metas
8. **src/main.ts** - Configuração global da aplicação (CORS, pipes, Swagger, rate limiting)
9. **src/common/filters/http-exception.filter.ts** - Tratamento global de exceções

## Solução de Problemas

**Porta já em uso:**

```bash
# Alterar a PORT no arquivo .env
PORT=3001
```

**Erro de conexão com banco de dados:**

```bash
# Verifique se o Docker está rodando
docker compose up postgres -d

# Verifique os logs do PostgreSQL
docker compose logs postgres

# Teste a conexão manualmente
docker exec -it poupa_mais_db psql -U postgres -d poupa_mais -c "\l"
```

**Aplicação não inicia - variáveis de ambiente faltando:**

```bash
# Erro: "Variável de ambiente JWT_SECRET não definida"
# Solução: Crie o arquivo .env com todas as variáveis obrigatórias
# JWT_SECRET, DB_HOST, DB_PASSWORD são obrigatórias
```

**Resetar banco de dados completamente:**

```bash
# Para e remove volumes (ATENÇÃO: deleta todos os dados!)
docker compose down -v

# Reinicia o banco de dados limpo
docker compose up postgres -d

# Aguarde 5-10 segundos para o banco inicializar
sleep 10

# O schema será aplicado automaticamente via data.sql
```

**Rate limit atingido (429 Too Many Requests):**

```
# Aguarde 60 segundos ou ajuste o limite em src/app.module.ts
# Configuração atual: 100 requisições por minuto
```