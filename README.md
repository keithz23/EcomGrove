# EcomGrove

EcomGrove is a modern and scalable eCommerce platform designed for seamless online shopping.

## Tech Stack

**Frontend:** Next.js, Zustand, React Hook Form, Tanstack Query

**Backend:** Node.js, NestJS, Prisma ORM, PostgreSQL, Redis, Docker

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** (latest version)
- **npm** (or yarn)
- **Git**
- **PostgreSQL Server & PgAdmin** (or another PostgreSQL client)

## Project Setup

### 1. Clone the project
```bash
git clone https://github.com/keithz23/EcomGrove
cd EcomGrove
```

### 2. Install Dependencies

#### **Frontend Installation**
```bash
cd ecomgrove-fe
npm install
```

#### **Backend Installation**
```bash
cd ecomgrove-be
npm install
```

## Environment Configuration

Create the required environment variable files for both frontend and backend.

### **Frontend Environment (`ecomgrove-fe/.env`)**
```ini
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_API_LOCAL=your_api_local
NEXT_PUBLIC_CALLBACK_URL=your_google_callback_url
NEXT_PUBLIC_SITE_URL=your_site_url
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_SECRET=your_paypal_secret
NEXT_PUBLIC_PAYPAL_API=your_paypal_api
```

### **Backend Environment (`ecomgrove-be/.env`)**
```ini
DATABASE_USER=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=ecomgrove
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/ecomgrove

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=your_jwt_expires_in
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=your_refresh_expires_in

MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_mail_user
MAIL_PASSWORD=your_mail_password
MAIL_FROM=your_mail_from

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_aws_bucket_name

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
PAYPAL_API=your_paypal_api

API_PREFIX=your_api_prefix
SWAGGER_TITLE=your_swagger_title
SWAGGER_DESCRIPTION=your_swagger_description
SWAGGER_VERSION=your_swagger_version

BCRYPT_SALT_ROUNDS=your_bcrypt_salt_round
THROTTLE_TTL=your_throttle_ttl
THROTTLE_LIMIT=your_throttle_limit

CORS_ORIGIN=your_cors_origin
CLIENT_URL=your_client_url

PORT=8000
```

## Database Setup

### **Initialize Prisma**
```bash
cd ecomgrove-be
npx prisma generate
npx prisma migrate dev --name init
```

**Alternative Commands:**

If applying existing migrations (e.g., in production):
```bash
npx prisma migrate deploy
```

To sync the schema without migration:
```bash
npx prisma db push
```

✅ **Verification:** Check PgAdmin or your PostgreSQL client to confirm the database is created correctly.

## Running the Application

### **Start Backend**
```bash
cd ecomgrove-be
npm run start:dev
```
The backend server will run on **http://localhost:8000**

### **Start Frontend**
```bash
cd ecomgrove-fe
npm run dev
```
The frontend will run on **http://localhost:3000** (default Next.js port)

## Development Notes

- Ensure **PostgreSQL is running** before launching the backend server
- Replace **all placeholder values** in `.env` files with actual credentials and configurations
- Use **`npx prisma migrate deploy`** to apply existing migrations in production
- The backend runs on port **8000** (as specified in the environment variables)

## Troubleshooting

- **Installation Issues:** Verify all prerequisites are installed and versions are compatible
- **Database Errors:** Ensure PostgreSQL is running and credentials in the DATABASE_URL are correct
- **Environment Issues:** Double-check all environment variables in `.env` files match the required format
- **Port Conflicts:** Ensure ports **3000** (frontend) and **8000** (backend) are available
- **Prisma Issues:** Run `npx prisma generate` if you encounter schema-related errors

## API Documentation

Once the backend is running, you can access the Swagger API documentation at:
```
http://localhost:8000/api/docs
```

---

This README provides clear, structured, and beginner-friendly setup instructions for EcomGrove. 🚀
