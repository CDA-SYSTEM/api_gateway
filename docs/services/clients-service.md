# Clients Service

**Puerto:** `8080`  
**Tecnología:** Spring Boot 4 / Java 17  
**Base de datos:** PostgreSQL  
**Documentación API:** `{CLIENT_SERVICE_BASE_URL}/swagger-ui.html`

## Propósito

Microservicio de gestión de clientes. Maneja operaciones CRUD para clientes, tipos de persona y tipos de documento con búsqueda paginada, eliminación suave y activación.

## Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/clients` | Listar clientes (paginado, con búsqueda y filtros) |
| `POST` | `/clients` | Crear cliente |
| `GET` | `/clients/:id` | Obtener cliente activo por ID |
| `GET` | `/clients/:id/full` | Obtener cliente sin importar estado activo |
| `PUT` | `/clients/:id` | Actualizar cliente |
| `DELETE` | `/clients/:id` | Eliminación suave (desactivar) |
| `PUT` | `/clients/:id/activate` | Reactivar cliente |
| `GET` | `/clients/all` | Listar todos incluyendo inactivos |
| `GET` | `/person-types` | Listar tipos de persona |
| `GET` | `/document-types` | Listar tipos de documento |
| `GET` | `/` | Verificación de salud raíz |

## Integración

- **RabbitMQ** — Escucha en `client-service-queue` solicitudes RPC del servicio de formularios para validar existencia del cliente
- **Eliminación Suave** — Usa columna booleana `active` en lugar de eliminación física

## Arquitectura

Arquitectura modular en capas con Spring Boot, Spring Data JPA, migraciones Flyway y Spring AMQP.
