# OSRS Tracker (scaffold)

This repository contains a minimal scaffold for an Old School RuneScape account tracker built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (optional - app works without DB for basic features).
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client and run migrations (if using a database):

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate dev --name add_snapshots  # For progress tracking charts
```

4. Run dev server:

```bash
npm run dev
```

**Note**: The app works without a database for basic player lookups. To enable progress tracking charts:
- Set up a PostgreSQL database
- Configure `DATABASE_URL` in `.env`
- Run the migrations above

What's included

- Next.js app router skeleton
- Prisma schema for core models
- Mock OSRS & verification libraries (placeholders)
- Basic pages and API route stubs

Next steps

- Wire up real OSRS API calls
- Implement RuneLite plugin and secure verification flow
- Add authentication (NextAuth or custom)

