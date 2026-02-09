# Deployment Guide

This application uses PostgreSQL as the database and can be deployed to Vercel or Netlify.

## Local Development Setup

### Prerequisites
- Node.js 20+
- Docker and Docker Compose

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker-compose up -d
   ```

3. **Configure environment variables:**
   Create a `.env` file (or copy from `.env.example`):
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voting_db"
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

7. **Start development server:**
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Step 1: Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Create Database → Postgres
3. Follow the prompts to create your database
4. Copy the connection strings

### Step 2: Configure Environment Variables

In your Vercel project settings, add this environment variable:

- `DATABASE_URL` - Use the `POSTGRES_PRISMA_URL` from Vercel Postgres

### Step 3: Deploy

1. **Connect your repository:**
   ```bash
   git push origin main
   ```

2. **Vercel will automatically:**
   - Detect Next.js
   - Install dependencies
   - Generate Prisma client
   - Build the application

3. **Run migrations:**
   After first deployment, run migrations in Vercel:
   - Go to your project → Settings → Functions
   - Or use Vercel CLI:
     ```bash
     vercel env pull .env.production
     npx prisma migrate deploy
     ```

### Step 4: Seed Production Database (Optional)

If you need initial data:
```bash
npx prisma db seed
```

## Deployment to Netlify

### Step 1: Create PostgreSQL Database

Use any PostgreSQL provider:
- [Supabase](https://supabase.com) - Free tier available
- [Neon](https://neon.tech) - Free tier available
- [Railway](https://railway.app) - Free trial
- [Render](https://render.com) - Free tier available

### Step 2: Configure Environment Variables

In Netlify project settings → Environment variables:
- `DATABASE_URL` - Your PostgreSQL connection string

### Step 3: Configure Build Settings

**Build command:**
```bash
npx prisma generate && npm run build
```

**Publish directory:**
```
.next
```

### Step 4: Deploy

Push to your repository, and Netlify will auto-deploy.

### Step 5: Run Migrations

After deployment:
```bash
npx prisma migrate deploy
```

## Database Migration Workflow

### Development
```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Production
```bash
# Deploy pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

## Troubleshooting

### Connection Issues

**Error: "Can't reach database server"**
- Check your DATABASE_URL format
- Verify PostgreSQL is running locally
- Check firewall settings

**Error: "SSL connection required"**
- Most cloud providers require SSL
- Ensure your connection string includes `?sslmode=require`

### Migration Issues

**Error: "Migration failed to apply"**
- Check database user has correct permissions
- Verify schema is compatible with PostgreSQL
- Review migration SQL in `prisma/migrations/`

### Vercel-Specific Issues

**Error: "Prisma Client did not initialize yet"**
- Make sure `npx prisma generate` runs during build
- Check that environment variables are set correctly
- Verify the build command includes Prisma generation

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | `postgresql://user:pass@host:5432/db` |

## Next Steps

After deployment:
1. Test the application thoroughly
2. Set up monitoring (Vercel Analytics, etc.)
3. Configure custom domain (optional)
4. Set up CI/CD pipelines (optional)
5. Enable automatic database backups
