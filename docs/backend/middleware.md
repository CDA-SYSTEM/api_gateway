# Middleware

The gateway uses minimal middleware, relying primarily on NestJS guards and pipes for cross-cutting concerns.

## Swagger Basic Auth

**File:** `main.ts`

The only custom middleware is **HTTP Basic Authentication** for the Swagger documentation page, provided by the `express-basic-auth` package:

```typescript
app.use(
  ['/docs', '/docs-json'],
  basicAuth({
    challenge: true,
    users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS },
  }),
);
```

This protects the API documentation from unauthorized access. Credentials are configured via:

| Variable | Description |
|----------|-------------|
| `SWAGGER_USER` | Username for Swagger UI access |
| `SWAGGER_PASS` | Password for Swagger UI access |

## CORS

Disabled by default (the gateway relies on Tailscale for network-level access control in production). CORS can be enabled by uncommenting the configuration in `main.ts` if frontend clients require cross-origin access.

## Global Pipes

A global `ValidationPipe` is registered with:

- `whitelist: true` — Strips unknown properties from request bodies
- `forbidNonWhitelisted: true` — Rejects requests with unknown properties
- `transform: true` — Auto-transforms payloads to DTO instances

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

## No Custom NestJS Middleware

There are no custom NestJS middleware classes. All cross-cutting behavior (authentication, response formatting, error handling) is implemented through **guards** and **interceptors**.
