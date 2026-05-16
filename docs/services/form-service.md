# Form Service

**Puerto:** `7500`  
**Tecnología:** NestJS 11 / TypeScript  
**Base de datos:** MongoDB  
**Prefijo Global:** `/api`  
**Documentación API:** `{RECEPTION_SERVICE_BASE_URL}/docs`

## Propósito

Gestión de formularios de recepción de vehículos. Crea, lista, actualiza y elimina de forma suave las inspecciones de vehículos. Valida la existencia del cliente y del vehículo mediante RabbitMQ RPC antes de persistir. Aplica reglas de negocio por tipo de vehículo.

## Reglas de Negocio

| Tipo de Vehículo | Llantas | Checklist |
|-----------------|---------|-----------|
| `MOTOCICLETA_2_TIEMPOS` / `MOTOCICLETA_4_TIEMPOS` | 2 llantas | Solo verificación limpia |
| `LIVIANO` | 4 llantas | Checklist completo |
| `PESADO` | Hasta 12 llantas | Checklist completo |

## Endpoints Principales

### Catálogos (Enums de solo lectura)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/catalogs/vehicle-types` | Tipos de vehículo |
| `GET` | `/api/catalogs/service-types` | Tipos de servicio |
| `GET` | `/api/catalogs/fuel-types` | Tipos de combustible |
| `GET` | `/api/catalogs/tire-positions` | Posiciones de llantas |
| `GET` | `/api/catalogs/ternary-choices` | SI/NO/NO_APLICA |
| `GET` | `/api/catalogs/revision-types` | Tipos de revisión |
| `GET` | `/api/catalogs/customer-types` | Tipos de cliente |
| `GET` | `/api/catalogs/brake-fluid-sight-glass` | Estados de líquido de frenos |

### Inspecciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/inspections` | Crear (valida cliente/vehículo via RabbitMQ) |
| `GET` | `/api/inspections` | Listar con filtros (includeDeleted, vehicle_id, page, size) |
| `GET` | `/api/inspections/:id` | Obtener por ID |
| `PATCH` | `/api/inspections/:id` | Actualizar (re-valida reglas de tipo de vehículo) |
| `DELETE` | `/api/inspections/:id` | Eliminación suave |

## Integración

- **RabbitMQ RPC** — Valida `customer_id` contra `client-service-queue` y `vehicle_id` contra `vehicle-service-queue` antes de guardar inspecciones
- **Eliminación Suave** — Establece timestamp `deleted_at` en lugar de eliminación física

## Arquitectura

Modular con `CatalogsModule`, `InspectionModule` y `RabbitMQModule`. Usa enums TypeScript compartidos para valores de catálogo. Script de siembra disponible via `seed:inspection`.
