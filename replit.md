# PetCare Suite - Pet Shop Management Platform

## Overview
PetCare Suite is a comprehensive pet shop management application that helps centralize appointments, clients, and reports in a modern experience. The application consists of a Node.js/Express backend with Prisma ORM and a React/Vite frontend.

## Project Structure
- **Backend** (`/backend`): Node.js/Express/TypeScript API with Prisma ORM
  - Port: 3000
  - Database: PostgreSQL (via Replit's built-in database)
  - API Documentation: Swagger UI available at `/api-docs`
  
- **Frontend** (`/frontend`): React/Vite/TypeScript application
  - Port: 5000
  - UI Framework: Tailwind CSS
  - State Management: React Query

## Technology Stack

### Backend
- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI documentation
- Jest for testing

### Frontend
- React 18
- Vite
- TypeScript
- React Router
- React Query (TanStack Query)
- Tailwind CSS
- Axios
- Vitest for testing

## Environment Configuration

### Backend Environment Variables
Development: Located in `backend/.env` (git-ignored)
- `NODE_ENV`: development/production
- `PORT`: Backend server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string (provided by Replit)
- `JWT_SECRET`: Secret key for JWT token generation (auto-generated)
- `CORS_ALLOWED_ORIGINS`: Allowed CORS origins (configured for Replit proxy)

**Production Note**: For production deployment, move all sensitive environment variables (DATABASE_URL, JWT_SECRET) to Replit Secrets to prevent credential exposure.

### Frontend Environment Variables
Located in `frontend/.env` (git-ignored):
- `VITE_API_URL`: API base URL (set to `/api` for proxy)

## Development

### Running Locally
Both frontend and backend are configured as workflows and run automatically:
- **Backend**: Runs on port 3000 (accessible at localhost:3000)
- **Frontend**: Runs on port 5000 (accessible via Replit preview)

The frontend proxies `/api` requests to the backend at `http://localhost:3000`.

### Database
The application uses Replit's built-in PostgreSQL database. Prisma handles migrations:
- Schema: `backend/prisma/schema.prisma`
- Migrations: Run automatically on deployment
- Seeding: `npm run seed` in backend directory

### API Documentation
Swagger UI is available at the backend's `/api-docs` endpoint when running.

## Deployment
The application is configured for Replit autoscale deployment:
- Build step: Installs dependencies, generates Prisma client, builds both frontend and backend
- Run step: Runs database migrations, starts backend, and serves frontend

## Database Schema

### Models
- **User**: Admin, Staff, and Customer users with authentication
- **Pet**: Pet information linked to customers
- **Schedule**: Appointment scheduling with services (Bath, Grooming, Bath & Grooming)
- **BusinessSetting**: Business hours and scheduling configuration

### Service Types
- BATH: Pet bathing service
- GROOMING: Pet grooming service
- BATH_GROOMING: Combined service

### Schedule Status
- SCHEDULED: Appointment scheduled
- IN_PROGRESS: Service in progress
- COMPLETED: Service completed
- CANCELLED: Appointment cancelled

## Recent Changes (2025-10-25)
- Configured for Replit environment
- Set up PostgreSQL database integration
- Added dotenv for environment variable management
- Configured Vite to bind to 0.0.0.0:5000 for Replit proxy
- Set up backend to bind to 0.0.0.0:3000
- Configured CORS for Replit domains
- Set up workflows for both services
- Configured deployment settings
- Generated JWT secret for authentication

## User Preferences
- Keep configuration compatible with Replit's proxy environment
- Maintain separate backend and frontend structure
- Use PostgreSQL for data persistence
