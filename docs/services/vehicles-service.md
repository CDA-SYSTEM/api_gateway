# Vehicles Service

**Puerto:** `9000`  
**Tecnología:** Spring Boot 4 / Java 17  
**Base de datos:** PostgreSQL  
**Documentación API:** Swagger UI (implícito via springdoc)

## Propósito

Microservicio de gestión de vehículos. Maneja CRUD para vehículos y todos los tipos de catálogo (marcas, líneas, colores, clases, tipos de vehículo, tipos de servicio, tipos de combustible). Soporta endpoints de catálogo unificados para operaciones CRUD genéricas.

## Endpoints Principales

### Salud

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/health` | Verificación de salud con timestamp e información del servicio |

### Vehículo

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/vehiculo` | Crear vehículo |
| `GET` | `/vehiculo` | Listar vehículos (paginado, filtrable por cliente) |
| `GET` | `/vehiculo/:id` | Obtener vehículo por ID |
| `GET` | `/vehiculo/cliente/:clienteId` | Listar vehículos por cliente |
| `PUT` | `/vehiculo/:id` | Actualizar vehículo |
| `DELETE` | `/vehiculo/:id` | Eliminar vehículo |

### Catálogos (Marca, Línea, Color, Clase, etc.)

Cada tipo de catálogo (`marca`, `linea`, `color`, `clase`, `tipo-vehiculo`, `tipo-servicio`, `tipo-combustible`) soporta:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/{catalogo}` | Crear |
| `GET` | `/{catalogo}` | Listar todos |
| `GET` | `/{catalogo}/:id` | Obtener por ID |
| `PUT` | `/{catalogo}/:id` | Actualizar |
| `DELETE` | `/{catalogo}/:id` | Eliminar |

### Catálogos Unificados

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/catalogs/{type}` | Crear elemento de catálogo |
| `GET` | `/api/v1/catalogs/{type}` | Listar elementos de catálogo |
| `GET` | `/api/v1/catalogs/{type}/:id` | Obtener por ID |
| `PUT` | `/api/v1/catalogs/{type}/:id` | Actualizar |
| `DELETE` | `/api/v1/catalogs/{type}/:id` | Eliminar |

## Integración

- **RabbitMQ** — Escucha en `vehicle-service-queue` solicitudes RPC del servicio de formularios para validar existencia del vehículo

## Arquitectura

Hexagonal (puertos y adaptadores) con separación clara: dominio (modelos), aplicación (servicios, puertos), infraestructura (controladores web, persistencia, mensajería).
