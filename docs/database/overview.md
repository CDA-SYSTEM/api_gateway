# Arquitectura de Base de Datos

El sistema utiliza **múltiples tecnologías de bases de datos** elegidas según las necesidades específicas de cada servicio:

| Servicio | Base de Datos | Tecnología | Propósito |
|---------|-------------|------------|----------|
| Auth Service | PostgreSQL | TypeORM | Usuarios, roles, tokens |
| Clients Service | PostgreSQL | Spring Data JPA + Flyway | Clientes, tipos de persona, tipos de documento |
| Vehicles Service | PostgreSQL | Spring Data JPA + Flyway | Vehículos, marcas, líneas, colores, clases |
| Form Service | MongoDB | TypeORM | Formularios de inspección, catálogos |
| Storage Service | Apache Cassandra | cassandra-driver | Metadatos de archivos y almacenamiento binario |
| Checklist Service | MongoDB | MongoEngine | Plantillas de inspección, checklists, datos de banda de rodadura |

## PostgreSQL Databases

### Auth Database (`auth_db`)

```mermaid
erDiagram
    User {
        uuid id PK
        string email UK
        string password
        string name
        string role "ADMIN | MANAGER | OPERARIO | INSPECTOR"
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    RefreshToken {
        uuid id PK
        string token
        uuid userId FK
        datetime expiresAt
        boolean isRevoked
    }
    User ||--o{ RefreshToken : has
```

### Clients Database (`clients`)

```mermaid
erDiagram
    Client {
        uuid id PK
        string document
        string name
        string email
        string phone
        uuid documentTypeId FK
        uuid personTypeId FK
        boolean active
        datetime createdAt
        datetime updatedAt
    }
    DocumentType {
        uuid id PK
        string name
        string code
    }
    PersonType {
        uuid id PK
        string name
        string code
    }
    Client }o--|| DocumentType : has
    Client }o--|| PersonType : has
```

### Vehicles Database (`vehicles`)

```mermaid
erDiagram
    Vehicle {
        uuid id PK
        string placa UK
        int modelo
        uuid marcaId FK
        uuid lineaId FK
        uuid colorId FK
        uuid claseId FK
        uuid tipoVehiculoId FK
        uuid tipoServicioId FK
        uuid tipoCombustibleId FK
        uuid clienteId
        datetime createdAt
        datetime updatedAt
    }
    Marca { uuid id PK; string nombre }
    Linea { uuid id PK; string nombre; uuid marcaId FK }
    Color { uuid id PK; string nombre }
    Clase { uuid id PK; string nombre }
    TipoVehiculo { uuid id PK; string nombre }
    TipoServicio { uuid id PK; string nombre }
    TipoCombustible { uuid id PK; string nombre }

    Vehicle }o--|| Marca : belongs_to
    Vehicle }o--|| Linea : belongs_to
    Vehicle }o--|| Color : has
    Linea }o--|| Marca : belongs_to
```

## MongoDB Databases

### Form Database (`form_service`)

```mermaid
erDiagram
    Inspection {
        ObjectId id PK
        int mileage
        string clientId
        string vehicleId
        string vehicleType
        string fuelType
        string serviceType
        string operatorId
        string customerType
        string revisionType
        string tintedWindows
        string armoredVehicle
        string brakeFluidSightGlass
        string observations
        string signatureUrl
        string photoReceptionUrl
        string inspectionNumber
        string status
        datetime deletedAt
        datetime createdAt
        datetime updatedAt
    }
    Checklist {
        boolean isClean
        boolean hubcapsRemoved
        boolean alarmsOff
        boolean isUnloaded
        int publicServiceSeats
        boolean seatbeltsVisible
    }
    Axle {
        int index
        string axleType
    }
    Tire {
        string position
        string code
        float tirePressure
    }
    Inspection ||--o| Checklist : has
    Inspection ||--o{ Axle : has
    Inspection ||--o{ Tire : has
```

### Checklist Database

```mermaid
erDiagram
    InspectionTemplate {
        ObjectId id PK
        string name
        string vehicleType
        boolean isActive
        json fields
        datetime createdAt
    }
    InspectionRecord {
        ObjectId id PK
        string plate
        string vehicleId
        string status
        ObjectId templateId FK
        datetime date
    }
    TreadMeasurement {
        ObjectId id PK
        ObjectId inspectionId FK
        int position
        float depth
    }
```

## Apache Cassandra (Storage Service)

### Keyspace: `storage_system`

```sql
CREATE TABLE storage_system.files (
    id UUID PRIMARY KEY,
    filename TEXT,
    original_name TEXT,
    mime_type TEXT,
    size BIGINT,
    data BLOB,
    created_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_files_deleted_at ON storage_system.files (deleted_at);
```

La columna `data` almacena el binario del archivo como un BLOB. `deleted_at` habilita el borrado lógico: los archivos con `deleted_at` no nulo se consideran eliminados.

## Relaciones entre Entidades (Entre Servicios)

```mermaid
erDiagram
    AuthService_User ||--o{ FormService_Inspection : creates
    ClientsService_Client ||--o{ FormService_Inspection : owns
    VehiclesService_Vehicle ||--o{ FormService_Inspection : inspects
    StorageService_File ||--o{ FormService_Inspection : photo_receipt
    StorageService_File ||--o{ FormService_Inspection : signature
```

## Migraciones

| Servicio | Herramienta | Ubicación |
|---------|-------------|----------|
| Clients Service | Flyway | `src/main/resources/db/migration/` |
| Vehicles Service | Flyway | `src/main/resources/db/migration/` |
| Auth Service | TypeORM sync | Auto-sync (development) |
| Form Service | TypeORM sync | Auto-sync (development) |
| Storage Service | Manual CQL | `scripts/` and `db/` directories |
| Checklist Service | Django migrations | `apps/*/migrations/` |
