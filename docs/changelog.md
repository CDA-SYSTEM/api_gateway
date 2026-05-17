# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

## [No liberado]

### Corregido
- `POST /auth/login` retornaba HTTP 201 en lugar de 200 por el default de NestJS 11 para rutas POST; se agregó `@HttpCode(200)` explícito

### Agregado
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
