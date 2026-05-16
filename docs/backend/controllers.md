# Controladores

Cada controlador sigue un patrón consistente: extraer el Bearer token del encabezado de la solicitud, luego delegar a la capa de servicio de la aplicación.

## Lista de Controladores

| Controlador | Prefijo | Módulo |
|-------------|---------|--------|
| `AppController` | `/` | AppModule |
| `AuthController` | `api/v1` | AuthModule |
| `VehicleController` | `api/v1` | VehicleModule |
| `ClientsController` | `api/v1` | ClientsModule |
| `RootController` | `/` | ClientsModule |
| `DocumentTypesController` | `api/v1` | ClientsModule |
| `PersonTypesController` | `api/v1` | ClientsModule |
| `UploadFilesController` | `api/v1` | UploadFilesModule |
| `ReceptionController` | `api/v1` | ReceptionModule |
| `CatalogsController` | `api/v1/catalogs` | CatalogsModule |
| `CatalogsCrudController` | `api/v1/catalogs` | CatalogsCrudModule |

## Resumen de Endpoints

### Reception (Inspecciones)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/` | Health check |
| `GET` | `/api/v1/inspections` | Listar con filtros y paginación |
| `POST` | `/api/v1/inspections` | Crear (multipart: data + signature + photo) |
| `GET` | `/api/v1/inspections/:id` | Obtener por ID (enriquecido con cliente/vehículo/operador) |
| `PATCH` | `/api/v1/inspections/:id` | Actualización parcial (multipart, archivos opcionales) |
| `DELETE` | `/api/v1/inspections/:id` | Eliminación suave (solo admin) |

### Archivos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/upload-files` | Health check |
| `GET` | `/api/v1/storage/files` | Listar archivos activos |
| `POST` | `/api/v1/storage/upload` | Subir archivo |
| `GET` | `/api/v1/storage/files/:id` | Descargar archivo (público) |
| `DELETE` | `/api/v1/storage/files/:id` | Eliminación suave |

### Vehículos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET/POST` | `/api/v1/vehiculo` | Listar / Crear |
| `GET/PUT/DELETE` | `/api/v1/vehiculo/:id` | Obtener / Actualizar / Eliminar |
| `GET` | `/api/v1/vehiculo/cliente/:clienteId` | Listar por cliente |
| `GET/POST` | `/api/v1/{catalogo}` | Listar / Crear (marca, clase, linea, etc.) |
| `GET/PUT/DELETE` | `/api/v1/{catalogo}/:id` | Obtener / Actualizar / Eliminar |

### Catálogos Unificados

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/v1/catalogs/{type}` | Listar / Crear elementos de catálogo |
| `GET/PUT/DELETE` | `/api/v1/catalogs/{type}/{id}` | Obtener / Actualizar / Eliminar elemento de catálogo |

### Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/login` | Público | Inicio de sesión de usuario |
| `POST` | `/api/v1/auth/refresh` | Público | Refresco de token |
| `POST` | `/api/v1/auth/logout` | Público | Cierre de sesión |
| `POST` | `/api/v1/auth/validate-token` | Público | Validación de token |
| `POST` | `/api/v1/auth/register` | Admin | Registrar usuario |
| `GET` | `/api/v1/auth/users` | Admin/Manager | Listar usuarios |

### Clientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/v1/clients` | Listar / Crear |
| `GET/PUT/DELETE` | `/api/v1/clients/:id` | Obtener / Actualizar / Eliminación suave |
| `PUT` | `/api/v1/clients/:id/activate` | Reactivar |
| `GET` | `/api/v1/clients/:id/full` | Obtener (incluyendo inactivos) |
| `GET` | `/api/v1/clients/all` | Listar todos (incluyendo inactivos) |
| `GET` | `/api/v1/document-types` | Tipos de documento |
| `GET` | `/api/v1/person-types` | Tipos de persona |
| `GET` | `/` | Health check raíz |
