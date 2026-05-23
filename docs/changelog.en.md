# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- `POST /auth/login` returned HTTP 201 instead of 200 due to NestJS 11 default for POST routes; added explicit `@HttpCode(200)` override
- Create inspection response now includes `checklistId` after PATCH via spread `{ ...created, checklistId }`
- Replaced `console.log` with `this.logger.log` (NestJS Logger) in auto-checklist flow

### Added
- Auto checklist creation on inspection create (`POST /api/v1/inspections`):
  - Fetches vehicle and determines type (`MOTO`/`LIVIANO`/`PESADO`)
  - Looks up active template (`getActiveMotoTemplate` / `getActiveLivianosPesadosTemplate`)
  - Creates record in checklist-service via `POST /api/v1/checklist/inspections`
  - Assigns resulting `checklistId` back to reception inspection via `PATCH /api/v1/inspections/{id}/checklist-id`
  - Errors in checklist flow do not block inspection creation (`catchError` with `of(created)`)
- `PATCH /api/v1/inspections/{id}/checklist-id` endpoint in reception controller to update checklistId
- `checklistId` field in `CreateInspectionDto` and `UpdateInspectionDto`
- `inspector` enrichment on checklist inspection reads (using `AuthApplicationService`)
- Vehicle enrichment with cached `client` data via optional `transform` parameter in `proxyRequestCached`
- `ChecklistModule` imported in `ReceptionModule` (exports `TemplatesChecklistService`, `InspectionsChecklistService`, `ChecklistInfrastructureService`)
- `AuthModule` imported in `ChecklistModule` for inspector enrichment
- `LICENSE` file with All Rights Reserved for Andres Iles, Emerson Iles, Audino Pantoja, Kevin Chanchi, Oscar Chavez from UniPutumayo
- Full `README.md` with architecture diagram, tech stack, setup instructions, and authors
- Detailed supported document types in `docs/services/storage-service.md` / `.en.md` (MIME types, extensions, size limits, response examples)
- Updated copyright in `mkdocs.yml`
- Checklist module documentation (architecture, endpoints, DTOs, enrichment) in `docs/services/checklist-service.md`
- cURL/Python/JavaScript usage examples for all checklist endpoints in `docs/examples.md`
- Standard response format and HTTP status code documentation in `docs/services/api-gateway.md`
- MkDocs documentation site with Material theme
- GitHub Actions workflow for docs deploy to GitHub Pages
- curl examples page for all gateway endpoints
- Deployment guide with Docker, Tailscale, and GitHub Actions
- Troubleshooting guide with common errors and solutions
- Network architecture guide with Tailscale VPN topology
- Local development guide with setup steps for all services
- Database architecture overview with ERDs

## [1.0.0] - 2026-05

### Added
- Unified catalog CRUD endpoints (`/api/v1/catalogs/{type}`)
- `DELETE /vehiculo/:id` and `GET /vehiculo/cliente/:clienteId` endpoints
- `PATCH /api/v1/inspections/:id` with optional file uploads
- Catalogs proxied from form-service (replaced hardcoded data)
- Public file download endpoint (`@Public()` decorator)
- Explicit payload construction in inspection creation

### Reception Module
- `POST /api/v1/inspections` with multipart file uploads
- `GET /api/v1/inspections` with filters, pagination, and data enrichment
- `GET /api/v1/inspections/:id` with client/vehicle/operator enrichment
- `DELETE /api/v1/inspections/:id` with admin role restriction

### Upload Files Module
- `POST /api/v1/storage/upload` for file uploads
- `GET /api/v1/storage/files` with listing
- `GET /api/v1/storage/files/:id` for file download
- `DELETE /api/v1/storage/files/:id` for soft delete

### Vehicle Module
- Full CRUD for vehicles, brands, lines, colors, classes
- Full CRUD for vehicle types, fuel types, service types
- Health check endpoint

### Clients Module
- Full CRUD for clients with pagination and filters
- Soft delete and reactivation
- Document types and person types catalogs
- Root health check

### Auth Module
- Login, register, token validation, refresh, logout
- User management (CRUD)
- Inspector and operator listing endpoints

### Infrastructure
- Global `CombinedGuard` (API key + JWT + roles)
- Global `ResponseInterceptor` with standard envelope
- Global `HttpExceptionFilter` for error formatting
- Axios interceptor for internal API key injection
- Safe JSON parsing utility (`safeParse`)
- Tailscale-based CI/CD with GitHub Actions
- Docker containerization
