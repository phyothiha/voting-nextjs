# Voting Next.js Application

A Next.js voting application with PostgreSQL database using Prisma ORM.

## Prerequisites

- Node.js 20+ 
- Docker and Docker Compose (for local PostgreSQL)
- npm or yarn

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL database on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `voting_db`

### 3. Set Up Environment Variables

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

The default `.env` file is already configured for the Docker PostgreSQL instance:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/voting_db"
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

This will create all the necessary database tables.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Seed the Database (Optional)

```bash
npm run seed
```

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed the database with initial data
- `npx prisma studio` - Open Prisma Studio (visual database editor)
- `npx prisma migrate dev` - Create and apply new migration
- `docker-compose up -d` - Start PostgreSQL in background
- `docker-compose down` - Stop PostgreSQL
- `docker-compose logs -f postgres` - View PostgreSQL logs

## Database Management

### View Database with Prisma Studio

```bash
npx prisma studio
```

This opens a visual interface at `http://localhost:5555` where you can view and edit your database.

### Create a New Migration

After modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database

**Warning: This deletes all data!**

```bash
npx prisma migrate reset
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel, Netlify, and AWS.

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5

## Project Structure

```
voting-nextjs/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── su/                # Admin pages
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client configuration
│   └── session.ts        # Session management
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.ts           # Database seeding script
├── prisma.config.ts      # Prisma configuration
├── docker-compose.yml    # PostgreSQL Docker setup
└── .env                  # Environment variables
```

## Troubleshooting

### PostgreSQL Connection Issues

If you can't connect to PostgreSQL:

1. Check if Docker container is running:
   ```bash
   docker-compose ps
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart PostgreSQL:
   ```bash
   docker-compose restart postgres
   ```

### Port Already in Use

If port 5432 is already in use, edit `docker-compose.yml` and change the port:

```yaml
ports:
  - "5433:5432"  # Use 5433 on host machine
```

Then update your `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/voting_db"
```

### Migration Issues

If migrations fail, you can reset the database:

```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Start fresh
npx prisma migrate dev  # Apply migrations
```

## License

MIT
