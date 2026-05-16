# Middleware

El gateway utiliza middleware mínimo, apoyándose principalmente en guards y pipes de NestJS para aspectos transversales.

## Autenticación Básica de Swagger

**Archivo:** `main.ts`

El único middleware personalizado es la **Autenticación Básica HTTP** para la página de documentación de Swagger, proporcionada por el paquete `express-basic-auth`:

```typescript
app.use(
  ['/docs', '/docs-json'],
  basicAuth({
    challenge: true,
    users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS },
  }),
);
```

Esto protege la documentación del API contra acceso no autorizado. Las credenciales se configuran mediante:

| Variable | Descripción |
|----------|-------------|
| `SWAGGER_USER` | Nombre de usuario para acceso a Swagger UI |
| `SWAGGER_PASS` | Contraseña para acceso a Swagger UI |

## CORS

Deshabilitado por defecto (el gateway depende de Tailscale para control de acceso a nivel de red en producción). CORS puede habilitarse descomentando la configuración en `main.ts` si los clientes frontend requieren acceso de origen cruzado.

## Pipes Globales

Un `ValidationPipe` global está registrado con:

- `whitelist: true` — Elimina propiedades desconocidas de los cuerpos de solicitud
- `forbidNonWhitelisted: true` — Rechaza solicitudes con propiedades desconocidas
- `transform: true` — Transforma automáticamente los payloads a instancias de DTO

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

## Sin Middleware Personalizado de NestJS

No hay clases de middleware personalizadas de NestJS. Todo el comportamiento transversal (autenticación, formato de respuesta, manejo de errores) se implementa a través de **guards** e **interceptors**.
