# Cómo Funciona

Esta página explica los flujos clave a través del sistema.

## 1. Flujo de Creación de Inspección

El flujo más complejo del sistema — crear una inspección de vehículo con carga de archivos.

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Storage as Storage Service
    participant Form as Form Service
    participant Auth as Auth Service
    participant Clients as Clients Service
    participant Vehicles as Vehicles Service

    Client->>Gateway: POST /api/v1/inspections (multipart: data + signature + photo)
    Gateway->>Gateway: Validate Bearer Token (CombinedGuard)
    Gateway->>Gateway: Parse data JSON → CreateInspectionDto
    par Upload Files
        Gateway->>Storage: POST /storage/upload (signature)
        Storage-->>Gateway: { file: { id: "uuid" } }
        Gateway->>Storage: POST /storage/upload (photo)
        Storage-->>Gateway: { file: { id: "uuid" } }
    end
    Gateway->>Gateway: Build payload with file URLs
    Gateway->>Form: POST /api/inspections
    Form->>Clients: RabbitMQ RPC: validate client exists
    Form->>Vehicles: RabbitMQ RPC: validate vehicle exists
    Form->>Form: Apply business rules per vehicle type
    Form-->>Gateway: 201 Created
    Gateway-->>Client: Standardized response
```

### Detalles Clave

1. **Carga de archivos primero** — Los archivos se cargan al servicio de almacenamiento en paralelo (`forkJoin`) antes de enviar el payload de la inspección
2. **Construcción de URLs** — Las URLs de los archivos se construyen como `{API_GATEWAY_BASE_URL}/api/v1/storage/files/{id}`
3. **Filtrado de payload** — Solo los campos del DTO permitidos se incluyen en el payload (previene rechazos por `forbidNonWhitelisted`)
4. **Mapeo de operador** — `operator_id` se mapea tanto a `responsible_id` como a `customer_id`
5. **Validación de negocio** — Form-service valida la cantidad de neumáticos y la integridad del checklist según el tipo de vehículo
6. **Auto-factura** — Al crear la inspección se dispara `autoCreateInvoice` (fire-and-forget) que resuelve `vehicle_type` desde vehicle-service si el DTO no lo incluye, obtiene el cliente, el precio y el estado PENDING, y crea la factura
7. **Checklist al pagar** — Cuando se actualiza una factura a PAID, el `InvoicePaidHandler` obtiene vehículo + template, crea el checklist en checklist-service y asigna `checklistId` a la inspección

## 2. Flujo de Actualización de Inspección

Igual que la creación pero todos los campos son opcionales — solo los campos proporcionados se incluyen en el payload.

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Storage
    participant Form

    Client->>Gateway: PATCH /api/v1/inspections/{id} (multipart)
    Gateway->>Gateway: Parse partial data JSON
    opt New signature file provided
        Gateway->>Storage: Upload signature
    end
    opt New photo file provided
        Gateway->>Storage: Upload photo
    end
    Gateway->>Gateway: Build partial payload (defined fields only)
    Gateway->>Form: PATCH /api/inspections/{id}
    Form-->>Gateway: 200 OK
    Gateway-->>Client: Standardized response
```

## 3. Listado de Inspecciones con Enriquecimiento

Al listar inspecciones, el gateway enriquece cada elemento con datos del cliente, vehículo y operador desde los servicios respectivos.

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Form
    participant Clients
    participant Vehicles
    participant Auth

    Client->>Gateway: GET /api/v1/inspections
    Gateway->>Form: GET /api/inspections
    Form-->>Gateway: Inspection list
    Gateway->>Gateway: Extract unique client/vehicle/operator IDs
    par Enrichment
        Gateway->>Clients: GET /clients/{id} (xN)
        Gateway->>Vehicles: GET /vehiculo/{id} (xN)
        Gateway->>Auth: GET /auth/users/{id} (xN)
    end
    Gateway->>Gateway: Merge data into each item
    Gateway-->>Client: Enriched response
```

## 4. Flujo de Descarga de Archivos

Las descargas de archivos son **públicas** (no requieren autenticación) para que las fotos y firmas de las inspecciones puedan accederse a través de sus URLs.

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Storage

    Client->>Gateway: GET /api/v1/storage/files/{id}
    Gateway->>Gateway: @Public() → skip auth
    Gateway->>Storage: GET /storage/files/{id}
    Storage-->>Gateway: Binary stream + headers
    Gateway-->>Client: Raw binary (Content-Type + Content-Disposition)
```

## 5. CRUD de Catálogo Unificado

