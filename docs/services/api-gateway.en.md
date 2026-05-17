# API Gateway

**Port:** `3600`  
**Tech:** NestJS 11 / TypeScript  
**Role:** Single entry point for all client requests.

## Responsibilities

- **Authentication & Authorization** ÔÇö Validates JWT tokens, enforces API keys, checks role-based access
- **Request Routing** ÔÇö Proxies HTTP requests to the appropriate microservice
- **File Upload Orchestration** ÔÇö Handles multi-part file uploads, uploads to storage service, and includes resulting URLs in inspection payloads
- **Response Enrichment** ÔÇö Joins data from multiple services (client, vehicle, operator) into unified inspection responses
- **API Documentation** ÔÇö Exposes Swagger UI at `/docs` with basic auth protection
- **Security** ÔÇö Internal API key injection for service-to-service communication

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

The gateway does not implement business logic for domain entities. Instead, it delegates to dedicated microservices through a **three-layer proxy architecture** (Controller ÔåÆ Application Service ÔåÆ Infrastructure Service). This keeps the gateway thin and focused on cross-cutting concerns.

## Response Format

Every successful response passes through the global `ResponseInterceptor` and is wrapped in a standard envelope:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-17T22:00:00.000Z",
  "path": "/auth/login"
}
```

Errors use the same format but with `error` instead of `data`:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "The email is not valid",
  "timestamp": "2026-05-17T22:00:00.000Z",
  "path": "/auth/login"
}
```

Endpoints can skip this wrapper with the `@SkipResponseFormat()` decorator.

## HTTP Status Codes

NestJS 11 defaults **201 Created** for all `POST` routes. The `ResponseInterceptor` reads `response.statusCode` and reflects it in the body's `statusCode` field.

To override this on a specific endpoint, use `@HttpCode(200)`:

```typescript
@Post('login')
@HttpCode(200)
async login(@Body() body: LoginDto) { ... }
```

**Endpoints requiring explicit `@HttpCode(200)`:**
- `POST /auth/login` (login is not resource creation)

## Swagger

`{API_GATEWAY_BASE_URL}/docs` ÔÇö Protected with HTTP Basic Auth.
