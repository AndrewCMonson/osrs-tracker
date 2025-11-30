# OSRS Tracker

This repository contains an Old School RuneScape account tracker built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup (Required for Progress Tracking)

The app works without a database for basic player lookups, but progress tracking charts require a PostgreSQL database.

#### Option A: Using pgAdmin4 (Recommended for Local Development)

1. **Find Your PostgreSQL Connection Details:**
   - Open pgAdmin4
   - In the left sidebar, right-click on your PostgreSQL server (usually named "PostgreSQL" or similar)
   - Select **Properties**
   - Go to the **Connection** tab
   - Note the following:
     - **Host name/address** (usually `localhost` or `127.0.0.1`)
     - **Port** (usually `5432`)
     - **Username** (usually `postgres`)
   - You'll need your PostgreSQL password (the one you set during installation)

2. **Create the Database:**
   - In pgAdmin4, right-click on **Databases** in the left sidebar
   - Select **Create** → **Database...**
   - Enter `osrs_tracker` as the database name
   - Click **Save**

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env` (if not already done)
   - Open `.env` and update the `DATABASE_URL` with your connection details:
     ```
     DATABASE_URL="postgresql://username:password@host:port/osrs_tracker"
     ```
   - Replace:
     - `username` with your PostgreSQL username (usually `postgres`)
     - `password` with your PostgreSQL password
     - `host` with your host (usually `localhost`)
     - `port` with your port (usually `5432`)
   - Example:
     ```
     DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/osrs_tracker"
     ```

4. **Generate Prisma Client and Run Migrations:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   npm run prisma:migrate -- --name add_snapshots
   ```

   Or use the direct commands:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma migrate dev --name add_snapshots
   ```

#### Option B: Without Database (Basic Features Only)

If you skip database setup, the app will work for basic player lookups but progress tracking charts will be disabled.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Connection String Format

The `DATABASE_URL` follows this format:
```
postgresql://username:password@host:port/database_name
```

**Important Notes:**
- If your password contains special characters, URL-encode them (e.g., `@` becomes `%40`)
- The database name should match what you created in pgAdmin4 (`osrs_tracker`)
- Keep your `.env` file secure and never commit it to version control

What's included

- Next.js app router skeleton
- Prisma schema for core models
- Mock OSRS & verification libraries (placeholders)
- Basic pages and API route stubs

Next steps

- Wire up real OSRS API calls
- Implement RuneLite plugin and secure verification flow
- Add authentication (NextAuth or custom)

