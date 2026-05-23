# Checklist Service

**Port:** `8000`  
**Tech:** Django 6.0.3 / Python 3.12  
**Database:** MongoDB  
**Framework:** Django REST Framework 3.17

## Purpose

Checklist (NTC 5375) inspection management. Handles inspection templates, inspection records, tread measurements, and checklist templates organized by vehicle type.

## Gateway Module

The API Gateway exposes the `ChecklistModule` in `src/checklist/` acting as a three-layer proxy to the upstream service.

**Base path:** `/api/v1/checklist`

### Module Architecture

```
src/checklist/
├── checklist.module.ts
├── templates-checklist.controller.ts   (8 endpoints)
├── inspections-checklist.controller.ts (12 endpoints)
├── labrado-checklist.controller.ts     (3 endpoints)
├── application/
│   ├── templates-checklist.service.ts   (thin proxy)
│   ├── inspections-checklist.service.ts (with enrichment)
│   ├── labrado-checklist.service.ts      (thin proxy)
│   └── dtos/           (9 DTOs)
└── infrastructure/
    └── checklist.service.ts  (generic HTTP proxy)
```

### Gateway Features

| Feature | Description |
|---|---|
| **Generic proxy** | `proxyRequest(method, path, data?, headers?)` forwards to checklist-service |
| **Enrichment** | Inspection reads auto-enrich `client`, `vehicle`, and `inspector` data from clients, vehicles, and auth services |
| **Batch enrichment** | Deduplicates IDs in lists — one call per unique ID |
| **Graceful degradation** | If enrichment fails, response returns unenriched (`enrichSafe`) |
| **Error sanitization** | HTML error pages from upstream become clean JSON messages |

### Controllers and Endpoints

#### Templates — `/api/v1/checklist/templates`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/checklist/templates` | List templates (optional `?vehicle_type=MOTO`) |
| `POST` | `/api/v1/checklist/templates` | Create template |
| `GET` | `/api/v1/checklist/templates/motos` | Active motorcycle template |
| `GET` | `/api/v1/checklist/templates/livianos-pesados` | Active light/heavy vehicle template |
| `GET` | `/api/v1/checklist/templates/active/:vehicleType` | Active template by vehicle type |
| `GET` | `/api/v1/checklist/templates/:id` | Get template by ID |
| `PUT` | `/api/v1/checklist/templates/:id` | Update template |
| `DELETE` | `/api/v1/checklist/templates/:id` | Delete template |

#### Inspections — `/api/v1/checklist/inspections`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/checklist/inspections` | List inspections (enriched) |
| `POST` | `/api/v1/checklist/inspections` | Create inspection (draft) |
| `GET` | `/api/v1/checklist/inspections/:id` | Get by ID (enriched) |
| `PUT` | `/api/v1/checklist/inspections/:id` | Update inspection |
| `DELETE` | `/api/v1/checklist/inspections/:id` | Delete inspection |
| `GET` | `/api/v1/checklist/inspections/by-plate/:plate` | Search by plate (enriched) |
| `GET` | `/api/v1/checklist/inspections/by-date` | Filter by date range `?start=&end=` (enriched) |
| `GET` | `/api/v1/checklist/inspections/by-status/:status` | Filter by status (enriched) |
| `GET` | `/api/v1/checklist/inspections/by-vehicle/:vehicleId` | Filter by vehicle (enriched) |
| `PATCH` | `/api/v1/checklist/inspections/:id/draft` | Save as draft |
| `PATCH` | `/api/v1/checklist/inspections/:id/in-progress` | Mark in progress |
| `PATCH` | `/api/v1/checklist/inspections/:id/close` | Close with result (`APROBADO`/`RECHAZADO`) |

#### Tread Measurement (Labrado) — `/api/v1/checklist/labrado`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/checklist/labrado` | Create or update tread measurements |
| `GET` | `/api/v1/checklist/labrado/by-inspection/:inspectionId` | Get measurements by inspection |
| `PUT` | `/api/v1/checklist/labrado/by-inspection/:inspectionId` | Update measurements by inspection |

### Key DTOs

| DTO | Key fields |
|-----|------------|
| `CreateInspectionChecklistDto` | `plate`, `vehicle_id`, `client_id?`, `vehicle_type` (`MOTO`/`LIVIANO`/`PESADO`), `template_id?`, `inspection_datetime?`, `inspector_id`, `responses?[]` |
| `CreateTemplateDto` | `code` (`MOTOS`/`LIVIANOS_PESADOS`), `name`, `version?`, `active?`, `supported_vehicle_types[]`, `sections[]` |
| `CreateLabradoDto` | `inspection_id`, `axles[]` (axle_code -> wheels[] -> tires[] with `outer_mm`, `middle_mm`, `inner_mm`) |
| `CloseInspectionChecklistDto` | `general_result` (`APROBADO`/`RECHAZADO`) |

### Enrichment

**Read** endpoints for inspections auto-enrich the response with client, vehicle, and inspector data:

```json
{
  "data": {
    "id": "...",
    "plate": "ABC123",
    "client": { "id": 1, "name": "Juan Pérez", ... },
    "vehicle": { "id": 1, "plate": "ABC123", "brand": "Toyota", ... },
    "inspector": { "id": "uuid", "name": "Carlos López", "email": "...", ... },
    ...
  }
}
```

Inspector enrichment uses `AuthApplicationService` to fetch data from the auth service. If it fails, the inspection is returned without the `inspector` field enriched (graceful degradation).

**Write** endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) do NOT perform enrichment.

## Architecture

Hexagonal (DDD bounded contexts) with three Django apps: `templates`, `inspections`, and `labrado`. Each app follows domain/application/infrastructure/adapters structure. Settings split across `base.py`, `dev.py`, and `prod.py`.
