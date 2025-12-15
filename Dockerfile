FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npm run build


FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN mkdir -p ./doc

EXPOSE 4000

CMD ["node", "dist/main"]