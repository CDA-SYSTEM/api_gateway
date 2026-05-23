<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">CDA System — API Gateway</h1>

<p align="center">
  <a href="https://cda-system.github.io/api_gateway/" target="_blank">
    <img src="https://img.shields.io/badge/Documentación-📖-teal?style=for-the-badge" alt="Documentación ES" />
  </a>
  <a href="https://cda-system.github.io/api_gateway/en/" target="_blank">
    <img src="https://img.shields.io/badge/Docs-📖-teal?style=for-the-badge" alt="Docs EN" />
  </a>
  <a href="https://github.com/CDA-SYSTEM/api_gateway">
    <img src="https://img.shields.io/badge/Repositorio-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://github.com/CDA-SYSTEM/api_gateway/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/Licencia-Derechos_Reservados-red?style=for-the-badge" alt="License" />
  </a>
</p>

<p align="center">
  <strong>Sistema integral de inspección vehicular para centros de diagnóstico automotor (CDA)</strong><br />
  Arquitectura de microservicios con NestJS, Spring Boot y Django.
</p>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Pruebas](#-pruebas)
- [Documentación](#-documentación)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Autores](#-autores)
- [Licencia](#-licencia)

---

## 📖 Descripción

**CDA System** es un sistema integral de inspección vehicular diseñado
para centros de diagnóstico automotor (CDA). El **API Gateway** actúa
como punto de entrada único para todas las solicitudes, orquestando la
comunicación entre microservicios especializados.

El sistema cubre el flujo completo de una inspección vehicular:
autenticación de usuarios, registro de clientes y vehículos, formularios
de recepción con checklist NTC 5375, carga de evidencias fotográficas,
medición de labrado de neumáticos y generación de resultados.

---

## 🏗️ Arquitectura

```
                    ┌──────────────┐
                    │  Cliente Web │
                    │  / Mobile    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  API Gateway │ :3600
                    │   (NestJS)   │
                    └──┬───┬───┬───┘
                       │   │   │
          ┌────────────┘   │   └────────────┐
          ▼                ▼                ▼
   ┌──────────┐    ┌──────────────┐  ┌──────────────┐
   │   Auth   │    │    Form      │  │   Storage    │
   │ :3001    │    │   :7500      │  │   :7000      │
   │ NestJS   │    │   NestJS     │  │   NestJS     │
   │ PostgreSQL│   │   MongoDB    │  │  Cassandra   │
   └──────────┘    └──┬───┬───────┘  └──────────────┘
                      │   │
          ┌───────────┘   └───────────┐
          ▼                           ▼
   ┌──────────────┐          ┌──────────────┐
   │   Clients    │          │   Vehicles   │
   │   :8080      │          │   :9000      │
   │  Spring Boot │          │  Spring Boot │
   │  PostgreSQL  │          │  PostgreSQL  │
   └──────────────┘          └──────────────┘

   ┌──────────────────┐
   │   Checklist      │
   │   :8000          │
   │  Django / Python │
   │     MongoDB      │
   └──────────────────┘
```

### Flujo de una Inspección

1. **Autenticación** → Login JWT (Auth Service)
2. **Registro** → Cliente (Clients Service) y Vehículo (Vehicles Service)
3. **Recepción** → Formulario multiparte con fotos (Form Service + Storage Service)
4. **Checklist** → Creación automática de inspección NTC 5375 (Checklist Service)
5. **Inspección** → Respuestas, medición de labrado, cierre con resultado
6. **Resultado** → Aprobado o Rechazado con evidencia completa

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Puerto | Base de Datos |
|------------|------------|--------|---------------|
| API Gateway | NestJS 11 / TypeScript | `3600` | — |
| Auth Service | NestJS 11 / TypeScript | `3001` | PostgreSQL + Redis |
| Clients Service | Spring Boot 4 / Java 17 | `8080` | PostgreSQL |
| Vehicles Service | Spring Boot 4 / Java 17 | `9000` | PostgreSQL |
| Form Service | NestJS 11 / TypeScript | `7500` | MongoDB |
| Storage Service | NestJS 11 / TypeScript | `7000` | Apache Cassandra |
| Checklist Service | Django 6.0.3 / Python 3.12 | `8000` | MongoDB |
| Documentación | MkDocs + Material Theme | — | — |
| CI/CD | GitHub Actions + Docker | — | — |
| VPN | Tailscale | — | — |

---

## ✨ Características

### Gateway
- ✅ Enrutamiento centralizado a 6 microservicios
- ✅ Autenticación JWT + API Key + RBAC
- ✅ Response interceptor con formato estándar
- ✅ HttpExceptionFilter global
- ✅ Cache con indicador de origen (cache/service)
- ✅ Sanitización de errores upstream
- ✅ Enriquecimiento cruzado de datos

### Autenticación
- ✅ Login / Register / Refresh / Logout
- ✅ Validación de tokens JWT
- ✅ Roles: admin, operator, inspector
- ✅ CRUD de usuarios
- ✅ Listado de inspectores y operadores

### Formulario de Recepción
- ✅ CRUD de inspecciones con archivos multiparte
- ✅ Validación RabbitMQ RPC (cliente + vehículo)
- ✅ Creación automática de checklist por tipo de vehículo
- ✅ Reglas de negocio: MOTO (2 llantas), LIVIANO (4), PESADO (hasta 12)
- ✅ Eliminación suave
- ✅ Catálogos proxy desde form-service

### Checklist NTC 5375
- ✅ Plantillas por tipo de vehículo (MOTO / LIVIANO / PESADO)
- ✅ Inspecciones con secciones, subsecciones e ítems
- ✅ Medición de labrado por eje y neumático
- ✅ Estados: draft → in_progress → completed / cancelled
- ✅ Cierre con resultado APROBADO / RECHAZADO
- ✅ Enriquecimiento de cliente, vehículo e inspector

### Almacenamiento
- ✅ Carga de fotos, firmas y documentos PDF
- ✅ Persistencia en Apache Cassandra
- ✅ Descarga pública por UUID
- ✅ Listado con paginación por cursor
- ✅ Eliminación suave

### Vehículos
- ✅ CRUD completo con marcas, líneas, colores, clases
- ✅ Catálogos de tipos de vehículo, combustible, servicio
- ✅ Búsqueda por cliente

### Clientes
- ✅ CRUD completo con paginación y filtros
- ✅ Tipos de documento y persona
- ✅ Borrado lógico y reactivación

### Infraestructura
- ✅ Documentación bilingüe (ES/EN) con MkDocs
- ✅ CI/CD con GitHub Actions y Docker
- ✅ Postman collection para pruebas
- ✅ Catálogos unificados con CRUD dinámico

---

## 📁 Estructura del Proyecto

```
api_gateway/
├── .github/                   # GitHub Actions workflows
│   └── workflows/
│       ├── deploy-docker.yml
│       └── docs.yml
├── docs/                      # Documentación MkDocs
│   ├── index.md               # Página principal (ES)
│   ├── index.en.md            # Página principal (EN)
│   ├── examples.md            # Ejemplos de uso
│   ├── changelog.md           # Registro de cambios
│   ├── backend/               # Documentación del backend
│   ├── database/              # Arquitectura de BD
│   ├── guides/                # Guías (despliegue, desarrollo, etc.)
│   └── services/              # Documentación por microservicio
├── postman/                   # Colecciones de Postman
├── src/                       # Código fuente
│   ├── reception/             # Módulo de recepción
│   ├── checklist/             # Módulo de checklist
│   ├── vehicle/               # Módulo de vehículos
│   ├── clients/               # Módulo de clientes
│   ├── auth/                  # Módulo de autenticación
│   ├── storage/               # Módulo de almacenamiento
│   ├── catalogs/              # Módulo de catálogos
│   ├── common/                # Utilidades compartidas
│   └── ...
├── test/                      # Pruebas
├── Dockerfile
├── LICENSE
├── README.md
├── mkdocs.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 📋 Prerrequisitos

- **Node.js** 20.x o superior
- **npm** 10.x o superior
- **Docker** y **Docker Compose** (para servicios y despliegue)
- **Python** 3.12+ (para checklist-service y documentación MkDocs)
- **Git** para control de versiones

---

## 🔧 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/CDA-SYSTEM/api_gateway.git
cd api_gateway

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las URLs y credenciales de los servicios

# 4. Iniciar en modo desarrollo
npm run start:dev
```

---

## ⚙️ Configuración

El sistema se configura mediante variables de entorno en el archivo `.env`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del gateway | `3600` |
| `AUTH_SERVICE_BASE_URL` | URL del Auth Service | `http://localhost:3001` |
| `CLIENT_SERVICE_BASE_URL` | URL del Clients Service | `http://localhost:8080` |
| `VEHICLE_SERVICE_BASE_URL` | URL del Vehicles Service | `http://localhost:9000` |
| `RECEPTION_SERVICE_BASE_URL` | URL del Form Service | `http://localhost:7500` |
| `UPLOAD_FILES_SERVICE_BASE_URL` | URL del Storage Service | `http://localhost:7000` |
| `CHECKLIST_SERVICE_BASE_URL` | URL del Checklist Service | `http://localhost:8000` |
| `INTERNAL_API_KEY` | API key para comunicación interna | |

---

## 🚀 Uso

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run start

# Compilar TypeScript
npm run build

# Formatear código
npm run format

# Linter
npm run lint
```

---

## 🧪 Pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 📚 Documentación

La documentación completa del proyecto está disponible en:

| Idioma | URL |
|--------|-----|
| 🇪🇸 Español | https://cda-system.github.io/api_gateway/ |
| 🇬🇧 English | https://cda-system.github.io/api_gateway/en/ |

Para servir la documentación localmente:

```bash
python -m mkdocs serve
# Abrir en http://127.0.0.1:8000/api_gateway/
```

### Swagger UI por Servicio

| Servicio | Swagger |
|----------|---------|
| API Gateway | `http://localhost:3600/docs` |
| Form Service | `http://localhost:7500/docs` |
| Storage Service | `http://localhost:7000/docs` |
| Clients Service | `http://localhost:8080/swagger-ui.html` |

---

## 🐳 Despliegue

### Con Docker

```bash
# Construir imagen
docker build -t api-gateway .

# Ejecutar contenedor
docker run -p 3600:3600 --env-file .env api-gateway
```

### Con Docker Compose

```bash
docker-compose up -d
```

### CI/CD

El proyecto incluye pipelines de GitHub Actions para:
- **docs.yml**: Construye y despliega la documentación a GitHub Pages
- **deploy-docker.yml**: Construye y despliega la imagen Docker

---

## 🤝 Contribuir

Actualmente este es un proyecto académico privado. Para miembros del
equipo, ver [CONTRIBUTING.md](CONTRIBUTING.md).

Por favor, asegúrate de:
- Seguir el estilo de código existente
- Escribir pruebas para nuevas funcionalidades
- Mantener la documentación actualizada
- Ejecutar `npm run lint` antes de commitear

---

## 👥 Autores

| Nombre | Rol |
|--------|-----|
| **Andres Iles** | Desarrollador principal |
| **Emerson Iles** | Desarrollador de backend |
| **Audino Pantoja** | Desarrollador de backend |
| **Kevin Chanchi** | Desarrollador de frontend |
| **Oscar Chavez** | Desarrollador de infraestructura |

**UniPutuamyo — Mocoa, Putumayo, Colombia**

---

## 📄 Licencia

Copyright © 2026 Andres Iles, Emerson Iles, Audino Pantoja,
Kevin Chanchi, Oscar Chavez.

**Todos los derechos reservados.**

Este software y su documentación asociada están protegidos por las
leyes de propiedad intelectual de la República de Colombia. No está
permitido su uso, reproducción o distribución sin autorización
expresa de los titulares del copyright.

Ver el archivo [LICENSE](LICENSE) para los términos completos.

---

<p align="center">
  <sub>Proyecto académico — UniPutuamyo, Mocoa Putumayo</sub>
</p>
