# Troubleshooting

## Common Errors

### 502 Bad Gateway — Service Unavailable

**Error:**
```json
{
  "statusCode": 502,
  "message": "Reception service no disponible en http://...",
  "error": "Bad Gateway"
}
```

**Causes:**
- The target microservice is not running
- Network connectivity issue (Tailscale disconnected, wrong host/port)
- Service crashed or restarting

**Solutions:**
```bash
# Check if the service container is running
docker ps | grep <service-name>

# Check service logs
docker logs <service-name> --tail 50

# Verify Tailscale connectivity
tailscale status

# Test direct connectivity
curl http://<service-host>:<port>/api/
```

### 401 Unauthorized — Invalid or Missing Token

**Error:**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

**Solutions:**
```bash
# Get a fresh token
curl -s -X POST http://localhost:3600/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-api-key' \
  -d '{"email":"user@cda.com","password":"pass"}'
```

### 403 Forbidden — Insufficient Role

**Error:**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Solution:** The authenticated user lacks the required role. Check the `@Roles()` decorator on the endpoint and ensure the user has the correct role.

### 400 Bad Request — Validation Error

**Error:**
```json
{
  "statusCode": 400,
  "message": "property photo_reception_url should not exist",
  "error": "Bad Request"
}
```

**Cause:** The payload contains a field not whitelisted in the DTO, or the `forbidNonWhitelisted` option is rejecting it.

**Solution:** Only include fields that are explicitly defined in the DTO with class-validator decorators. The gateway now builds explicit payloads to prevent this.

### 404 Not Found — Route Not Found

**Error:**
```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/v1/inspections",
  "error": "Not Found"
}
```

**Solutions:**
- Check the route prefix: all endpoints are under `/api/v1/...`
- Verify the controller is registered in a module that is imported
- Check if the module is imported in `CommonModule` or `AppModule`

### 413 Payload Too Large — File Too Big

**Error:** File upload fails with 413 status.

**Solution:** Increase the file size limit in `main.ts` or the storage service configuration. Default multer limit is typically 1MB.

## Service Health Checks

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

## RabbitMQ Issues

If inspection creation fails with a validation error about client or vehicle:

```bash
# Check RabbitMQ is running
docker ps | grep rabbitmq

# Check RabbitMQ logs
docker logs <rabbitmq-container> --tail 50

# Verify queues exist
docker exec <rabbitmq-container> rabbitmqctl list_queues

# Verify consumers are connected
docker exec <rabbitmq-container> rabbitmqctl list_consumers
```

## Database Connection Issues

```bash
# PostgreSQL
docker exec <postgres-container> pg_isready -U <user>

# MongoDB
docker exec <mongo-container> mongosh --eval "db.runCommand({ ping: 1 })"

# Cassandra
docker exec <cassandra-container> nodetool status
```

## Debug Mode

Enable verbose logging by setting the `NODE_ENV` or `DEBUG` environment variable:

```bash
docker run -e DEBUG=* -e NODE_ENV=development ...
```

## Common Ports Reference

| Service | Default Port |
|---------|-------------|
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
