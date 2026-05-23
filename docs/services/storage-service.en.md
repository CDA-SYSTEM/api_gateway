# Storage Service

**Port:** `7000`  
**Tech:** NestJS 11 / TypeScript  
**Database:** Apache Cassandra  
**API Docs:** `{UPLOAD_FILES_SERVICE_BASE_URL}/docs`

## Purpose

File storage microservice using Apache Cassandra for binary persistence. Handles file upload, retrieval, listing, and soft-deletion. Designed for storing inspection photos, signature images, PDF documents, and other binary assets.

## Supported Document Types

The service accepts the following file types for different system use cases:

| Type | MIME Types | Extensions | Usage |
|------|-----------|-------------|-------|
| Inspection photos | `image/jpeg`, `image/png`, `image/webp` | `.jpg`, `.jpeg`, `.png`, `.webp` | Vehicle photographic evidence |
| Signatures | `image/png`, `image/jpeg` | `.png`, `.jpg` | Operator and client signatures |
| PDF documents | `application/pdf` | `.pdf` | Reports, certificates, legal documentation |
| Other images | `image/gif`, `image/bmp`, `image/tiff` | `.gif`, `.bmp`, `.tiff` | Additional images |

## File Validation

| Rule | Setting |
|------|---------|
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/bmp`, `image/tiff`, `application/pdf` |
| Max file size | Configured via `ParseFilePipeBuilder` (default 10 MB) |
| File naming | Auto-generated UUID v4 |
| Storage | Direct binary in Apache Cassandra (`data` column as `blob`) |

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/storage/upload` | Upload file (multipart/form-data, field `file`) |
| `GET` | `/storage/files` | List active files (optional `?limit=` parameter) |
| `GET` | `/storage/files/:id` | Download/stream file by UUID |
| `DELETE` | `/storage/files/:id` | Soft delete (sets `deleted_at`) |
| `GET` | `/` | Health check |

### POST `/storage/upload`

Uploads a file to the system. The form field must be named `file`.

**Request (multipart/form-data):**
```
file: @/path/to/file.jpg
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "File uploaded successfully",
  "data": {
    "id": "file-uuid",
    "filename": "original-name.jpg",
    "mimetype": "image/jpeg",
    "size": 123456,
    "created_at": "2026-05-23T10:00:00.000Z"
  }
}
```

### GET `/storage/files/:id`

Downloads a file by UUID. The response includes appropriate `Content-Type` and `Content-Disposition` headers for browser display or forced download.

### GET `/storage/files`

Lists active (non-deleted) files. Optional query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Maximum results (default 20) |
| `offset` | string | UUID for cursor-based pagination |

## Architecture

Simple module structure with `StorageController`, `StorageService`, and `StorageRepository`. Repository pattern for Cassandra queries. UUID v4-based file naming. Stream-based file download for memory efficiency.

## Migration Scripts

Database schema and migration scripts are located in `scripts/` and `db/` directories for Cassandra keyspace and table setup.

## Considerations

- Files are stored as binary directly in Cassandra (not on filesystem)
- Public download does not require authentication (`@Public()` decorator)
- Deletion is soft: only sets `deleted_at`, no physical removal
- Max file size is limited by `ParseFilePipeBuilder` and adjustable via environment variables