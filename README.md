# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and npm
- **Docker** or **Podman** - [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/)

## Technology Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (Docker container)
- **ORM**: TypeORM
- **Containerization**: Docker/Podman with docker-compose-like setup
- **API Documentation**: Swagger/OpenAPI

## Quick Start with Docker/Podman

### 1. Clone and Setup

```bash
git clone {repository URL}
cd nodejs2025Q2-service
```

### 2. Build and Run with Podman (or Docker)

```bash
# Create network
podman network create app-network

# Start PostgreSQL container
podman run -d \
  --name library-postgres \
  --network app-network \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=library \
  -v postgres-data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:16-alpine

# Build application image
podman build -t library-app .

# Start application container
podman run -d \
  --name library-app \
  --network app-network \
  -p 4000:4000 \
  --env-file .env \
  --restart unless-stopped \
  library-app
```

### 3. Verify Installation

```bash
# Check running containers
podman ps

# View application logs
podman logs library-app

# Access the application
# API: http://localhost:4000
# Documentation: http://localhost:4000/doc
```

### Alternative: Docker Compose (if available)

```bash
# Using docker-compose.yml
docker-compose up --build
# or with podman-compose
podman-compose up --build
```

## Database Management

### Access PostgreSQL

```bash
# Connect to PostgreSQL container
podman exec -it library-postgres psql -U postgres -d library

# Common commands inside psql:
# \dt - list tables
# \d users - describe users table
# SELECT * FROM users; - view users
# \q - exit
```

### Reset Database

```bash
# Drop all tables and recreate
podman exec library-postgres psql -U postgres -d library -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

## Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start PostgreSQL locally or use Docker
# Update .env file with DB_HOST=localhost

# Run application
npm run start:dev
```

## Environment Variables

Create `.env` file in project root:

```env
# PostgreSQL Database
DB_HOST=library-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_DATABASE=library
DB_SYNCHRONIZE=true

# Application
PORT=4000
NODE_ENV=development

# TypeORM
TYPEORM_LOGGING=true
```

## API Resources

- **Users** (`/user`) - User management with password hashing
- **Artists** (`/artist`) - Music artists with Grammy awards
- **Albums** (`/album`) - Albums with artist relationships
- **Tracks** (`/track`) - Tracks with artist and album references
- **Favorites** (`/favs`) - Favorite artists, albums, tracks (Many-to-Many)

## Features

- ✅ **Containerized** PostgreSQL database
- ✅ **TypeORM** for database operations
- ✅ **Data persistence** across restarts
- ✅ **Relationships** between entities (One-to-Many, Many-to-Many)
- ✅ **Input validation** with class-validator
- ✅ **Automatic reference cleanup** on deletion
- ✅ **OpenAPI documentation** with Swagger
- ✅ **Environment-based configuration**

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Root module with TypeORM
├── typeorm.config.ts         # Database configuration
├── users/                    # User module
│   ├── entities/user.entity.ts
│   ├── users.service.ts
│   └── users.controller.ts
├── artists/                  # Artist module
├── albums/                   # Album module  
├── tracks/                   # Track module
└── favorites/                # Favorites module
```

## Testing

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- <path to suite>

# Security audit
npm run audit
```

## Security Notes

- `.env` file is excluded from git (see `.gitignore`)
- Database passwords stored in environment variables
- Application runs in isolated Docker network
- Auto-restart on failure

## Troubleshooting

### "Cannot connect to database"
- Check if PostgreSQL container is running: `podman ps`
- Verify network: `podman network inspect app-network`
- Check logs: `podman logs library-postgres`

### "Port already in use"
- Stop local processes on ports 4000 or 5432
- Or change ports in `.env` and container mappings

### "Table does not exist"
- Ensure `DB_SYNCHRONIZE=true` in `.env`
- Restart application: `podman restart library-app`
```






