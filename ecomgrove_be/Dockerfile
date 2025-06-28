FROM node:23-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start:dev"]
