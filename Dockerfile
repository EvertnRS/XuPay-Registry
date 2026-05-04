FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

EXPOSE 5000

CMD ["npx", "tsx", "src/index.ts"]