# Controllers

Every controller follows a consistent pattern: extract the Bearer token from the request header, then delegate to the application service layer.

## Controller List

| Controller | Prefix | Module |
|------------|--------|--------|
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

## Endpoint Summary

### Reception (Inspections)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/` | Health check |
| `GET` | `/api/v1/inspections` | List with filters & pagination |
| `POST` | `/api/v1/inspections` | Create (multipart: data + signature + photo) |
| `GET` | `/api/v1/inspections/:id` | Get by ID (enriched with client/vehicle/operator) |
| `PATCH` | `/api/v1/inspections/:id` | Partial update (multipart, optional files) |
| `DELETE` | `/api/v1/inspections/:id` | Soft delete (admin only) |

### Files

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/upload-files` | Health check |
| `GET` | `/api/v1/storage/files` | List active files |
| `POST` | `/api/v1/storage/upload` | Upload file |
| `GET` | `/api/v1/storage/files/:id` | Download file (public) |
| `DELETE` | `/api/v1/storage/files/:id` | Soft delete |

### Vehicles

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET/POST` | `/api/v1/vehiculo` | List / Create |
| `GET/PUT/DELETE` | `/api/v1/vehiculo/:id` | Get / Update / Delete |
| `GET` | `/api/v1/vehiculo/cliente/:clienteId` | List by client |
| `GET/POST` | `/api/v1/{catalogo}` | List / Create (marca, clase, linea, etc.) |
| `GET/PUT/DELETE` | `/api/v1/{catalogo}/:id` | Get / Update / Delete |

### Unified Catalogs

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/api/v1/catalogs/{type}` | List / Create catalog items |
| `GET/PUT/DELETE` | `/api/v1/catalogs/{type}/{id}` | Get / Update / Delete catalog item |

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/login` | Public | User login |
| `POST` | `/api/v1/auth/refresh` | Public | Token refresh |
| `POST` | `/api/v1/auth/logout` | Public | Logout |
| `POST` | `/api/v1/auth/validate-token` | Public | Token validation |
| `POST` | `/api/v1/auth/register` | Admin | Register user |
| `GET` | `/api/v1/auth/users` | Admin/Manager | List users |

### Clients

| Method | Path | Description |
|--------|------|-------------|
| `GET/POST` | `/api/v1/clients` | List / Create |
| `GET/PUT/DELETE` | `/api/v1/clients/:id` | Get / Update / Soft delete |
| `PUT` | `/api/v1/clients/:id/activate` | Reactivate |
| `GET` | `/api/v1/clients/:id/full` | Get (including inactive) |
| `GET` | `/api/v1/clients/all` | List all (including inactive) |
| `GET` | `/api/v1/document-types` | Document types |
| `GET` | `/api/v1/person-types` | Person types |
| `GET` | `/` | Root health check |
