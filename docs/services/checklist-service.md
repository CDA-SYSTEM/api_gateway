# Checklist Service

**Puerto:** `8000`  
**Tecnología:** Django 6.0.3 / Python 3.12  
**Base de datos:** MongoDB  
**Framework:** Django REST Framework 3.17

## Propósito

Gestión de inspecciones de checklist (NTC 5375). Maneja plantillas de inspección, registros de inspección, mediciones de labrado y plantillas de checklist organizadas por tipo de vehículo. Proporciona endpoints especializados para filtrar inspecciones por placa, fecha, estado y vehículo.

## Endpoints Principales

### Plantillas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/templates` | Listar todas las plantillas |
| `POST` | `/templates` | Crear plantilla |
| `GET` | `/templates/motos` | Plantillas para motocicletas |
| `GET` | `/templates/livianos-pesados` | Plantillas para vehículos livianos/pesados |
| `GET` | `/templates/active/:vehicle_type` | Plantilla activa por tipo |
| `GET` | `/templates/:id` | Obtener plantilla por ID |
| `PUT` | `/templates/:id` | Actualizar plantilla |
| `DELETE` | `/templates/:id` | Eliminar plantilla |

### Inspecciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/inspections` | Listar inspecciones |
| `POST` | `/inspections` | Crear inspección |
| `GET` | `/inspections/:id` | Obtener por ID |
| `PUT` | `/inspections/:id` | Actualizar |
| `DELETE` | `/inspections/:id` | Eliminar |
| `GET` | `/inspections/by-plate/:plate` | Buscar por placa |
| `GET` | `/inspections/by-date` | Filtrar por rango de fechas |
| `GET` | `/inspections/by-status/:status` | Filtrar por estado |
| `GET` | `/inspections/by-vehicle/:vehicle_id` | Filtrar por vehículo |

### Medición de Labrado

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/labrado` | Listar mediciones de labrado |
| `POST` | `/labrado` | Crear medición de labrado |
| `GET` | `/labrado/by-inspection/:inspection_id` | Obtener por inspección |

## Arquitectura

Hexagonal (contextos delimitados DDD) con tres aplicaciones Django: `templates`, `inspections` y `labrado`. Cada aplicación sigue la estructura dominio/aplicación/infraestructura/adaptadores. Configuraciones divididas entre `base.py`, `dev.py` y `prod.py`.
