# Professional NestJS Backend

Enterprise-grade NestJS backend with Clean Architecture, JWT authentication, RBAC, PostgreSQL, Redis, BullMQ, and full production tooling.

## Tech Stack

- **Core:** NestJS, TypeScript, Node.js 22 LTS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT (access + refresh), Passport, bcrypt, RBAC
- **Cache/Queue:** Redis, BullMQ
- **Security:** Helmet, CORS, Rate Limiter, Compression
- **Logging:** Pino
- **Docs:** Swagger (OpenAPI)
- **Testing:** Jest, Supertest
- **DevOps:** Docker, Docker Compose, GitHub Actions

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
cd b
cp .env.development .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm prisma:seed
pnpm start:dev
```

### Docker

```bash
docker compose up -d
```

## API

- **Base URL:** `http://localhost:3000/api/v1`
- **Swagger:** `http://localhost:3000/api/docs`
- **Health:** `http://localhost:3000/api/v1/health`

### Default Admin

- Login: `admin`
- Password: `123123`

## Project Structure

```
src/
├── common/          # Shared constants, DTOs, interfaces
├── config/          # Environment configuration
├── auth/            # Authentication module
├── users/           # Users module
├── roles/           # Roles module
├── permissions/     # Permissions module
├── health/          # Health checks
├── cache/           # Redis cache
├── queue/           # BullMQ queues
├── mail/            # Nodemailer
├── storage/         # File upload (Multer)
├── prisma/          # Prisma service
└── shared/          # Pagination, repositories
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm start:dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run e2e tests |
| `pnpm lint` | Run ESLint |
| `pnpm prisma:studio` | Open Prisma Studio |

## License

MIT
