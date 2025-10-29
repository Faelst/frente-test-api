# 🧩 PokeDash API

> API desenvolvida em **NestJS + TypeScript** com **Prisma ORM** e **PostgreSQL**, servindo como backend para o app mobile **PokeDash**.  
> Inclui autenticação JWT, integração com a PokeAPI, testes automatizados e pipeline de CI/CD.

---

## 🚀 Principais Features

| Categoria                                               | Descrição                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| 🧠 **Arquitetura Limpa (Clean Architecture)**           | Separação entre camadas: controller → use-case → repository       |
| 🔐 **Autenticação JWT**                                 | Rotas `/auth/signup` e `/auth/signin` com geração de token seguro |
| 💾 **Prisma ORM + PostgreSQL**                          | Mapeamento de dados moderno e migrations automáticas              |
| 🧪 **Testes Unitários e E2E (Jest + Supertest + Nock)** | Testes com mocks da PokeAPI e autenticação simulada               |
| 🐳 **Docker + Docker Compose**                          | Subida automatizada do Postgres e da API                          |
| 🧱 **CI/CD (GitHub Actions)**                           | Pipeline com lint, typecheck, testes unitários e e2e              |
| 🧰 **Husky + Commitlint**                               | Padronização de commits e validação de código antes do push       |
| 📦 **TypeScript + ESLint + Prettier**                   | Padrões consistentes e tipagem completa                           |
| 🧩 **PokeAPI Integration**                              | Busca e ordenação de habilidades de Pokémon via endpoint externo  |

---

## 📁 Estrutura do Projeto

```
api/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ prisma/
│  │  ├─ prisma.module.ts
│  │  └─ prisma.service.ts
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ use-cases/
│  │  │  │  ├─ signin.usecase.ts
│  │  │  │  └─ signup.usecase.ts
│  │  │  ├─ auth.repository.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ dto/
│  │  │  │  ├─ signin.dto.ts
│  │  │  │  └─ signup.dto.ts
│  │  └─ pokemon/
│  │     ├─ use-cases/
│  │     │  └─ fetch-skills-by-pokemon-name.usecase.ts
│  │     └─ pokemon.controller.ts
│  └─ shared/
│     ├─ utils/
│     └─ guards/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ prisma.config.ts
├─ test/
│  ├─ unit/
│  └─ e2e/
├─ docker-compose.yml
└─ package.json
```

---

## ⚙️ Setup do Ambiente

### 1️⃣ Clone o projeto

```bash
git clone https://github.com/seuusuario/pokedash-api.git
cd pokedash-api
```

### 2️⃣ Crie o arquivo `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db?schema=public"
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="7d"
```

> ⚠️ Caso use Docker, o host deve ser `postgres` (e não `localhost`).

---

## 🐳 Subindo o Banco de Dados

```bash
docker-compose up -d postgres
```

Verifique se o container está rodando:

```bash
docker ps
# deve exibir o serviço postgres
```

---

## 🧱 Prisma ORM

Gerar o client:

```bash
yarn prisma:generate
```

Criar migrations e aplicar:

```bash
yarn prisma:migrate
```

Visualizar dados no Prisma Studio:

```bash
yarn prisma:studio
```

---

## 🧩 Execução da API

Modo desenvolvimento (hot reload):

```bash
yarn start:dev
```

Build e execução em produção:

```bash
yarn build && yarn start:prod
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Endpoints Principais

### POST `/auth/signup`

Cria um novo usuário.

```json
{
  "name": "Ash",
  "email": "ash@pokedash.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

### POST `/auth/signin`

Autentica o usuário e retorna o token JWT.

```json
{
  "email": "ash@pokedash.com",
  "password": "123456"
}
```

### GET `/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/:name`

Rota protegida (JWT). Retorna habilidades ordenadas do Pokémon.

---

## 🧪 Testes Automatizados

Executar testes unitários e e2e:

```bash
yarn test
yarn test:e2e
```

Exemplo de teste E2E (com `nock`):

```ts
nock('https://pokeapi.co')
  .get('/api/v2/pokemon/pikachu')
  .reply(200, {
    abilities: [
      { ability: { name: 'static' } },
      { ability: { name: 'lightning-rod' } },
    ],
  });
```

---

## ⚙️ CI/CD – GitHub Actions

### 🧾 Workflow: `.github/workflows/ci.yml`

Executa automaticamente no **Pull Request**:

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn typecheck
      - run: yarn test
      - run: yarn test:e2e
```

---

## 🧹 Husky + Commitlint

Verificações automáticas antes do commit:

- **Lint** (`eslint` + `prettier`)
- **Testes unitários**
- **Mensagem de commit** (padrão **Conventional Commits**)

Scripts úteis:

```bash
yarn lint
yarn format
yarn typecheck
yarn test
yarn prepare
```

---

## 🧠 Features Futuras

- [ ] Rate limiting com Redis
- [ ] Cache da PokeAPI (TTL dinâmico)
- [ ] Monitoramento com Prometheus
- [ ] Integração com CI/CD para deploy automático em produção

---

## 👨‍💻 Autor

**Rafael Silverio**  
Desenvolvedor Fullstack Sênior • NestJS | Prisma | PostgreSQL | TypeScript  
🚀 [LinkedIn](https://www.linkedin.com/in/rafael-silverio) | [GitHub](https://github.com/Faelst)
