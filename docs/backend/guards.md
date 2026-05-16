# Guards

The gateway uses a **global guard** registered via `APP_GUARD` that protects every route unless explicitly marked as public.

## CombinedGuard

**File:** `src/common/guards/combined.guard.ts`

The `CombinedGuard` is the primary guard and runs on every request. It performs three checks in sequence:

### 1. Public Route Check

If the route handler or controller class has the `@Public()` decorator, all authentication is skipped:

```typescript
@Public()
@Get('storage/files/:id')
getFileById(@Param('id') id: string) { ... }
```

### 2. API Key Validation

Validates the `x-api-key` header against the `API_KEY_FRONT` environment variable. This is used for frontend-to-gateway authentication.

### 3. Bearer Token Validation

Extracts the `Authorization: Bearer <token>` header and validates it by calling the Auth Service at `AUTH_SERVICE_BASE_URL/auth/validate-token`. On success:

- Attaches `request.user = { userId, roles }` for downstream use
- Checks `@Roles()` decorator if present and enforces role-based access
- Throws `ForbiddenException` if the user lacks the required role

## Role-Based Access

The `@Roles()` decorator restricts routes to specific user roles:

```typescript
@Roles(RoleConst.ADMIN)
@Delete('inspections/:id')
deleteInspection(@Param('id') id: string) { ... }
```

Available roles: `admin`, `manager`, `operario`, `inspector`.

## Supporting Guards

| Guard | File | Description |
|-------|------|-------------|
| `AuthGuard` | `src/common/guards/auth.guard.ts` | Bearer token validation only (not registered globally) |
| `ApiKeyGuard` | `src/common/guards/api-key.guard.ts` | API key validation only (not registered globally) |
| `RolesGuard` | `src/common/guards/roles.guard.ts` | Role check assuming `request.user` is populated (not registered globally) |

## Public Routes

Routes decorated with `@Public()` bypass all authentication:

- `GET /` — Root health check
- `POST /auth/login` — User login
- `POST /auth/validate-token` — Token validation
- `POST /auth/refresh` — Token refresh
- `POST /auth/logout` — User logout
- `GET /api/v1/storage/files/:id` — Public file download
