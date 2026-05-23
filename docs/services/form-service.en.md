# Form Service

**Port:** `7500`  
**Tech:** NestJS 11 / TypeScript  
**Database:** MongoDB  
**Global Prefix:** `/api`  
**API Docs:** `{RECEPTION_SERVICE_BASE_URL}/docs`

## Purpose

Vehicle reception form management. Creates, lists, updates, and soft-deletes vehicle inspections. Validates client and vehicle existence via RabbitMQ RPC before persisting. On creation, automatically creates an associated checklist record in checklist-service. Enforces business rules per vehicle type.

## Business Rules

| Vehicle Type | Tires | Checklist |
|-------------|-------|-----------|
| `MOTOCICLETA_2_TIEMPOS` / `MOTOCICLETA_4_TIEMPOS` | 2 tires | Clean check only |
| `LIVIANO` | 4 tires | Full checklist |
| `PESADO` | Up to 12 tires | Full checklist |

## Key Endpoints

### Catalogs (Read-only enums)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/catalogs/vehicle-types` | Vehicle types |
| `GET` | `/api/catalogs/service-types` | Service types |
| `GET` | `/api/catalogs/fuel-types` | Fuel types |
| `GET` | `/api/catalogs/tire-positions` | Tire positions |
| `GET` | `/api/catalogs/ternary-choices` | SI/NO/NO_APLICA |
| `GET` | `/api/catalogs/revision-types` | Revision types |
| `GET` | `/api/catalogs/customer-types` | Customer types |
| `GET` | `/api/catalogs/brake-fluid-sight-glass` | Brake fluid states |

### Inspections

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/inspections` | Create (validates client/vehicle via RabbitMQ, auto-creates checklist) |
| `GET` | `/api/inspections` | List with filters (includeDeleted, vehicle_id, page, size) |
| `GET` | `/api/inspections/:id` | Get by ID |
| `PATCH` | `/api/inspections/:id` | Update (re-validates vehicle type rules) |
| `PATCH` | `/api/inspections/:id/checklist-id` | Update only the `checklistId` (from checklist-service) |
| `DELETE` | `/api/inspections/:id` | Soft delete |

## Integration

- **RabbitMQ RPC** — Validates `customer_id` against `client-service-queue` and `vehicle_id` against `vehicle-service-queue` before saving inspections
- **Checklist Service** — On create (`POST /api/inspections`), fetches the vehicle, determines the active template by type (`MOTO`/`LIVIANO`/`PESADO`), and auto-creates a checklist record via checklist-service API. The resulting `checklistId` is assigned back to the reception inspection
- **PATCH /checklist-id** — Internal endpoint for checklist-service to notify the created ID without relying on the auto-flow
- **Soft Delete** — Sets `deleted_at` timestamp instead of physical deletion

## Architecture

Modular with `CatalogsModule`, `InspectionModule`, and `RabbitMQModule`. Uses shared TypeScript enums for catalog values. Imports `ChecklistModule` for automatic checklist creation. Seed script available via `seed:inspection`.
