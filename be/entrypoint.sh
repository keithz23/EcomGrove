#!/bin/sh

is_mysql_ready() {
  npx prisma migrate dev --name init > /dev/null 2>&1
}

echo "⏳ Waiting for MySQL to be ready..."

RETRIES=15

until is_mysql_ready || [ $RETRIES -eq 0 ]; do
  echo "❌ MySQL not ready. Retrying in 2s... ($RETRIES retries left)"
  RETRIES=$((RETRIES - 1))
  sleep 2
done

if [ $RETRIES -eq 0 ]; then
  echo "🚨 MySQL not ready after multiple attempts. Exiting."
  exit 1
fi

echo "✅ MySQL is ready!"
echo "🚀 Running Prisma Migrations..."
npx prisma migrate dev --name init

echo "🎯 Starting NestJS application..."
exec npm run dev
