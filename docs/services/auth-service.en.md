# Auth Service

**Port:** `3001`  
**Tech:** NestJS 11 / TypeScript  
**Database:** PostgreSQL + Redis  
**Global Prefix:** `/api`

## Purpose

Authentication and authorization microservice. Manages user registration, JWT access/refresh tokens, role-based access control, and user lookup endpoints used by other services for data enrichment.

## Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full control ÔÇö user registration, update, deletion |
| `MANAGER` | Query, search, and inactivate users |
| `OPERARIO` | Functional access to reception module |
| `INSPECTOR` | Functional access to checklist module |

## Key Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | Public | Authenticate, returns token pair |
| `POST` | `/api/auth/refresh` | Public | Refresh access token |
| `POST` | `/api/auth/logout` | Public | Invalidate refresh token |
| `POST` | `/api/auth/validate-token` | Public | Validate an access token |
| `POST` | `/api/auth/register` | Admin | Register a user |
| `GET` | `/api/auth/users` | Admin/Manager | List users with optional `?role=` filter |
| `GET` | `/api/auth/users/:id` | Admin/Manager | Get user by ID |
| `GET` | `/api/auth/users/inspectors` | Internal | List inspectors |
| `GET` | `/api/auth/users/operarios` | Internal | List operarios |

## Architecture

Hexagonal (ports & adapters) with three layers: Domain (interfaces, DTOs), Application (use cases), Infrastructure (controllers, JWT strategy, persistence).

## Swagger

Swagger UI available at the service endpoint (if exposed).
