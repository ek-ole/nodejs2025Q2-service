# Home Library Service

[![Docker Image Version](https://img.shields.io/docker/v/vernissage/library-app?sort=semver)](https://hub.docker.com/r/vernissage/library-app)
[![Docker Image Size](https://img.shields.io/docker/image-size/vernissage/library-app)](https://hub.docker.com/r/vernissage/library-app)
[![Docker Pulls](https://img.shields.io/docker/pulls/vernissage/library-app)](https://hub.docker.com/r/vernissage/library-app)

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js 22.x** - [Download & Install Node.js](https://nodejs.org/en/download/)
- **Docker** or **Podman** - [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/)

## Technology Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (Docker container)
- **ORM**: TypeORM
- **Containerization**: Docker/Podman
- **API Documentation**: Swagger/OpenAPI
- **Container Registry**: Docker Hub

## Docker Images

Pre-built Docker images are available on Docker Hub:

### Application Image
```bash
# Pull the application image
podman pull vernissage/library-app:latest

# Or with Docker
docker pull vernissage/library-app:latest
```

### PostgreSQL Image (custom tagged)
```bash
podman pull vernissage/library-postgres:16-alpine
```

**Docker Hub Repositories:**
- Application: https://hub.docker.com/r/vernissage/library-app
- PostgreSQL: https://hub.docker.com/r/vernissage/library-postgres

## Quick Start with Docker/Podman

### Option 1: Using Pre-built Images (Recommended)

```bash
# Create network
podman network create app-network

# Run PostgreSQL
podman run -d \
  --name library-postgres \
  --network app-network \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=library \
  -v postgres-data:/var/lib/postgresql/data \
  --restart unless-stopped \
  vernissage/library-postgres:16-alpine

# Run Application
podman run -d \
  --name library-app \
  --network app-network \
  -p 4000:4000 \
  --env-file .env \
  --restart unless-stopped \
  vernissage/library-app:latest
```

### Option 2: Building from Source

```bash
# Clone repository
git clone {repository URL}
cd nodejs2025Q2-service

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

### Option 3: Docker Compose (if available)

```yaml
# docker-compose.yml
version: '3.8'

networks:
  app-network:
    driver: bridge

services:
  postgres:
    image: vernissage/library-postgres:16-alpine
    container_name: library-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: library
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  app:
    image: vernissage/library-app:latest
    container_name: library-app
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      DB_HOST: library-postgres
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_DATABASE: library
      DB_SYNCHRONIZE: "true"
      TYPEORM_LOGGING: "true"
    depends_on:
      - postgres
    networks:
      - app-network

volumes:
  postgres-data:
```

```bash
# Using docker-compose
docker-compose up -d

# Or with podman-compose
podman-compose up -d
```

## Verify Installation

```bash
# Check running containers
podman ps

# View application logs
podman logs library-app

# Access the application
# API: http://localhost:4000
# Documentation: http://localhost:4000/doc
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
DB_PASSWORD=postgres
DB_DATABASE=library
DB_SYNCHRONIZE=true

# Application
PORT=4000
NODE_ENV=development

# TypeORM
TYPEORM_CONNECTION=postgres
TYPEORM_LOGGING=true
```

Copy `.env.example` to `.env` and modify as needed.

## API Resources

- **Users** (`/user`) - User management with password hashing
- **Artists** (`/artist`) - Music artists with Grammy awards
- **Albums** (`/album`) - Albums with artist relationships
- **Tracks** (`/track`) - Tracks with artist and album references
- **Favorites** (`/favs`) - Favorite artists, albums, tracks (Many-to-Many)

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
npm run audit:fix
```

## Building and Pushing Docker Images

### Build Application Image

```bash
podman build -t library-app .
# or with custom name
podman build -t yourusername/library-app:latest .
```

### Tag and Push to Registry

```bash
# Tag the image
podman tag library-app:latest yourusername/library-app:latest

# Push to Docker Hub
podman push yourusername/library-app:latest

# Push to GitHub Container Registry
podman tag library-app:latest ghcr.io/yourusername/library-app:latest
podman push ghcr.io/yourusername/library-app:latest
```

## Security Notes

- `.env` file is excluded from git (see `.gitignore`)
- Database passwords stored in environment variables
- Application runs in isolated Docker network
- Auto-restart on failure
- Regular security audits with npm audit

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

### "Cannot push to Docker Hub"
- Verify login: `podman login docker.io`
- Check repository exists on Docker Hub
- Ensure proper tagging format: `username/repository:tag`

## License

This project is part of the RS School Node.js course.
```