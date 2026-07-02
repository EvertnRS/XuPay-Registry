FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]