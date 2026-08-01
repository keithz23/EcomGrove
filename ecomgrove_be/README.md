# EcomGrove backend

NestJS API for authentication, catalog, cart, order, payment, and administration features.

## Commands

```bash
npm install
npm run start:dev
```

Before starting the API, set the required environment values in `.env`, then initialize Prisma:

```bash
npx prisma generate
npx prisma migrate deploy
```

Swagger is available at `http://localhost:8000/api/docs` by default. See the [root README](../README.md) for complete configuration.
