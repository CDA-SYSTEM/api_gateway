# Clients Service

**Port:** `8080`  
**Tech:** Spring Boot 4 / Java 17  
**Database:** PostgreSQL  
**API Docs:** `{CLIENT_SERVICE_BASE_URL}/swagger-ui.html`

## Purpose

Client (customer) management microservice. Handles CRUD operations for clients, person types, and document types with paginated search, soft delete, and activation.

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/clients` | List clients (paginated, with search & filters) |
| `POST` | `/clients` | Create client |
| `GET` | `/clients/:id` | Get active client by ID |
| `GET` | `/clients/:id/full` | Get client regardless of active status |
| `PUT` | `/clients/:id` | Update client |
| `DELETE` | `/clients/:id` | Soft delete (deactivate) |
| `PUT` | `/clients/:id/activate` | Reactivate client |
| `GET` | `/clients/all` | List all including inactive |
| `GET` | `/person-types` | List person types |
| `GET` | `/document-types` | List document types |
| `GET` | `/` | Root health check |

## Integration

- **RabbitMQ** — Listens on `client-service-queue` for RPC requests from the form service to validate client existence
- **Soft Delete** — Uses `active` boolean column instead of physical deletion

## Architecture

Modular layered architecture with Spring Boot, Spring Data JPA, Flyway migrations, and Spring AMQP.
