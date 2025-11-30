# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and npm

## Installation

```bash
git clone {repository URL}
cd nodejs2025Q2-service
npm install
```

## Running application

```bash
npm start
```

After starting on port 4000, OpenAPI documentation is available at:
http://localhost:4000/doc/

## Testing

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- <path to suite>
```

## API Resources

- **Users** (`/user`) - Create, read, update, delete users
- **Artists** (`/artist`) - Manage music artists
- **Albums** (`/album`) - Manage albums with artist references  
- **Tracks** (`/track`) - Manage tracks with artist and album references
- **Favorites** (`/favs`) - Manage favorite artists, albums, tracks

## Features

- In-memory data storage
- Input validation and error handling
- UUID validation for all IDs
- Automatic reference cleanup on deletion
- Password exclusion from API responses

## Development

```bash
# Linting and formatting
npm run lint
npm run format

# Development mode
npm run start:dev
```
