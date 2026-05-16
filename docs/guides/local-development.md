# Guía de Desarrollo Local

## Requisitos Previos

- Node.js 20+ y npm
- Python 3.12+ (para el servicio Checklist)
- Java 17+ (para los servicios Clients y Vehicles)
- Docker y Docker Compose (para bases de datos e infraestructura)
- Git

## Inicio Rápido

### 1. Clonar Repositorios

```bash
# API Gateway (este proyecto)
git clone https://github.com/CDA-SYSTEM/api_gateway.git

# Otros servicios (según sea necesario)
git clone https://github.com/CDA-SYSTEM/AuthServices.git
git clone https://github.com/CDA-SYSTEM/clients-services.git
git clone https://github.com/CDA-SYSTEM/vehicles-service.git
git clone https://github.com/CDA-SYSTEM/form-services.git
git clone https://github.com/CDA-SYSTEM/storage-service.git
```

### 2. Iniciar Infraestructura con Docker

```bash
# PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  postgres:16

# RabbitMQ
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# MinIO (para el servicio de almacenamiento)
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  minio/minio server /data --console-address ":9001"
```

### 3. Configurar Entorno

Copia `.env.example` a `.env` y actualiza los valores:

```bash
cp .env.example .env
```

Variables mínimas requeridas para desarrollo local:

```env
PORT=3600
AUTH_SERVICE_BASE_URL=http://localhost:3001/api
VEHICLE_SERVICE_BASE_URL=http://localhost:9000
CLIENT_SERVICE_BASE_URL=http://localhost:8080
UPLOAD_FILES_SERVICE_BASE_URL=http://localhost:7000
RECEPTION_SERVICE_BASE_URL=http://localhost:7500
API_GATEWAY_BASE_URL=http://localhost:3600
API_KEY=my-secret-api-key-12345
API_KEY_FRONT=my-frontend-api-key-67890
SWAGGER_USER=admin
SWAGGER_PASS=admin123
```

### 4. Iniciar Servicios

#### API Gateway
```bash
cd api_gateway
npm install
npm run start:dev
```

#### Form Service
```bash
cd form-services
npm install
npm run start:dev
```

#### Storage Service
```bash
cd storage-service
npm install
npm run start:dev
```

#### Auth Service
```bash
cd AuthServices
npm install
npm run start:dev
```

#### Clients Service (Spring Boot)
```bash
cd clients-services
./mvnw spring-boot:run
```

#### Vehicles Service (Spring Boot)
```bash
cd vehicles-service
./mvnw spring-boot:run
```

#### Checklist Service (Django)
```bash
cd checklist-service
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

### 5. Verificar que Todo Esté Funcionando

```bash
# Gateway
curl -s http://localhost:3600/

# Cada servicio
curl -s http://localhost:3001/api/auth/login -X POST -H 'Content-Type: application/json' -d '{}'
curl -s http://localhost:7500/api/
curl -s http://localhost:7000/
curl -s http://localhost:9000/api/v1/health
```

## Docker Compose (Todos los Servicios)

Para una configuración completamente contenerizada, crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"

  api-gateway:
    build: ./api_gateway
    ports:
      - "3600:3600"
    env_file: ./api_gateway/.env
    depends_on: [postgres, rabbitmq]
```

## Ejecutar Pruebas

```bash
# Pruebas unitarias del Gateway
cd api_gateway
npm run test

# Pruebas del servicio Form
cd form-services
npm run test
```

## Construir Documentación Localmente

```bash
pip install mkdocs mkdocs-material
mkdocs serve
# Abre en http://127.0.0.1:8000
```

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Iniciar con recarga en caliente |
| `npm run build` | Compilar TypeScript |
| `npm run test` | Ejecutar pruebas |
| `npm run lint` | Analizar código |
| `mkdocs serve` | Vista previa de documentación |
| `mkdocs build` | Construir sitio de documentación estático |
