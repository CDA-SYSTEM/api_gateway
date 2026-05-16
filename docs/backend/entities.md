# Entities & Data Types

The gateway defines TypeScript interfaces and DTOs (Data Transfer Objects) for structured data exchange with microservices.

## DTOs

### Inspection-Related

All DTOs are defined under `src/reception/application/dtos/`:

| DTO | Description |
|-----|-------------|
| `CreateInspectionDto` | Required fields for creating an inspection |
| `UpdateInspectionDto` | Optional fields for partial inspection updates |
| `ChecklistDto` | Vehicle cleanliness and safety checklist |
| `AxleDto` | Vehicle axle definition (index + type) |
| `TireDto` | Tire measurement (position + code + pressure) |

### Vehicle-Related

Defined under `src/vehicle/application/dtos/`:

| DTO | Description |
|-----|-------------|
| `CreateCatalogoDto` | `{ nombre: string }` — Create catalog item |
| `UpdateCatalogoDto` | `{ nombre: string }` — Update catalog item |
| `CreateVehicleDto` | Full vehicle creation payload |
| `UpdateVehicleDto` | Full vehicle update payload |

### Client-Related

Defined under `src/clients/application/dtos/`:

| DTO | Description |
|-----|-------------|
| `CreateClientDto` | Client creation with validation |
| `UpdateClientDto` | Client update with validation |
| `ListClientsQueryDto` | Paginated listing query parameters |

## Interfaces

### Data Interfaces

| Interface | Location | Description |
|-----------|----------|-------------|
| `InspectionItem` | `src/reception/application/dtos/` | Enriched inspection with client/vehicle/operator data |
| `InspectionsResponse` | `src/reception/application/dtos/` | Paginated inspection list response |
| `ClientData` | `src/reception/application/dtos/` | Client data structure |
| `VehicleData` | `src/reception/application/dtos/` | Vehicle data structure |
| `UserData` | `src/reception/application/dtos/` | User/operator data structure |

### Catalog Interface

| Interface | Location | Description |
|-----------|----------|-------------|
| `CatalogItem` | `src/catalogs/catalogs.data.ts` | `{ value: string; label: string }` — removed in favor of live proxying |

## Response Format

All API responses follow a unified structure via the global `ResponseInterceptor`:

### Success Response
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-10T21:12:09.144Z",
  "path": "/api/v1/inspections"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-05-10T21:12:10.504Z",
  "path": "/api/v1/inspections"
}
```

### Paginated Response
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
