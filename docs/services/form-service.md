# Form Service

**Puerto:** `7500`  
**Tecnología:** NestJS 11 / TypeScript  
**Base de datos:** MongoDB  
**Prefijo Global:** `/api`  
**Documentación API:** `{RECEPTION_SERVICE_BASE_URL}/docs`

## Propósito

Gestión de formularios de recepción de vehículos, estados, precios y facturas. Crea, lista, actualiza y elimina de forma suave las inspecciones de vehículos. Valida la existencia del cliente y del vehículo mediante RabbitMQ RPC antes de persistir. Al crear una inspección, asigna automáticamente estado PENDING. Incluye módulos de facturación con cálculo automático de IVA y totales, y sincronización de estados entre facturas e inspecciones. Aplica reglas de negocio por tipo de vehículo.

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
| `POST` | `/api/inspections` | Crear (valida cliente/vehículo via RabbitMQ, asigna estado PENDING automáticamente, auto-crea factura) |
| `GET` | `/api/inspections` | Listar con filtros (includeDeleted, vehicle_id, page, size). Incluye `statusId` y `statusName` |
| `GET` | `/api/inspections/:id` | Obtener por ID |
| `PATCH` | `/api/inspections/:id` | Actualizar (re-valida reglas de tipo de vehículo) |
| `PATCH` | `/api/inspections/:id/status` | Actualizar estado de la inspección (sincroniza con factura vinculada) |
| `PATCH` | `/api/inspections/:id/checklist-id` | Actualizar solo el `checklistId` (desde checklist-service) |
| `DELETE` | `/api/inspections/:id` | Eliminación suave |

### Status

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/statuses` | Crear estado |
| `GET` | `/api/statuses` | Listar estados (filtro por `code`) |
| `GET` | `/api/statuses/:id` | Obtener estado por ID |
| `PATCH` | `/api/statuses/:id` | Actualizar estado |
| `DELETE` | `/api/statuses/:id` | Soft delete |

**Seed:** 4 estados por defecto: PENDING (Pendiente), PAID (Pagado), CANCELLED (Anulado), REFUNDED (Reembolsado)

### Price

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/prices` | Crear precio |
| `GET` | `/api/prices` | Listar precios (filtro por `vehicleType`, `revisionType`) |
| `GET` | `/api/prices/:id` | Obtener precio por ID |
| `PATCH` | `/api/prices/:id` | Actualizar precio |
| `DELETE` | `/api/prices/:id` | Soft delete |

**Seed:** 8 combinaciones de precio (LIVIANO, MOTOCICLETA_2_TIEMPOS, MOTOCICLETA_4_TIEMPOS, PESADO × TECNICO_MECANICA, PREVENTIVA)

### Invoice

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/invoices` | Crear factura (genera número auto, calcula subtotal+IVA+total) |
| `GET` | `/api/invoices` | Listar facturas (filtros: `invoice_number`, `statusId`, `inspection_id`, `includeDeleted`, `page`, `size`) |
| `GET` | `/api/invoices/:id` | Obtener factura por ID. Incluye `statusName` resuelto |
| `PATCH` | `/api/invoices/:id` | Actualizar factura (recalcula totales). Si cambia a PAID, sincroniza estado en inspección vinculada |
| `DELETE` | `/api/invoices/:id` | Soft delete |

**Validación:** Una factura por `inspection_id` (no permite duplicados)
**Cálculos:** `subtotal` = suma de items, `tax` = 0% (temporal), `total` = subtotal + tax

## Socket.IO

| Namespace | Evento | Descripción |
|-----------|--------|-------------|
| `/events` | `invoice.created` | Se emite al crear una factura con el objeto completo |
| `/events` | `inspection.status.updated` | Se emite al actualizar el estado de una inspección con el objeto completo y el nuevo `statusName` |

## Integración

- **RabbitMQ RPC** — Valida `customer_id` contra `client-service-queue` y `vehicle_id` contra `vehicle-service-queue` antes de guardar inspecciones
- **Sync de estados** — Al cambiar el estado de una inspección a PAID/CANCELLED/REFUNDED, sincroniza automáticamente el estado de la factura vinculada y viceversa
- **Checklist al pagar** — El checklist ya no se crea al crear la inspección, sino cuando la factura se marca como PAID. El `InvoicePaidHandler` en el gateway orquesta el proceso
- **PATCH /checklist-id** — Endpoint interno para que el gateway asigne el `checklistId` del checklist creado en la inspección de recepción
- **Eliminación Suave** — Establece timestamp `deleted_at` en lugar de eliminación física

## Arquitectura

Modular con `CatalogsModule`, `InspectionModule`, `StatusModule`, `PriceModule`, `InvoiceModule` y `RabbitMQModule`. Usa enums TypeScript compartidos para valores de catálogo. Scripts de siembra disponibles via `seed:status`, `seed:price` y `seed:all`.
