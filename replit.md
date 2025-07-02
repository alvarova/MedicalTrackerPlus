# MedSystem - Medical Records Management System

## Overview

MedSystem is a comprehensive electronic medical records (EMR) application designed for medical practices. It provides a complete solution for managing patients, consultations, medical histories, and documentation with a modern web interface and robust backend infrastructure.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful APIs with comprehensive error handling

### Key Design Decisions
1. **Monorepo Structure**: Unified codebase with `client/`, `server/`, and `shared/` directories for better code organization and type sharing
2. **Type Safety**: Full TypeScript implementation across frontend, backend, and shared schemas
3. **Component-Based UI**: Modular component architecture using shadcn/ui for consistent design system
4. **Database-First Approach**: Drizzle ORM with schema-first design for type-safe database operations

## Key Components

### Frontend Components
- **Navigation**: Responsive navigation bar with role-based menu items
- **Patient Management**: Patient registration, search, and detailed patient modals
- **Consultation System**: Medical consultation forms with comprehensive data capture
- **Dashboard**: Statistics overview with recent patients and appointments
- **Authentication**: Integrated Replit Auth flow

### Backend Services
- **Storage Layer**: Comprehensive data access layer with interfaces for all entities
- **Authentication Middleware**: Replit Auth integration with session management
- **API Routes**: RESTful endpoints for all major operations
- **Database Connection**: Neon PostgreSQL integration with connection pooling

### Shared Components
- **Schema Definitions**: Zod schemas for validation and type generation
- **Type Definitions**: Shared TypeScript interfaces between frontend and backend

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth → Session stored in PostgreSQL → Protected routes validate session
2. **Patient Management**: Frontend forms → Validation via Zod schemas → API endpoints → Storage layer → Database
3. **Real-time Updates**: TanStack Query manages cache invalidation and optimistic updates
4. **Error Handling**: Centralized error handling with user-friendly toast notifications

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for data persistence
- **Authentication**: Replit Auth service for user management
- **UI Library**: Radix UI primitives for accessible components
- **Validation**: Zod for schema validation and type safety

### Development Tools
- **Build System**: Vite with React plugin for fast development
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint configuration for code standards

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public/`
- Backend: esbuild bundles Node.js application to `dist/index.js`
- Database: Drizzle migrations manage schema changes

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Session security via `SESSION_SECRET` for production
- Replit-specific configurations for authentication domains

### Scaling Considerations
- Stateless backend design for horizontal scaling
- Connection pooling for database efficiency
- CDN-ready static asset serving

## Changelog

Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Enhanced patient search functionality:
  - Created PatientSearch component for searching by name or ID number
  - Updated consultation creation to use patient search instead of manual ID entry
  - Updated appointment scheduling with patient search and "New Patient" workflow
  - Improved user flow: search → select patient → create consultation/appointment
  - Added "New Patient" button for first-time patients
  - Fixed console warnings (nested anchor tags and missing dialog descriptions)

## User Preferences

Preferred communication style: Simple, everyday language.