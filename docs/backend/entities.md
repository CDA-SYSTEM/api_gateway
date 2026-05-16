# Entidades y Tipos de Datos

El gateway define interfaces TypeScript y DTOs (Objetos de Transferencia de Datos) para el intercambio estructurado de datos con los microservicios.

## DTOs

### Relacionados con Inspección

Todos los DTOs están definidos bajo `src/reception/application/dtos/`:

| DTO | Descripción |
|-----|-------------|
| `CreateInspectionDto` | Campos requeridos para crear una inspección |
| `UpdateInspectionDto` | Campos opcionales para actualizaciones parciales de inspección |
| `ChecklistDto` | Lista de verificación de limpieza y seguridad del vehículo |
| `AxleDto` | Definición de eje del vehículo (índice + tipo) |
| `TireDto` | Medición de neumático (posición + código + presión) |

### Relacionados con Vehículo

Definidos bajo `src/vehicle/application/dtos/`:

| DTO | Descripción |
|-----|-------------|
| `CreateCatalogoDto` | `{ nombre: string }` — Crear elemento de catálogo |
| `UpdateCatalogoDto` | `{ nombre: string }` — Actualizar elemento de catálogo |
| `CreateVehicleDto` | Payload completo de creación de vehículo |
| `UpdateVehicleDto` | Payload completo de actualización de vehículo |

### Relacionados con Cliente

Definidos bajo `src/clients/application/dtos/`:

| DTO | Descripción |
|-----|-------------|
| `CreateClientDto` | Creación de cliente con validación |
| `UpdateClientDto` | Actualización de cliente con validación |
| `ListClientsQueryDto` | Parámetros de consulta de listado paginado |

## Interfaces

### Interfaces de Datos

| Interfaz | Ubicación | Descripción |
|----------|-----------|-------------|
| `InspectionItem` | `src/reception/application/dtos/` | Inspección enriquecida con datos de cliente/vehículo/operador |
| `InspectionsResponse` | `src/reception/application/dtos/` | Respuesta de listado paginado de inspecciones |
| `ClientData` | `src/reception/application/dtos/` | Estructura de datos del cliente |
| `VehicleData` | `src/reception/application/dtos/` | Estructura de datos del vehículo |
| `UserData` | `src/reception/application/dtos/` | Estructura de datos del usuario/operador |

### Interfaz de Catálogo

| Interfaz | Ubicación | Descripción |
|----------|-----------|-------------|
| `CatalogItem` | `src/catalogs/catalogs.data.ts` | `{ value: string; label: string }` — eliminada en favor de proxy en vivo |

## Formato de Respuesta

Todas las respuestas del API siguen una estructura unificada a través del `ResponseInterceptor` global:

### Respuesta Exitosa
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-10T21:12:09.144Z",
  "path": "/api/v1/inspections"
}
```

### Respuesta de Error
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-05-10T21:12:10.504Z",
  "path": "/api/v1/inspections"
}
```

### Respuesta Paginada
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "data": [ ... ],
    "total": 50,
    "page": 1,
    "size": 10,
    "totalPages": 5
  },
  "timestamp": "...",
  "path": "..."
}
```
