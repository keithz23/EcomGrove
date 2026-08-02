# State 1: Build
FROM node:23-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install && npm run build

# State 2: Run
FROM node:23-alpine
WORKDIR /app

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "run", "start"]
