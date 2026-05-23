<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h1 align="center">CDA System — API Gateway</h1>

<p align="center">
  Sistema de inspección vehicular con arquitectura de microservicios.
  <br />
  Punto de entrada único para autenticación, formularios, checklist NTC 5375,
  almacenamiento de archivos y gestión de clientes/vehículos.
</p>

<p align="center">
  <a href="https://cda-system.github.io/api_gateway/" target="_blank">
    <img src="https://img.shields.io/badge/Documentación-📖-teal?style=for-the-badge" alt="Documentación" />
  </a>
  <a href="https://cda-system.github.io/api_gateway/en/" target="_blank">
    <img src="https://img.shields.io/badge/Docs-📖-teal?style=for-the-badge" alt="Docs EN" />
  </a>
  <a href="https://github.com/CDA-SYSTEM/api_gateway">
    <img src="https://img.shields.io/badge/Repositorio-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
</p>

---

## Arquitectura

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

## Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| API Gateway | NestJS 11 / TypeScript |
| Auth Service | NestJS 11 / PostgreSQL + Redis |
| Clients Service | Spring Boot 4 / Java 17 / PostgreSQL |
| Vehicles Service | Spring Boot 4 / Java 17 / PostgreSQL |
| Form Service | NestJS 11 / MongoDB |
| Storage Service | NestJS 11 / Apache Cassandra |
| Checklist Service | Django 6.0.3 / Python 3.12 / MongoDB |
| Documentación | MkDocs con tema Material |

## Prerrequisitos

- Node.js 20+
- npm 10+
- Docker y Docker Compose
- Python 3.12+ (solo para checklist-service y documentación)

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/CDA-SYSTEM/api_gateway.git
cd api_gateway

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las URLs de los servicios

# Iniciar en modo desarrollo
npm run start:dev
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Iniciar en producción |
| `npm run start:dev` | Iniciar en modo desarrollo con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm run lint` | Ejecutar ESLint |
| `npm run format` | Formatear con Prettier |
| `npm run test` | Ejecutar pruebas unitarias |
| `npm run test:e2e` | Ejecutar pruebas e2e |
| `npm run docs:serve` | Servir documentación localmente |

## Documentación

La documentación completa está disponible en:

- **Español:** https://cda-system.github.io/api_gateway/
- **English:** https://cda-system.github.io/api_gateway/en/

Para servir la documentación localmente:

```bash
python -m mkdocs serve
```

## Autores

- **Andres Iles**
- **Emerson Iles**
- **Audino Pantoja**
- **Kevin Chanchi**
- **Oscar Chavez**

**UniPutuamyo — Mocoa, Putumayo**

## Licencia

Todos los derechos reservados. Ver el archivo [LICENSE](LICENSE) para más información.

Copyright © 2026 Andres Iles, Emerson Iles, Audino Pantoja, Kevin Chanchi, Oscar Chavez
