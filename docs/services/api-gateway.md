# API Gateway

**Puerto:** `3600`  
**Tecnología:** NestJS 11 / TypeScript  
**Rol:** Punto de entrada único para todas las solicitudes de los clientes.

## Responsabilidades

- **Autenticación y Autorización** — Valida tokens JWT, aplica claves API, verifica acceso basado en roles
- **Enrutamiento de Solicitudes** — Redirige solicitudes HTTP al microservicio correspondiente
- **Orquestación de Carga de Archivos** — Gestiona cargas de archivos multiparte, sube al servicio de almacenamiento e incluye las URLs resultantes en los payloads de inspección
- **Enriquecimiento de Respuestas** — Combina datos de múltiples servicios (cliente, vehículo, operador) en respuestas de inspección unificadas
- **Documentación de API** — Expone Swagger UI en `/docs` con protección de autenticación básica
- **Seguridad** — Inyección de clave API interna para comunicación entre servicios

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/main.ts` | Arranque, pipes globales, interceptores, configuración de Swagger |
| `src/app.module.ts` | Módulo raíz, registro de guardia global, interceptor Axios |
| `src/common/guards/combined.guard.ts` | Guardia de autenticación global (verificación pública + clave API + JWT + roles) |
| `src/common/interceptors/response.interceptor.ts` | Envoltorio de respuesta global |
| `src/reception/application/reception.service.ts` | Orquestación de creación/actualización de inspecciones |
| `src/upload-files/application/upload-files.service.ts` | Gestión de carga/descarga de archivos |

## Capa de Proxy

El gateway no implementa lógica de negocio para entidades de dominio. En su lugar, delega en microservicios dedicados a través de una **arquitectura de proxy de tres capas** (Controlador → Servicio de Aplicación → Servicio de Infraestructura). Esto mantiene el gateway delgado y enfocado en preocupaciones transversales.

## Swagger

`{API_GATEWAY_BASE_URL}/docs` — Protegido con HTTP Basic Auth.