El endpoint de catálogos unificados proporciona una interfaz CRUD consistente para todos los tipos de catálogo de vehículos.

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Vehicles

    Client->>Gateway: POST /api/v1/catalogs/marcas { nombre: "Toyota" }
    Gateway->>Gateway: Validate type "marcas" → maps to "marca"
    Gateway->>Vehicles: POST /marca { nombre: "Toyota" }
    Vehicles-->>Gateway: 201 Created
    Gateway-->>Client: Standardized response
```

La validación de tipo rechaza tipos de catálogo inválidos con un mensaje de error descriptivo que lista las opciones válidas.

## 6. Flujo de Autenticación

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Auth

    Client->>Gateway: POST /api/v1/auth/login { email, password }
    Gateway->>Auth: POST /api/auth/login
    Auth-->>Gateway: { access_token, refresh_token, user }
    Gateway-->>Client: Token pair + user data

    Note over Client,Gateway: Subsequent requests
    Client->>Gateway: GET /api/v1/inspections (Authorization: Bearer <token>)
    Gateway->>Gateway: CombinedGuard validates token
    Gateway->>Auth: POST /api/auth/validate-token
    Auth-->>Gateway: { userId, roles }
    Gateway->>Gateway: Check @Roles() if present
    Gateway->>Form: Proxied request
```

## 7. Flujo de Auto-Factura al Crear Inspección

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Form as Form Service
    participant Clients as Clients Service
    participant Vehicles as Vehicles Service
    participant FormInvoice as Form Service (Invoice)

    Client->>Gateway: POST /api/v1/inspections (multipart)
    Gateway->>Gateway: Upload files, build payload
    Gateway->>Form: POST /api/inspections
    Form-->>Gateway: 201 Created (inspection with statusId=PENDING)
    par Fire-and-forget: Auto-create invoice
        Gateway->>Vehicles: GET /vehiculo/{id} (resolve vehicle_type if missing)
        Gateway->>Clients: GET /clients/{id}
        Gateway->>FormInvoice: POST /api/invoices (PENDING)
    end
    Gateway-->>Client: Standardized response
```

**Fire-and-forget:** La creación de factura no bloquea la respuesta al cliente. Si falla (ej. falta precio), se loguea el error pero la inspección se crea igual.

## 8. Flujo PAID → Checklist Automático

```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant Form as Form Service
    participant Vehicles as Vehicles Service
    participant Checklist as Checklist Service

    Client->>Gateway: PATCH /api/v1/invoices/{id} { statusId: PAID }
    Gateway->>Form: PATCH /api/invoices/{id} (update status)
    Gateway->>Form: GET /api/statuses?code=PAID (resolve PAID id)
    alt statusId matches PAID
        par Fire-and-forget: InvoicePaidHandler
            Gateway->>Form: GET /api/invoices/{id}
            Gateway->>Form: GET /api/inspections/{inspection_id}
            Gateway->>Vehicles: GET /vehiculo/{vehicle_id}
            Gateway->>Checklist: GET /templates/livianos-pesados (or /templates/motos)
            Gateway->>Checklist: POST /inspections (create checklist)
            Gateway->>Form: PATCH /api/inspections/{id}/checklist-id
        end
    end
    Gateway-->>Client: Updated invoice
```

**InvoicePaidHandler:** Obtiene la factura → inspección → vehículo → template activa, crea el checklist en checklist-service y asigna el `checklistId` en la inspección de recepción. Todo es fire-and-forget, no bloquea la respuesta.

## 9. Eventos Socket.IO

```mermaid
sequenceDiagram
    participant Frontend
    participant Gateway
    participant Form as Form Service (Socket)

    Gateway->>Form: Connect to /events namespace

    alt Invoice created
        Form-->>Gateway: invoice.created { invoice }
        Gateway-->>Frontend: invoice.created { invoice }
    end

    alt Inspection status updated
        Form-->>Gateway: inspection.status.updated { inspection, statusName }
        Gateway-->>Frontend: inspection.status.updated { inspection, statusName }
    end
```

El gateway se conecta al namespace `/events` del form-service y reenvía los eventos al frontend conectado.

## Aspectos Transversales

### Inyección de API Key
Cada solicitud saliente del gateway hacia un microservicio incluye automáticamente el encabezado `x-api-key` a través de un interceptor Axios. Cada microservicio valida esta clave antes de procesar.

### Manejo de Errores
- **Errores de conexión** → `502 Bad Gateway` con nombre del servicio
- **Errores de validación** → `400 Bad Request` con detalles
- **Errores de autenticación** → `401 Unauthorized` o `403 Forbidden`
- **No encontrado** → `404 Not Found`
