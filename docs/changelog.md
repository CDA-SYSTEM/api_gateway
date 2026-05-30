# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

## [No liberado]

### Corregido
- `POST /auth/login` retornaba HTTP 201 en lugar de 200 por el default de NestJS 11 para rutas POST; se agregó `@HttpCode(200)` explícito
- Respuesta de creación de inspección ahora incluye `checklistId` después del PATCH via spread `{ ...created, checklistId }`
- Reemplazo de `console.log` por `this.logger.log` (NestJS Logger) en el flujo de checklist automático
- `InvoicePaidHandler.fetchVehicle` usaba `receptionInfra.proxyRequest` a form-service (sin endpoint `/api/vehicle`) → 404 → null → no creaba checklist. Corregido usando `VehicleService.getVehicleById`

### Agregado
- **Módulo Status** (`/api/v1/statuses`): CRUD proxy para estados de factura/inspección
- **Módulo Price** (`/api/v1/prices`): CRUD proxy para precios por tipo de vehículo y revisión
- **Módulo Invoice** (`/api/v1/invoices`): CRUD proxy para facturas con filtros (`invoice_number`, `statusId`, `inspection_id`, `includeDeleted`, `page`, `size`)
- **Auto-factura al crear inspección**: `POST /api/v1/inspections` dispara `autoCreateInvoice` (fire-and-forget). Resuelve `vehicle_type` desde vehicle-service si el DTO no lo incluye
- **Generar factura manual**: `POST /api/v1/inspections/:id/generate-invoice`
- **InvoicePaidHandler**: Cuando `PATCH /api/v1/invoices/:id` recibe `statusId = PAID`, obtiene vehículo + template, crea checklist en checklist-service y asigna `checklistId` a la inspección
- **Socket.IO Gateway**: Conexión al form-service namespace `/events`, reenvía `invoice.created` e `inspection.status.updated` al frontend
- **`PATCH /api/v1/inspections/:id/status`**: Endpoint proxy para actualizar el estado de una inspección
- **`PATCH /api/v1/inspections/:id/checklist-id`**: Endpoint proxy para actualizar checklistId
- **DTOs con Swagger**: `CreateInvoiceDto`, `UpdateInvoiceDto`, `CreatePriceDto`, `CreateStatusDto` con decoradores `@ApiProperty`
- **`x-api-key` en ChecklistInfrastructureService**: Agregado header `x-api-key` a las solicitudes proxy hacia checklist-service
- Enriquecimiento de `inspector` en lecturas de inspecciones de checklist (usando `AuthApplicationService`)
- Enriquecimiento de vehículos con datos de `client` cacheado via `transform` opcional en `proxyRequestCached`
- Importación de `ChecklistModule` en `ReceptionModule` (exporta `TemplatesChecklistService`, `InspectionsChecklistService`, `ChecklistInfrastructureService`)
- Importación de `AuthModule` en `ChecklistModule` para enriquecimiento de inspector
- Archivo `LICENSE` con todos los derechos reservados para Andres Iles, Emerson Iles, Audino Pantoja, Kevin Chanchi, Oscar Chavez de UniPutumayo
- `README.md` completo con arquitectura, stack tecnológico, instrucciones de instalación y autores
- Documentación detallada de tipos de documentos soportados en `docs/services/storage-service.md` (MIME types, extensiones, tamaños máximos, ejemplos de respuesta)
- Derechos de autor actualizados en `mkdocs.yml`
- Documentación del módulo de checklist (arquitectura, endpoints, DTOs, enriquecimiento) en `docs/services/checklist-service.md`
- Ejemplos de uso con cURL/Python/JavaScript para todos los endpoints de checklist en `docs/examples.md`
- Documentación del formato de respuesta estándar y manejo de códigos HTTP en `docs/services/api-gateway.md`
- Sitio de documentación MkDocs con tema Material
- Flujo de trabajo de GitHub Actions para desplegar documentación en GitHub Pages
- Página de ejemplos con curl para todos los endpoints del gateway
- Guía de despliegue con Docker, Tailscale y GitHub Actions
- Guía de solución de problemas con errores comunes y soluciones
- Guía de arquitectura de red con topología VPN de Tailscale
- Guía de desarrollo local con pasos de configuración para todos los servicios
- Descripción general de la arquitectura de base de datos con ERDs

## [1.0.0] - 2026-05

### Agregado
- Endpoints CRUD de catálogos unificados (`/api/v1/catalogs/{type}`)
- Endpoints `DELETE /vehiculo/:id` y `GET /vehiculo/cliente/:clienteId`
- `PATCH /api/v1/inspections/:id` con carga opcional de archivos
- Catálogos proxy desde form-service (reemplazaron datos hardcodeados)
- Endpoint público de descarga de archivos (decorador `@Public()`)
- Construcción explícita del payload en creación de inspecciones

### Módulo de Recepción
- `POST /api/v1/inspections` con carga de archivos multiparte
- `GET /api/v1/inspections` con filtros, paginación y enriquecimiento de datos
- `GET /api/v1/inspections/:id` con enriquecimiento de cliente/vehículo/operador
- `DELETE /api/v1/inspections/:id` con restricción de rol admin

### Módulo de Carga de Archivos
- `POST /api/v1/storage/upload` para carga de archivos
- `GET /api/v1/storage/files` con listado
- `GET /api/v1/storage/files/:id` para descarga de archivos
- `DELETE /api/v1/storage/files/:id` para borrado lógico

### Módulo de Vehículos
- CRUD completo para vehículos, marcas, líneas, colores, clases
- CRUD completo para tipos de vehículo, tipos de combustible, tipos de servicio
- Endpoint de health check

### Módulo de Clientes
- CRUD completo para clientes con paginación y filtros
- Borrado lógico y reactivación
- Catálogos de tipos de documento y tipos de persona
- Health check raíz

### Módulo de Autenticación
- Inicio de sesión, registro, validación de token, renovación, cierre de sesión
- Gestión de usuarios (CRUD)
- Endpoints de listado de inspectores y operadores

### Infraestructura
- `CombinedGuard` global (API key + JWT + roles)
- `ResponseInterceptor` global con envoltura estándar
- `HttpExceptionFilter` global para formateo de errores
- Interceptor de Axios para inyección de API key interna
- Utilidad de parseo seguro de JSON (`safeParse`)
- CI/CD basado en Tailscale con GitHub Actions
- Contenerización con Docker
