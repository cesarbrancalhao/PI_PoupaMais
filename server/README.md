# Server-side PoupaMais

API Backend para PoupaMais.

## Stacks

- **NestJS** - Framework Node.js
- **PostgreSQL** - Banco de dados
- **Docker & Docker Compose** - Containerização
- **Passport & JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **class-validator** - Validação de requests
- **Swagger** - Documentação da API

### Banco de Dados

- **usuario** - Contas de usuário
- **config** - Configurações do usuário (tema, idioma, moeda)
- **categoria_despesa** - Categorias de despesas
- **fonte_receita** - Fontes de receita
- **despesa** - Registros de despesas
- **receita** - Registros de receitas
- **meta** - Metas/orçamentos financeiros

### Módulos da API

- **Auth** - Registro, login, tokens JWT
- **Users** - Gerenciamento de perfil
- **Configs** - Configurações do usuário
- **Categoria (Despesa)** - CRUD para categorias de despesas
- **Fonte (Receita)** - CRUD para fontes de receita
- **Despesas** - CRUD para despesas
- **Receitas** - CRUD para receitas
- **Metas** - CRUD para metas financeiras

### Recursos de Segurança

- Hash de senhas com bcrypt
- Autenticação JWT
- Consultas SQL parametrizadas (proteção contra injeção SQL)
- Validação de entrada com class-validator
- Isolamento de dados do usuário (usuários só acessam seus próprios dados)
- Configuração CORS

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
docker-compose up postgres -d
# Iniciar app
npm run start:dev
```

Pronto! Sua API está rodando em `http://localhost:3000`

## Estrutura do Projeto

```
server/
├── src/
│   ├── auth/                   # Módulo de autenticação
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── auth.service.ts
│   ├── database/               # Conexão com banco
│   │   ├── database.service.ts
│   │   └── database.module.ts
│   ├── users/
│   ├── configs/
│   ├── categoria-despesa/
│   ├── fonte-receita/
│   ├── despesas/
│   ├── receitas/
│   ├── metas/
│   ├── common/                 # Interfaces e filtros compartilhados
│   ├── app.module.ts
│   └── main.ts
├── data.sql                    # Esquema do banco
├── docker-compose.yml          # Configuração Docker
├── Dockerfile
├── package.json
└── README.md
```

## Ambiente

Copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env
```

Atualize o `.env` com sua configuração:

```js
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=poupa_mais

JWT_SECRET=sua-chave-secreta-jwt
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3001
```

## Documentação da API

Documentação Swagger disponível em: **`http://localhost:3000/api/docs`**

## Endpoints da API

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/v1/auth/register | Registrar novo usuário | Não |
| POST | /api/v1/auth/login | Login de usuário | Não |
| GET | /api/v1/users/profile | Obter perfil do usuário | Sim |
| PUT | /api/v1/users/profile | Atualizar perfil | Sim |
| DELETE | /api/v1/users/account | Excluir conta | Sim |
| GET | /api/v1/configs | Obter configurações do usuário | Sim |
| PUT | /api/v1/configs | Atualizar configurações | Sim |
| GET/POST/PUT/DELETE | /api/v1/categoria-despesa | CRUD de categorias de despesas | Sim |
| GET/POST/PUT/DELETE | /api/v1/fonte-receita | CRUD de fontes de receita | Sim |
| GET/POST/PUT/DELETE | /api/v1/despesas | CRUD de despesas | Sim |
| GET/POST/PUT/DELETE | /api/v1/receitas | CRUD de receitas | Sim |
| GET/POST/PUT/DELETE | /api/v1/metas | CRUD de metas financeiras | Sim |

### Autenticação

Todos os endpoints exceto `/auth/register` e `/auth/login` requerem autenticação JWT.

Inclua o token JWT na header Authorization:

```js
Authorization: Bearer <seu_token>
```
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
Abra `http://localhost:3000/api/docs` no seu navegador para testar todos os endpoints interativamente.

### Usando cURL

**1. Registrar um usuário:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@example.com","password":"password123"}'
```

**2. Login:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"password123"}'
```

Copie o `access_token` da resposta.

**3. Criar uma categoria de despesa:**

```bash
curl -X POST http://localhost:3000/api/v1/categoria-despesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Alimentação","cor":"#FF5733"}'
```

**4. Criar uma despesa:**

```bash
curl -X POST http://localhost:3000/api/v1/despesas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Supermercado","valor":150.50,"recorrente":false,"data":"2025-10-09","categoria_despesa_id":1}'
```

**5. Obter todas as despesas:**

```bash
curl -X GET http://localhost:3000/api/v1/despesas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
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
docker-compose up -d

# Iniciar só o banco de dados
docker-compose up postgres -d

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (deleta dados do banco)
docker-compose down -v
```

## Gerenciamento do Banco de Dados

### Conectar ao PostgreSQL

```bash
docker exec -it poupa_mais_db psql -U postgres -d poupa_mais
```

## Arquivos Chave para Entender

1. **src/database/database.service.ts** - Pool de conexão PostgreSQL e execução de consultas SQL puras
2. **src/auth/auth.service.ts** - Registro e login de usuário com bcrypt
3. **src/despesas/despesas.service.ts** - Exemplo de operações CRUD com SQL puro
4. **data.sql** - Esquema completo do banco de dados com índices

## Solução de Problemas

**Porta já em uso:**

```bash
# Alterar a PORT no arquivo .env
PORT=3001
```

**Erro de conexão com banco de dados:**

```bash
# Cheque se o Docker está rodando
docker-compose up postgres -d

# Cheque se o banco está pronto
docker-compose logs postgres
```

**Resetar banco de dados:**

```bash
docker-compose down -v
docker-compose up postgres -d
```