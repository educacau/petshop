FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npm run prisma:generate

COPY tsconfig.json ./
COPY src ./src
COPY swagger ./swagger

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY --from=base /app/prisma ./prisma
RUN npm run prisma:generate

COPY --from=base /app/dist ./dist
COPY --from=base /app/swagger ./swagger

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:migrate && node dist/src/server.js"]




