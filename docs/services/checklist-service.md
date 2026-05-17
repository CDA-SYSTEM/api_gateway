# Checklist Service

**Puerto:** `8000`  
**Tecnología:** Django 6.0.3 / Python 3.12  
**Base de datos:** MongoDB  
**Framework:** Django REST Framework 3.17

## Propósito

Gestión de inspecciones de checklist (NTC 5375). Maneja plantillas de inspección, registros de inspección, mediciones de labrado y plantillas de checklist organizadas por tipo de vehículo.

## Módulo Gateway

El API Gateway expone el módulo `ChecklistModule` en `src/checklist/` que actúa como proxy de tres capas hacia el upstream service.

**Base path:** `/api/v1/checklist`

### Arquitectura del Módulo

```
src/checklist/
├── checklist.module.ts
├── templates-checklist.controller.ts   (8 endpoints)
├── inspections-checklist.controller.ts (12 endpoints)
├── labrado-checklist.controller.ts     (3 endpoints)
├── application/
│   ├── templates-checklist.service.ts   (thin proxy)
│   ├── inspections-checklist.service.ts (con enrichment)
│   ├── labrado-checklist.service.ts      (thin proxy)
│   └── dtos/           (9 DTOs)
└── infrastructure/
    └── checklist.service.ts  (HTTP proxy genérico)
```

### Características del Gateway

| Característica | Descripción |
|---|---|
| **Proxy genérico** | `proxyRequest(method, path, data?, headers?)` que reenvía al checklist-service |
| **Enriquecimiento** | Las lecturas de inspecciones enriquecen automáticamente `client` y `vehicle` desde los servicios de clientes y vehículos |
| **Enriquecimiento batch** | Para listados, agrupa IDs duplicados y hace una llamada por ID único |
| **Degradación gradual** | Si falla el enriquecimiento, la respuesta se devuelve sin enriquecer (`enrichSafe`) |
| **Sanitización de errores** | Las respuestas HTML del upstream se convierten en mensajes limpios |

### Controladores y Endpoints

#### Plantillas — `/api/v1/checklist/templates`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/checklist/templates` | Listar plantillas (filtro opcional `?vehicle_type=MOTO`) |
| `POST` | `/api/v1/checklist/templates` | Crear plantilla |
| `GET` | `/api/v1/checklist/templates/motos` | Plantilla activa para motocicletas |
| `GET` | `/api/v1/checklist/templates/livianos-pesados` | Plantilla activa para livianos/pesados |
| `GET` | `/api/v1/checklist/templates/active/:vehicleType` | Plantilla activa por tipo de vehículo |
| `GET` | `/api/v1/checklist/templates/:id` | Obtener plantilla por ID |
| `PUT` | `/api/v1/checklist/templates/:id` | Actualizar plantilla |
| `DELETE` | `/api/v1/checklist/templates/:id` | Eliminar plantilla |

#### Inspecciones — `/api/v1/checklist/inspections`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/checklist/inspections` | Listar inspecciones (con enriquecimiento) |
| `POST` | `/api/v1/checklist/inspections` | Crear inspección (borrador) |
| `GET` | `/api/v1/checklist/inspections/:id` | Obtener por ID (con enriquecimiento) |
| `PUT` | `/api/v1/checklist/inspections/:id` | Actualizar inspección |
| `DELETE` | `/api/v1/checklist/inspections/:id` | Eliminar inspección |
| `GET` | `/api/v1/checklist/inspections/by-plate/:plate` | Buscar por placa (con enriquecimiento) |
| `GET` | `/api/v1/checklist/inspections/by-date` | Filtrar por rango de fechas `?start=&end=` (con enriquecimiento) |
| `GET` | `/api/v1/checklist/inspections/by-status/:status` | Filtrar por estado (con enriquecimiento) |
| `GET` | `/api/v1/checklist/inspections/by-vehicle/:vehicleId` | Filtrar por vehículo (con enriquecimiento) |
| `PATCH` | `/api/v1/checklist/inspections/:id/draft` | Guardar como borrador |
| `PATCH` | `/api/v1/checklist/inspections/:id/in-progress` | Marcar en progreso |
| `PATCH` | `/api/v1/checklist/inspections/:id/close` | Cerrar con resultado (`APROBADO`/`RECHAZADO`) |

#### Medición de Labrado — `/api/v1/checklist/labrado`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/checklist/labrado` | Crear o actualizar medidas de labrado |
| `GET` | `/api/v1/checklist/labrado/by-inspection/:inspectionId` | Obtener medidas por inspección |
| `PUT` | `/api/v1/checklist/labrado/by-inspection/:inspectionId` | Actualizar medidas por inspección |

### DTOs Principales

| DTO | Campos clave |
|-----|-------------|
| `CreateInspectionChecklistDto` | `plate`, `vehicle_id`, `client_id?`, `vehicle_type` (`MOTO`/`LIVIANO`/`PESADO`), `template_id?`, `inspection_datetime?`, `inspector_id`, `responses?[]` |
| `CreateTemplateDto` | `code` (`MOTOS`/`LIVIANOS_PESADOS`), `name`, `version?`, `active?`, `supported_vehicle_types[]`, `sections[]` |
| `CreateLabradoDto` | `inspection_id`, `axles[]` (axle_code -> wheels[] -> tires[] con `outer_mm`, `middle_mm`, `inner_mm`) |
| `CloseInspectionChecklistDto` | `general_result` (`APROBADO`/`RECHAZADO`) |

### Enriquecimiento

Los endpoints de **lectura** de inspecciones enriquecen automáticamente la respuesta con datos del cliente y vehículo:

```json
{
  "data": {
    "id": "...",
    "plate": "ABC123",
    "client": { "id": 1, "nombre": "Juan Pérez", ... },
    "vehicle": { "id": 1, "placa": "ABC123", "marca": "Toyota", ... },
    ...
  }
}
```

Los endpoints de **escritura** (`POST`, `PUT`, `PATCH`, `DELETE`) NO realizan enriquecimiento.

## Arquitectura

Hexagonal (contextos delimitados DDD) con tres aplicaciones Django: `templates`, `inspections` y `labrado`. Cada aplicación sigue la estructura dominio/aplicación/infraestructura/adaptadores. Configuraciones divididas entre `base.py`, `dev.py` y `prod.py`.
