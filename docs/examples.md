# Ejemplos con Curl

## Autenticación

### Iniciar sesión
```bash
curl -s -X POST http://localhost:3600/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-frontend-api-key' \
  -d '{
    "email": "admin@cda.com",
    "password": "secret123"
  }'
```

### Validar token
```bash
curl -s -X POST http://localhost:3600/api/v1/auth/validate-token \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Inspecciones

### Crear inspección (con archivos)
```bash
curl -s -X POST http://localhost:3600/api/v1/inspections \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -F 'data={
    "mileage": 1200,
    "client_id": "1",
    "vehicle_id": "1",
    "vehicle_type": "LIVIANO",
    "fuel_type": "GASOLINA",
    "service_type": "PARTICULAR",
    "operator_id": "1",
    "customer_type": "PROPIETARIO",
    "revision_type": "TECNICO_MECANICA",
    "tinted_windows": "NO",
    "armored_vehicle": "NO",
    "brake_fluid_sight_glass": "BUEN_ESTADO",
    "checklist": {"is_clean": true},
    "axles": [{"index": 1, "axle_type": "DELANTERO"}],
    "tires": [{"position": "FRONT_LEFT", "code": "TIR-001", "tire_pressure": 32}]
  }' \
  -F 'photo=@/path/to/photo.jpg' \
  -F 'signature=@/path/to/signature.png'
```

### Actualizar inspección (parcial)
```bash
curl -s -X PATCH http://localhost:3600/api/v1/inspections/<id> \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -F 'data={"mileage": 1500, "observations": "Actualizado"}' \
  -F 'photo=@/path/to/new-photo.jpg'
```

### Listar inspecciones
```bash
curl -s 'http://localhost:3600/api/v1/inspections?page=1&size=10&vehicle_id=ABC123' \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Obtener inspección por ID
```bash
curl -s http://localhost:3600/api/v1/inspections/<id> \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Eliminar inspección (Admin)
```bash
curl -s -X DELETE http://localhost:3600/api/v1/inspections/<id> \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Archivos

### Subir archivo
```bash
curl -s -X POST http://localhost:3600/api/v1/storage/upload \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -F 'file=@/path/to/document.pdf'
```

### Descargar archivo (público)
```bash
curl -s -O http://localhost:3600/api/v1/storage/files/<uuid>
```

### Listar archivos
```bash
curl -s 'http://localhost:3600/api/v1/storage/files?limit=20' \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Catálogos (solo lectura)

### Listar tipos de vehículo
```bash
curl -s http://localhost:3600/api/v1/catalogs/vehicle-types \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Listar tipos de combustible
```bash
curl -s http://localhost:3600/api/v1/catalogs/fuel-types \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Catálogos unificados (CRUD)

### Crear elemento de catálogo
```bash
curl -s -X POST http://localhost:3600/api/v1/catalogs/marcas \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"nombre": "Toyota"}'
```

### Listar elementos de catálogo
```bash
curl -s http://localhost:3600/api/v1/catalogs/lineas \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Obtener elemento de catálogo por ID
```bash
curl -s http://localhost:3600/api/v1/catalogs/colores/1 \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Actualizar elemento de catálogo
```bash
curl -s -X PUT http://localhost:3600/api/v1/catalogs/tipos-vehiculo/1 \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"nombre": "CAMIONETA"}'
```

### Eliminar elemento de catálogo
```bash
curl -s -X DELETE http://localhost:3600/api/v1/catalogs/tipos-combustible/1 \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Vehículos

### Crear vehículo
```bash
curl -s -X POST http://localhost:3600/api/v1/vehiculo \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "placa": "ABC123",
    "marca_id": 1,
    "linea_id": 1,
    "modelo": 2024,
    "cliente_id": "1"
  }'
```

### Listar vehículos
```bash
curl -s 'http://localhost:3600/api/v1/vehiculo?page=1&size=10' \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

### Listar vehículos por cliente
```bash
curl -s http://localhost:3600/api/v1/vehiculo/cliente/1 \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Clientes

### Crear cliente
```bash
curl -s -X POST http://localhost:3600/api/v1/clients \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "nombre": "Juan Pérez",
    "documento": "12345678",
    "tipo_documento_id": 1,
    "tipo_persona_id": 1
  }'
```

### Health Check
```bash
curl -s http://localhost:3600/api/v1/health \
  -H 'x-api-key: your-frontend-api-key' \
  -H 'Authorization: Bearer <token>'
```

## Formato de respuesta

Todas las respuestas exitosas siguen esta estructura:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-10T21:12:09.144Z",
  "path": "/api/v1/inspections"
}
```

Respuestas de error:

```json
{
  "statusCode": 400,
  "message": "Validation error details",
  "error": "Bad Request",
  "timestamp": "2026-05-10T21:12:10.504Z",
  "path": "/api/v1/inspections"
}
```

!!! tip "Reemplazar placeholders"
    Reemplace `localhost:3600`, `<token>`, `<id>`, `<uuid>`, `your-frontend-api-key` y las rutas de archivo con sus valores reales.
