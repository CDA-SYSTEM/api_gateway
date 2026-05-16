# Guards

El gateway utiliza un **guard global** registrado a través de `APP_GUARD` que protege cada ruta a menos que esté marcada explícitamente como pública.

## CombinedGuard

**Archivo:** `src/common/guards/combined.guard.ts`

El `CombinedGuard` es el guard principal y se ejecuta en cada solicitud. Realiza tres verificaciones en secuencia:

### 1. Verificación de Ruta Pública

Si el manejador de ruta o la clase del controlador tiene el decorador `@Public()`, se omite toda la autenticación:

```typescript
@Public()
@Get('storage/files/:id')
getFileById(@Param('id') id: string) { ... }
```

### 2. Validación de API Key

Valida el encabezado `x-api-key` contra la variable de entorno `API_KEY_FRONT`. Esto se usa para la autenticación frontend-to-gateway.

### 3. Validación de Bearer Token

Extrae el encabezado `Authorization: Bearer <token>` y lo valida llamando al Auth Service en `AUTH_SERVICE_BASE_URL/auth/validate-token`. Al tener éxito:

- Adjunta `request.user = { userId, roles }` para uso posterior
- Verifica el decorador `@Roles()` si está presente y aplica el control de acceso basado en roles
- Lanza `ForbiddenException` si el usuario no tiene el rol requerido

## Acceso Basado en Roles

El decorador `@Roles()` restringe rutas a roles de usuario específicos:

```typescript
@Roles(RoleConst.ADMIN)
@Delete('inspections/:id')
deleteInspection(@Param('id') id: string) { ... }
```

Roles disponibles: `admin`, `manager`, `operario`, `inspector`.

## Guards de Apoyo

| Guard | Archivo | Descripción |
|-------|---------|-------------|
| `AuthGuard` | `src/common/guards/auth.guard.ts` | Solo validación de Bearer token (no registrado globalmente) |
| `ApiKeyGuard` | `src/common/guards/api-key.guard.ts` | Solo validación de API key (no registrado globalmente) |
| `RolesGuard` | `src/common/guards/roles.guard.ts` | Verificación de roles asumiendo que `request.user` está poblado (no registrado globalmente) |

## Rutas Públicas

Las rutas decoradas con `@Public()` omiten toda la autenticación:

- `GET /` — Health check raíz
- `POST /auth/login` — Inicio de sesión de usuario
- `POST /auth/validate-token` — Validación de token
- `POST /auth/refresh` — Refresco de token
- `POST /auth/logout` — Cierre de sesión de usuario
- `GET /api/v1/storage/files/:id` — Descarga pública de archivos
