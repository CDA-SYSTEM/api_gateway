# Vehicles Service

**Port:** `9000`  
**Tech:** Spring Boot 4 / Java 17  
**Database:** PostgreSQL  
**API Docs:** Swagger UI (implicit via springdoc)

## Purpose

Vehicle management microservice. Handles CRUD for vehicles and all catalog types (brands, lines, colors, classes, vehicle types, service types, fuel types). Supports unified catalog endpoints for generic CRUD operations.

## Key Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Health check with timestamp and service info |

### Vehicle

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/vehiculo` | Create vehicle |
| `GET` | `/vehiculo` | List vehicles (paginated, filterable by client) |
| `GET` | `/vehiculo/:id` | Get vehicle by ID |
| `GET` | `/vehiculo/cliente/:clienteId` | List vehicles by client |
| `PUT` | `/vehiculo/:id` | Update vehicle |
| `DELETE` | `/vehiculo/:id` | Delete vehicle |

### Catalogs (Brand, Line, Color, Class, etc.)

Each catalog type (`marca`, `linea`, `color`, `clase`, `tipo-vehiculo`, `tipo-servicio`, `tipo-combustible`) supports:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/{catalogo}` | Create |
| `GET` | `/{catalogo}` | List all |
| `GET` | `/{catalogo}/:id` | Get by ID |
| `PUT` | `/{catalogo}/:id` | Update |
| `DELETE` | `/{catalogo}/:id` | Delete |

### Unified Catalogs

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/catalogs/{type}` | Create catalog item |
| `GET` | `/api/v1/catalogs/{type}` | List catalog items |
| `GET` | `/api/v1/catalogs/{type}/:id` | Get by ID |
| `PUT` | `/api/v1/catalogs/{type}/:id` | Update |
| `DELETE` | `/api/v1/catalogs/{type}/:id` | Delete |

## Integration

- **RabbitMQ** — Listens on `vehicle-service-queue` for RPC requests from the form service to validate vehicle existence

## Architecture

Hexagonal (ports & adapters) with clear separation: domain (models), application (services, ports), infrastructure (web controllers, persistence, messaging).
