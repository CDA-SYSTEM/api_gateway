# Storage Service

**Puerto:** `7000`  
**Tecnología:** NestJS 11 / TypeScript  
**Base de datos:** Apache Cassandra  
**Documentación API:** `{UPLOAD_FILES_SERVICE_BASE_URL}/docs`

## Propósito

Microservicio de almacenamiento de archivos usando Apache Cassandra para persistencia binaria. Maneja carga, recuperación, listado y eliminación suave de archivos. Diseñado para almacenar fotos de inspección, imágenes de firmas, documentos PDF y otros activos binarios del sistema.

## Tipos de Documentos Soportados

El servicio acepta los siguientes tipos de archivos para los distintos casos de uso del sistema:

| Tipo | MIME Types | Extensiones | Uso |
|------|-----------|-------------|-----|
| Fotos de inspección | `image/jpeg`, `image/png`, `image/webp` | `.jpg`, `.jpeg`, `.png`, `.webp` | Evidencia fotográfica del vehículo |
| Firmas | `image/png`, `image/jpeg` | `.png`, `.jpg` | Firmas del operador y cliente |
| Documentos PDF | `application/pdf` | `.pdf` | Reportes, certificados, documentación legal |
| Otras imágenes | `image/gif`, `image/bmp`, `image/tiff` | `.gif`, `.bmp`, `.tiff` | Imágenes adicionales |

## Validación de Archivos

| Regla | Configuración |
|-------|---------------|
| Tipos MIME permitidos | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/bmp`, `image/tiff`, `application/pdf` |
| Tamaño máximo por archivo | Configurado via `ParseFilePipeBuilder` (por defecto 10 MB) |
| Nombre de archivo | Generado automáticamente como UUID v4 |
| Almacenamiento | Binario directo en Apache Cassandra (columna `data` tipo `blob`) |

## Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/storage/upload` | Subir archivo (multipart/form-data, campo `file`) |
| `GET` | `/storage/files` | Listar archivos activos (parámetro opcional `?limit=`) |
| `GET` | `/storage/files/:id` | Descargar/transmitir archivo por UUID |
| `DELETE` | `/storage/files/:id` | Eliminación suave (establece `deleted_at`) |
| `GET` | `/` | Verificación de salud |

### POST `/storage/upload`

Sube un archivo al sistema. El campo del formulario debe llamarse `file`.

**Request (multipart/form-data):**
```
file: @/ruta/al/archivo.jpg
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid-del-archivo",
    "filename": "original-name.jpg",
    "mimetype": "image/jpeg",
    "size": 123456,
    "created_at": "2026-05-23T10:00:00.000Z"
  }
}
```

### GET `/storage/files/:id`

Descarga un archivo por su UUID. La respuesta incluye los encabezados `Content-Type` y `Content-Disposition` adecuados para visualización en navegador o descarga forzada.

### GET `/storage/files`

Lista los archivos activos (no eliminados). Parámetros opcionales:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `limit` | number | Cantidad máxima de resultados (por defecto 20) |
| `offset` | string | UUID para paginación basada en cursor |

## Arquitectura

Estructura modular simple con `StorageController`, `StorageService` y `StorageRepository`. Patrón repositorio para consultas Cassandra. Nomenclatura de archivos basada en UUID v4. Descarga de archivos basada en streaming para eficiencia de memoria.

## Scripts de Migración

Los scripts de esquema y migración de base de datos se encuentran en los directorios `scripts/` y `db/` para la configuración del keyspace y tablas de Cassandra.

## Consideraciones

- Los archivos se almacenan como binario directamente en Cassandra (no en sistema de archivos)
- La descarga pública no requiere autenticación (decorador `@Public()`)
- La eliminación es suave: solo marca `deleted_at`, no elimina físicamente
- El tamaño máximo de archivo está limitado por `ParseFilePipeBuilder` y puede ajustarse via variables de entorno
