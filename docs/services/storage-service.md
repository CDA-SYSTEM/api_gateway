# Storage Service

**Puerto:** `7000`  
**Tecnología:** NestJS 11 / TypeScript  
**Base de datos:** Apache Cassandra  
**Documentación API:** `{UPLOAD_FILES_SERVICE_BASE_URL}/docs`

## Propósito

Microservicio de almacenamiento de archivos usando Apache Cassandra para persistencia binaria. Maneja carga, recuperación, listado y eliminación suave de archivos. Diseñado para almacenar fotos de inspección, imágenes de firmas y otros activos binarios.

## Validación de Archivos

| Regla | Configuración |
|-------|---------------|
| Tipos MIME | Imágenes (`image/*`), PDFs (`application/pdf`) |
| Tamaño Máximo | Configurado via `ParseFilePipeBuilder` |

## Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/storage/upload` | Subir archivo (multipart/form-data) |
| `GET` | `/storage/files` | Listar archivos activos (parámetro opcional `?limit=`) |
| `GET` | `/storage/files/:id` | Descargar/transmitir archivo por UUID |
| `DELETE` | `/storage/files/:id` | Eliminación suave (establece `deleted_at`) |
| `GET` | `/` | Verificación de salud |

## Arquitectura

Estructura modular simple con `StorageController`, `StorageService` y `StorageRepository`. Patrón repositorio para consultas Cassandra. Nomenclatura de archivos basada en UUID. Descarga de archivos basada en streaming.

## Scripts de Migración

Los scripts de esquema y migración de base de datos se encuentran en los directorios `scripts/` y `db/` para la configuración del keyspace y tablas de Cassandra.
