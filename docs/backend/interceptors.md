# Interceptors

## ResponseInterceptor

**Archivo:** `src/common/interceptors/response.interceptor.ts`

Registrado **globalmente** en `main.ts`, este interceptor envuelve cada respuesta exitosa en un envoltorio estandarizado:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-10T21:12:09.144Z",
  "path": "/api/v1/inspections"
}
```

### Omitir el Envoltorio

Las respuestas binarias o de streaming (por ejemplo, descargas de archivos) usan el decorador `@SkipResponseFormat()` para omitir el envoltorio:

```typescript
@SkipResponseFormat()
@Get('storage/files/:id')
async getFileById(@Param('id') id: string, @Res() res: Response) {
  // Returns raw binary stream directly
}
```

### Respuestas de Error

Los errores son manejados por el `HttpExceptionFilter` global (`src/common/filters/http-exception.filter.ts`), produciendo:

```json
{
  "statusCode": 404,
  "message": "Inspection not found",
  "error": "Not Found",
  "timestamp": "2026-05-10T21:12:10.504Z",
  "path": "/api/v1/inspections/999"
}
```

## Interceptor Interno del Gateway

En `app.module.ts`, se configura un interceptor de solicitudes Axios en `onModuleInit()` para inyectar automáticamente el encabezado `x-api-key` (usando la variable de entorno `API_KEY`) en todas las solicitudes HTTP salientes hacia los microservicios. Esto asegura que la comunicación interna entre servicios esté autenticada sin inyección manual de encabezados.

## Constructor de Respuestas de Error

**Archivo:** `src/common/utils/error-response.util.ts`

La utilidad `buildErrorResponse` crea objetos de error consistentes para bloques try/catch, utilizada principalmente en manejadores de descarga de archivos que gestionan sus propios streams de respuesta a través de `@Res()`.
