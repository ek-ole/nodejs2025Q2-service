# Home Library Service

[![Docker Image Version](https://img.shields.io/docker/v/vernissage/library-app?sort=semver)](https://hub.docker.com/r/vernissage/library-app)
[![Docker Image Size](https://img.shields.io/docker/image-size/vernissage/library-app)](https://hub.docker.com/r/vernissage/library-app)
[![Docker Pulls](https://img.shields.io/docker/pulls/vernissage/library-app)](https://hub.docker.com/r/vernissage/library-app)

A simple REST API for managing your personal music library.

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads)
- **Node.js 22.x** - [Download & Install Node.js](https://nodejs.org/en/download/)
- **Docker** or **Podman** - [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/)

## Technology Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (Docker container)
- **ORM**: TypeORM
- **Authentication**: JWT (Access & Refresh tokens)
- **Password Security**: bcrypt hashing
- **Logging**: Custom LoggingService with file rotation
- **Error Handling**: Custom Exception Filter
- **Containerization**: Docker/Podman
- **API Documentation**: Swagger/OpenAPI
- **Container Registry**: Docker Hub
- **Event Handling**: uncaughtException & unhandledRejection

## 🚀 Start

### Option 1: The Easiest Way (Docker Compose)
```bash
# 1. Clone the repository
git clone https://github.com/your-username/nodejs2025Q2-service.git
cd nodejs2025Q2-service

# 2. Copy environment variables
cp .env.example .env

# 3. Start everything with one command
podman-compose up -d

# 4. Open in browser
# API Documentation: http://localhost:4000/doc
# API: http://localhost:4000
```

### Option 2: Using Pre-built Images from Docker Hub
```bash
# 1. Create network
podman network create app-network

# 2. Run PostgreSQL
podman run -d \
  --name library-postgres \
  --network app-network \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=library \
  -v postgres-data:/var/lib/postgresql/data \
  docker.io/library/postgres:16-alpine

# 3. Run application
podman run -d \
  --name library-app \
  --network app-network \
  -p 4000:4000 \
  -e DB_HOST=library-postgres \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=library \
  docker.io/vernissage/library-app:latest
```

### Option 3: For Development (Local Setup)
```bash
# 1. Install dependencies
npm install

# 2. Copy environment configuration
cp .env.example .env

# 3. Start the database only
podman-compose up -d postgres

# 4. Run the application
npm run start:dev

# 5. Application available at http://localhost:4000
```

## ✅ Verify Installation

After starting, open in your browser:
- [API Documentation](http://localhost:4000/doc) - See all available requests
- [Health Check](http://localhost:4000) - Should show "Hello World!"

Or check via command line:
```bash
# Check if containers are running
podman ps

# View application logs
podman logs library-app

# Test API endpoint
curl http://localhost:4000
```

## 📦 What's Running

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL Database | 5432 | Stores all library data |
| Node.js Application | 4000 | REST API server |
| Swagger UI | 4000/doc | Interactive API documentation |

## 🐳 Docker Images on Docker Hub

Pre-built images are available for quick deployment:

- **Application**: `docker.io/vernissage/library-app:latest`
- **PostgreSQL**: `docker.io/library/postgres:16-alpine`

Pull commands:
```bash
# Pull the application image
podman pull docker.io/vernissage/library-app:latest

# Pull PostgreSQL
podman pull docker.io/library/postgres:16-alpine
```

## 📁 Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts             # Main module configuration
├── typeorm.config.ts         # Database setup
├── users/                    # User management
├── artists/                  # Music artists
├── albums/                   # Music albums
├── tracks/                   # Music tracks
└── favorites/                # Favorite items
```

## 🔧 Environment Configuration

The project includes `.env.example` with all required variables. Copy it to create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` if needed (usually defaults work fine):
```env
# Database Configuration
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
TYPEORM_LOGGING=true
```

## 📊 Available Resources

- **Users** (`/user`) - Create and manage users
- **Artists** (`/artist`) - Music artists information
- **Albums** (`/album`) - Music albums with year and artist
- **Tracks** (`/track`) - Music tracks with duration
- **Favorites** (`/favs`) - Mark artists, albums, tracks as favorites

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start in development mode (with auto-reload)
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Fix code style issues
npm run lint

# Run security audit
npm run audit
```

## 🔍 Database Access

```bash
# Connect to PostgreSQL
podman exec -it library-postgres psql -U postgres -d library

# Inside psql, useful commands:
# \dt          - List all tables
# \d users     - Show users table structure
# SELECT * FROM users; - View all users
# \q           - Exit
```

## 🐳 Docker Commands Reference

```bash
# Start all services
podman-compose up -d

# Stop all services
podman-compose down

# View logs
podman-compose logs

# Rebuild and restart
podman-compose up -d --build

# Stop only one service
podman-compose stop postgres

# Remove all containers and volumes
podman-compose down -v
```

## 📝 API Documentation

Interactive Swagger documentation is available at `http://localhost:4000/doc` when the application is running. You can:
- See all available endpoints
- Try API calls directly from browser
- View request/response formats
- Download OpenAPI specification

---

**Note**: This project is part of the RS School Node.js Course.