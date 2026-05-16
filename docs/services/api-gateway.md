# API Gateway

**Port:** `3600`  
**Tech:** NestJS 11 / TypeScript  
**Role:** Single entry point for all client requests.

## Responsibilities

- **Authentication & Authorization** — Validates JWT tokens, enforces API keys, checks role-based access
- **Request Routing** — Proxies HTTP requests to the appropriate microservice
- **File Upload Orchestration** — Handles multi-part file uploads, uploads to storage service, and includes resulting URLs in inspection payloads
- **Response Enrichment** — Joins data from multiple services (client, vehicle, operator) into unified inspection responses
- **API Documentation** — Exposes Swagger UI at `/docs` with basic auth protection
- **Security** — Internal API key injection for service-to-service communication

## Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Bootstrap, global pipes, interceptors, Swagger setup |
| `src/app.module.ts` | Root module, global guard registration, Axios interceptor |
| `src/common/guards/combined.guard.ts` | Global auth guard (public check + API key + JWT + roles) |
| `src/common/interceptors/response.interceptor.ts` | Global response envelope |
| `src/reception/application/reception.service.ts` | Inspection creation/update orchestration |
| `src/upload-files/application/upload-files.service.ts` | File upload/download handling |

## Proxy Layer

The gateway does not implement business logic for domain entities. Instead, it delegates to dedicated microservices through a **three-layer proxy architecture** (Controller → Application Service → Infrastructure Service). This keeps the gateway thin and focused on cross-cutting concerns.

## Swagger

`{API_GATEWAY_BASE_URL}/docs` — Protected with HTTP Basic Auth.
