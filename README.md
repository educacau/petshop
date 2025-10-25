# PetShop Banho & Tosa

Sistema web completo para gest�o de um pet shop com foco em agendamentos de banho e tosa. O projeto segue boas pr�ticas de arquitetura (Clean Architecture, SOLID) e utiliza uma stack moderna com Node.js, React, Prisma e Docker.

## ?? Estrutura do Projeto

`
PetShop/
+-- backend/        # API RESTful em Node.js + Express + Prisma
+-- frontend/       # Interface web em React + Vite + TailwindCSS
+-- docker-compose.yml
+-- .github/
`

## ?? Funcionalidades Principais
- Autentica��o JWT com perfis (Administrador, Funcion�rio, Cliente)
- Cadastro e gerenciamento de usu�rios, pets e agendamentos
- Valida��o autom�tica de disponibilidade por funcion�rio/hor�rio
- Painel administrativo com relat�rios e indicadores
- Painel do cliente com hist�rico e gerenciamento dos pr�prios agendamentos
- Painel do funcion�rio com agenda do dia e atualiza��o de status
- Envio de notifica��es (driver console) ao confirmar agendamentos
- Documenta��o da API com Swagger dispon�vel em /api-docs

## ?? Stack & Ferramentas
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Zod, Winston, Morgan, Jest, Supertest
- **Frontend:** React, TypeScript, Vite, React Query, React Hook Form, TailwindCSS, Recharts, Testing Library, Vitest
- **Infra:** Docker, docker-compose, GitHub Actions (CI)

## ?? Como Executar

### Pr�-requisitos
- Node.js >= 18
- Docker e docker-compose (opcional, apenas para execu��o containerizada)

### Configura��o do Backend
`ash
cd backend
cp .env.example .env
# ajuste DATABASE_URL e JWT_SECRET conforme necess�rio
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
`
A API ficar� dispon�vel em http://localhost:3000 e a documenta��o Swagger em http://localhost:3000/api-docs.

### Configura��o do Frontend
`ash
cd frontend
cp .env.example .env
npm install
npm run dev
`
O frontend ficar� dispon�vel em http://localhost:5173.

### Execu��o via Docker
`ash
docker-compose up --build
`
Servi�os expostos:
- API: http://localhost:3000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

## ?? Testes e Qualidade
- **Backend:** 
pm run lint, 
pm run test
- **Frontend:** 
pm run lint, 
pm run test, 
pm run build

O pipeline de CI (.github/workflows/ci.yml) valida lint, testes e build para os dois pacotes.

## ??? Banco de Dados & Seeds
O schema Prisma est� em ackend/prisma/schema.prisma. Para popular dados de exemplo execute:
`ash
cd backend
npm run seed
`

## ?? Scripts Principais

| Local      | Script                | Descri��o                               |
|------------|----------------------|------------------------------------------|
| backend    | 
pm run dev        | API em modo desenvolvimento              |
| backend    | 
pm run build      | Compila c�digo TypeScript                |
| backend    | 
pm run test       | Executa testes com Jest/Supertest        |
| frontend   | 
pm run dev        | Inicia Vite dev server                   |
| frontend   | 
pm run build      | Gera build de produ��o                   |
| frontend   | 
pm run test       | Executa testes com Vitest                |

## ?? Documenta��o da API
A especifica��o OpenAPI est� em ackend/swagger/openapi.json. Atualize o arquivo executando:
`ash
cd backend
npm run swagger
`

## ?? Acesso e Perfis de Teste
Ap�s executar as seeds, os seguintes usu�rios estar�o dispon�veis:

| Perfil        | E-mail                        | Senha      |
|---------------|------------------------------|------------|
| Administrador | admin@petshop.com            | Admin@123  |
| Funcion�rio   | maria.staff@petshop.com      | Staff@123  |
| Cliente       | joao.cliente@petshop.com     | Cliente@123|

## ??? Roadmap de Evolu��o
- Integra��o real com provedores de e-mail/SMS
- Notifica��es em tempo real (WebSockets)
- Gest�o avan�ada de disponibilidade e m�ltiplas unidades
- Exporta��o de relat�rios (PDF/CSV)

---
Desenvolvido com ?? para facilitar a gest�o de cuidados com pets.
