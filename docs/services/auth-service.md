# Auth Service

**Puerto:** `3001`  
**Tecnología:** NestJS 11 / TypeScript  
**Base de datos:** PostgreSQL + Redis  
**Prefijo Global:** `/api`

## Propósito

Microservicio de autenticación y autorización. Gestiona registro de usuarios, tokens JWT de acceso/refresco, control de acceso basado en roles y endpoints de consulta de usuarios utilizados por otros servicios para enriquecimiento de datos.

## Roles

| Rol | Descripción |
|-----|-------------|
| `ADMIN` | Control total — registro, actualización y eliminación de usuarios |
| `MANAGER` | Consulta, búsqueda e inactivación de usuarios |
| `OPERARIO` | Acceso funcional al módulo de recepción |
| `INSPECTOR` | Acceso funcional al módulo de checklist |

## Endpoints Principales

| Método | Ruta | Autenticación | Descripción |
|--------|------|---------------|-------------|
| `POST` | `/api/auth/login` | Pública | Autenticar, devuelve par de tokens |
| `POST` | `/api/auth/refresh` | Pública | Refrescar token de acceso |
| `POST` | `/api/auth/logout` | Pública | Invalidar token de refresco |
| `POST` | `/api/auth/validate-token` | Pública | Validar un token de acceso |
| `POST` | `/api/auth/register` | Admin | Registrar un usuario |
| `GET` | `/api/auth/users` | Admin/Manager | Listar usuarios con filtro opcional `?role=` |
| `GET` | `/api/auth/users/:id` | Admin/Manager | Obtener usuario por ID |
| `GET` | `/api/auth/users/inspectors` | Interna | Listar inspectores |
| `GET` | `/api/auth/users/operarios` | Interna | Listar operarios |

## Arquitectura

Hexagonal (puertos y adaptadores) con tres capas: Dominio (interfaces, DTOs), Aplicación (casos de uso), Infraestructura (controladores, estrategia JWT, persistencia).

## Swagger

Swagger UI disponible en el endpoint del servicio (si está expuesto).
