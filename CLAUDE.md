# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a full-stack React application template with an Express.js backend and SQLite database, designed for building automation tools. The application features:

- **Frontend**: React 19 with Vite, TypeScript, Tailwind CSS, and Radix UI components
- **Backend**: Express.js server with SQLite database and REST API
- **Database**: SQLite with dynamic table creation based on environment variables
- **Configuration**: Dynamic form generation using `dbSetup.json` with validator.js validation
- **Deployment**: Docker containers with nginx (frontend) and Node.js (backend)

## Key Architecture Patterns

### Dynamic Form System
The application uses `frontend/public/dbSetup.json` to dynamically generate forms with validation. This file defines:
- Field names, types, and validation rules using validator.js
- Database table structure (synced with `VITE_TABLE_COLUMNS` env var)
- Sample configurations for Cisco CUCM and CUC are provided

### Database Schema
SQLite table structure is dynamically created based on `TABLE_COLUMNS` environment variable in `backend/server.js:31-42`. The backend automatically creates the `connections` table with columns matching the configuration.

### Theme System
Uses Radix UI with dark/light mode toggle implemented via context in `frontend/src/components/theme-provider.tsx` and `theme-context.tsx`.

## Development Commands

### Install Dependencies
```bash
npm run install-all  # Installs deps for root, backend, and frontend
```

### Development Mode
```bash
npm run dev  # Runs both frontend (Vite) and backend (nodemon) concurrently
```

### Individual Services
```bash
# Frontend only
cd frontend && npm run dev

# Backend only  
cd backend && npm run nodemon
```

### Linting
```bash
cd frontend && npm run lint  # ESLint for frontend
```

### Building
```bash
npm run build  # Docker compose build
cd frontend && npm run build  # Frontend build only
```

### Docker Development
```bash
docker-compose up --build  # Full containerized build
```

## Project Structure

- `frontend/src/pages/` - Main application pages (Home, Connections, Error)
- `frontend/src/components/` - Reusable React components and UI primitives
- `frontend/public/dbSetup.json` - Dynamic form configuration
- `backend/server.js` - Express API server with SQLite integration
- `backend/db/` - SQLite database files (auto-created)

## Environment Configuration

Backend requires environment variables matching `dbSetup.json` field names. Set these in:
- `.env` file for local development
- `docker-compose.yaml` for containerized deployment

## Template Synchronization

This is a template repository. Sync upstream changes:
```bash
npm run sync-remote  # Pulls from upstream main branch
```