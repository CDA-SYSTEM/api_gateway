# Solución de Problemas

## Errores Comunes

### 502 Bad Gateway — Servicio No Disponible

**Error:**
```json
{
  "statusCode": 502,
  "message": "Reception service no disponible en http://...",
  "error": "Bad Gateway"
}
```

**Causas:**
- El microservicio de destino no está ejecutándose
- Problema de conectividad de red (Tailscale desconectado, host/puerto incorrecto)
- El servicio se cayó o se está reiniciando

**Soluciones:**
```bash
# Verificar si el contenedor del servicio está ejecutándose
docker ps | grep <service-name>

# Verificar los registros del servicio
docker logs <service-name> --tail 50

# Verificar la conectividad de Tailscale
tailscale status

# Probar conectividad directa
curl http://<service-host>:<port>/api/
```

### 401 No Autorizado — Token Inválido o Faltante

**Error:**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

**Soluciones:**
```bash
# Obtener un token nuevo
curl -s -X POST http://localhost:3600/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-api-key' \
  -d '{"email":"user@cda.com","password":"pass"}'
```

### 403 Prohibido — Rol Insuficiente

**Error:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Solución:** El usuario autenticado no tiene el rol requerido. Verifica el decorador `@Roles()` en el endpoint y asegúrate de que el usuario tenga el rol correcto.

### 400 Solicitud Incorrecta — Error de Validación

**Error:**
```json
{
  "statusCode": 400,
  "message": "property photo_reception_url should not exist",
  "error": "Bad Request"
}
```

**Causa:** El payload contiene un campo no permitido en el DTO, o la opción `forbidNonWhitelisted` lo está rechazando.

**Solución:** Solo incluye campos que estén explícitamente definidos en el DTO con decoradores class-validator. El gateway ahora construye payloads explícitos para evitar esto.

### 404 No Encontrado — Ruta No Encontrada

**Error:**
```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/v1/inspections",
  "error": "Not Found"
}
```

**Soluciones:**
- Verifica el prefijo de ruta: todos los endpoints están bajo `/api/v1/...`
- Verifica que el controlador esté registrado en un módulo que sea importado
- Verifica si el módulo está importado en `CommonModule` o `AppModule`

### 413 Payload Demasiado Grande — Archivo Muy Pesado

**Error:** La carga del archivo falla con estado 413.

**Solución:** Aumenta el límite de tamaño de archivo en `main.ts` o en la configuración del servicio de almacenamiento. El límite predeterminado de multer es típicamente 1MB.

## Verificaciones de Salud de Servicios

```bash
# Gateway root
curl -s http://localhost:3600/

# Auth service
curl -s http://<auth-host>:3001/api/auth/login -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"test","password":"test"}'

# Form service
curl -s http://<form-host>:7500/api/

# Storage service
curl -s http://<storage-host>:7000/

# Vehicles service
curl -s http://<vehicle-host>:9000/api/v1/health
```

## Problemas con RabbitMQ

Si la creación de la inspección falla con un error de validación sobre el cliente o vehículo:

```bash
# Verificar que RabbitMQ esté ejecutándose
docker ps | grep rabbitmq

# Verificar los registros de RabbitMQ
docker logs <rabbitmq-container> --tail 50

# Verificar que las colas existan
docker exec <rabbitmq-container> rabbitmqctl list_queues

# Verificar que los consumidores estén conectados
docker exec <rabbitmq-container> rabbitmqctl list_consumers
```

## Problemas de Conexión a Base de Datos

```bash
# PostgreSQL
docker exec <postgres-container> pg_isready -U <user>

# MongoDB
docker exec <mongo-container> mongosh --eval "db.runCommand({ ping: 1 })"

# Cassandra
docker exec <cassandra-container> nodetool status
```

## Modo de Depuración

Habilita el registro detallado configurando la variable de entorno `NODE_ENV` o `DEBUG`:

```bash
docker run -e DEBUG=* -e NODE_ENV=development ...
```

## Referencia de Puertos Comunes

| Servicio | Puerto Predeterminado |
|---------|----------------------|
| API Gateway | `3600` |
| Auth Service | `3001` |
| Clients Service | `8080` |
| Vehicles Service | `9000` |
| Form Service | `7500` |
| Storage Service | `7000` |
| Checklist Service | `8000` |
| PostgreSQL | `5432` |
| RabbitMQ | `5672` (AMQP), `15672` (Management UI) |
| MinIO | `9000` (API), `9001` (Console) |
