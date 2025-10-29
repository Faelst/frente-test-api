Projeto NestJS + Prisma + PostgreSQL + Auth (JWT) + PokeAPI

Este guia explica como:

Subir o PostgreSQL com Docker

Configurar .env

Gerar o client do Prisma e rodar migrations

Subir a API NestJS

Testar rotas principais

✅ Requisitos

Node +22

Yarn ou npm

Docker + Docker Compose

(Opcional) Postman/Insomnia ou curl

⚙️ 1. Variáveis de ambiente

Crie o arquivo .env na raiz (onde fica a pasta prisma/):

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db?schema=public"
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN="7d"

Se rodar tudo dentro do Docker (NestJS e Postgres no mesmo docker-compose), use postgres como host:

DATABASE_URL="postgresql://postgres:postgres@postgres:5432/app_db?schema=public"

Se você usa prisma.config.ts, ele já carrega dotenv:

// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
schema: 'prisma/schema.prisma',
migrations: { path: 'prisma/migrations' },
engine: 'classic',
datasource: { url: env('DATABASE_URL') },
});

🐘 2. Subir o PostgreSQL com Docker

Crie o docker-compose.yml (se ainda não existir) e suba apenas o banco:

docker-compose up -d postgres

Verifique:

docker ps

# deve mostrar a porta 5432 exposta

🗄️ 3. Prisma – Generate & Migrate

Instale deps (se necessário):

yarn

# ou: npm install

Gere o client do Prisma:

yarn prisma:generate

# ou: npx prisma generate

Crie/aplique as migrations (DEV):

yarn prisma:migrate

# ou: npx prisma migrate dev --name init

Em produção/CI, use:

yarn prisma:deploy

# ou: npx prisma migrate deploy

Abrir o Prisma Studio (opcional):

yarn prisma:studio

🚀 4. Rodar a API

Desenvolvimento (hot reload):

yarn start:dev

# ou: npm run start:dev

Build + produção:

yarn build
yarn start:prod

Por padrão a API sobe em http://localhost:3000
.

🔑 5. Rotas principais
POST /auth/signup

Cria usuário.

Body

{
"name": "Rafael",
"email": "fael@example.com",
"password": "123456",
"confirmPassword": "123456"
}

Resposta

{ "success": true }

POST /auth/signin

Autentica e retorna token JWT.

Body

{
"email": "fael@example.com",
"password": "123456"
}

Resposta

{
"token": "jwt_here",
"name": "Rafael",
"email": "fael@example.com"
}

GET /pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/:name

Rota autenticada (JWT Bearer).
Exemplo com curl:

TOKEN="coloque_o_token_aqui"

curl -H "Authorization: Bearer $TOKEN" \
 http://localhost:3000/pokemon/fetch-skills-by-pokemon-name-order-by-skill-name/pikachu

Resposta (exemplo)

{
"pokemon": "pikachu",
"abilities": ["lightning-rod", "static", "volt-absorb"]
}

📜 Scripts úteis (package.json)
{
"scripts": {
"start": "nest start",
"start:dev": "nest start --watch",
"start:prod": "node dist/main.js",
"build": "nest build",

    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:ci": "jest --ci --runInBand --passWithNoTests",

    "lint": "eslint 'src/**/*.ts' --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit",

    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev --name init",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset --force",

    "db:up": "docker-compose up -d postgres",
    "db:down": "docker-compose down",
    "db:logs": "docker logs -f nest_postgres",

    "prepare": "husky install"

}
}

Ajuste os scripts conforme seu setup. Se preferir npm, troque yarn por npm run.

🧪 Testes

Unitários: yarn test

E2E (com nock e supertest): yarn test:e2e

No E2E, o JwtAuthGuard é sobrescrito para liberar acesso, e chamadas à PokeAPI são interceptadas por nock.

🛠️ Troubleshooting

P1001: Can’t reach database server

Verifique se o Postgres está rodando (docker ps)

Cheque a porta no docker-compose (ex.: 5432) e no .env

Se usa Postgres.app no macOS, ele pode usar portas altas (512xx); alinhe a porta no .env.

Missing required environment variable: DATABASE_URL

Confirme o .env na raiz (mesma pasta do prisma/)

Se usa prisma.config.ts, ele já faz import 'dotenv/config' (ok).

Evite ter DATABASE_URL exportada no shell conflitante (printenv | grep DATABASE_URL).

supertest default import quebrando no Jest

Habilite esModuleInterop no tsconfig.spec.json, ou importe como const request = require('supertest').

📦 Estrutura (resumo)
.
├─ prisma/
│ ├─ schema.prisma
│ └─ migrations/
├─ src/
│ ├─ app.module.ts
│ ├─ prisma/
│ │ ├─ prisma.module.ts
│ │ └─ prisma.service.ts
│ ├─ modules/
│ │ ├─ auth/ (use-cases + repository + controller + jwt)
│ │ └─ pokemon/ (controller + use-case PokeAPI)
└─ docker-compose.yml

🤝 Contribuição

Crie sua branch: feat/minha-feature

Rode lint e testes antes de abrir PR

Na PR, o CI valida: lint, unit, e2e
