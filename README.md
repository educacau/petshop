# PetShop Banho & Tosa

Sistema web completo para gestão de um pet shop com foco em agendamentos de banho e tosa. O projeto segue boas práticas de arquitetura (Clean Architecture, SOLID) e utiliza uma stack moderna com Node.js, React, Prisma e Docker.

## ?? Estrutura do Projeto

`
PetShop/
+-- backend/        # API RESTful em Node.js + Express + Prisma
+-- frontend/       # Interface web em React + Vite + TailwindCSS
+-- docker-compose.yml
+-- .github/
`

## ?? Funcionalidades Principais
- Autenticação JWT com perfis (Administrador, Funcionário, Cliente)
- Cadastro e gerenciamento de usuários, pets e agendamentos
- Validação automática de disponibilidade por funcionário/horário
- Painel administrativo com relatórios e indicadores
- Painel do cliente com histórico e gerenciamento dos próprios agendamentos
- Painel do funcionário com agenda do dia e atualização de status
- Envio de notificações (driver console) ao confirmar agendamentos
- Documentação da API com Swagger disponível em /api-docs

## ?? Stack & Ferramentas
- **Backend:** Node.js, Express, Prisma, PostgreSQL, Zod, Winston, Morgan, Jest, Supertest
- **Frontend:** React, TypeScript, Vite, React Query, React Hook Form, TailwindCSS, Recharts, Testing Library, Vitest
- **Infra:** Docker, docker-compose, GitHub Actions (CI)

## ?? Como Executar

### Pré-requisitos
- Node.js >= 18
- Docker e docker-compose (opcional, apenas para execução containerizada)

### Configuração do Backend
`ash
cd backend
cp .env.example .env
# ajuste DATABASE_URL e JWT_SECRET conforme necessário
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
`
A API ficará disponível em http://localhost:3000 e a documentação Swagger em http://localhost:3000/api-docs.

### Configuração do Frontend
`ash
cd frontend
cp .env.example .env
npm install
npm run dev
`
O frontend ficará disponível em http://localhost:5173.

### Execução via Docker
`ash
docker-compose up --build
`
Serviços expostos:
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
O schema Prisma está em ackend/prisma/schema.prisma. Para popular dados de exemplo execute:
`ash
cd backend
npm run seed
`

## ?? Scripts Principais

| Local      | Script                | Descrição                               |
|------------|----------------------|------------------------------------------|
| backend    | 
pm run dev        | API em modo desenvolvimento              |
| backend    | 
pm run build      | Compila código TypeScript                |
| backend    | 
pm run test       | Executa testes com Jest/Supertest        |
| frontend   | 
pm run dev        | Inicia Vite dev server                   |
| frontend   | 
pm run build      | Gera build de produção                   |
| frontend   | 
pm run test       | Executa testes com Vitest                |

## ?? Documentação da API
A especificação OpenAPI está em ackend/swagger/openapi.json. Atualize o arquivo executando:
`ash
cd backend
npm run swagger
`

## ?? Acesso e Perfis de Teste
Após executar as seeds, os seguintes usuários estarão disponíveis:

| Perfil        | E-mail                        | Senha      |
|---------------|------------------------------|------------|
| Administrador | admin@petshop.com            | Admin@123  |
| Funcionário   | maria.staff@petshop.com      | Staff@123  |
| Cliente       | joao.cliente@petshop.com     | Cliente@123|

## ??? Roadmap de Evolução
- Integração real com provedores de e-mail/SMS
- Notificações em tempo real (WebSockets)
- Gestão avançada de disponibilidade e múltiplas unidades
- Exportação de relatórios (PDF/CSV)

---
Desenvolvido com ?? para facilitar a gestão de cuidados com pets.
