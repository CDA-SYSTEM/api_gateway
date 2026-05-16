# Checklist Service

**Port:** `8000`  
**Tech:** Django 6.0.3 / Python 3.12  
**Database:** MongoDB  
**Framework:** Django REST Framework 3.17

## Purpose

Checklist (NTC 5375) inspection management. Handles inspection templates, inspection records, tread measurements, and checklist templates organized by vehicle type. Provides specialized endpoints for filtering inspections by plate, date, status, and vehicle.

## Key Endpoints

### Templates

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/templates` | List all templates |
| `POST` | `/templates` | Create template |
| `GET` | `/templates/motos` | Templates for motorcycles |
| `GET` | `/templates/livianos-pesados` | Templates for light/heavy vehicles |
| `GET` | `/templates/active/:vehicle_type` | Active template by type |
| `GET` | `/templates/:id` | Get template by ID |
| `PUT` | `/templates/:id` | Update template |
| `DELETE` | `/templates/:id` | Delete template |

### Inspections

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/inspections` | List inspections |
| `POST` | `/inspections` | Create inspection |
| `GET` | `/inspections/:id` | Get by ID |
| `PUT` | `/inspections/:id` | Update |
| `DELETE` | `/inspections/:id` | Delete |
| `GET` | `/inspections/by-plate/:plate` | Lookup by plate |
| `GET` | `/inspections/by-date` | Filter by date range |
| `GET` | `/inspections/by-status/:status` | Filter by status |
| `GET` | `/inspections/by-vehicle/:vehicle_id` | Filter by vehicle |

### Tread Measurement (Labrado)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/labrado` | List tread measurements |
| `POST` | `/labrado` | Create tread measurement |
| `GET` | `/labrado/by-inspection/:inspection_id` | Get by inspection |

## Architecture

Hexagonal (DDD bounded contexts) with three Django apps: `templates`, `inspections`, and `labrado`. Each app follows domain/application/infrastructure/adapters structure. Settings split across `base.py`, `dev.py`, and `prod.py`.
