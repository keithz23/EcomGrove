#!/bin/sh
echo "Running Prisma Migrations..."
npx prisma migrate dev
echo "Starting NestJS..."
exec npm run dev
