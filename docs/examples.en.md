# Examples with cURL, Python and JavaScript

## Headers (used by all)

- `x-api-key: your-frontend-api-key`
- `Authorization: Bearer <token>`
- Base URL: `http://localhost:3600`

---

## 1. Authentication

### Login

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/auth/login \
      -H 'Content-Type: application/json' \
      -H 'x-api-key: your-frontend-api-key' \
      -d '{"email": "admin@cda.com", "password": "secret123"}'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/auth/login"
    headers = {"Content-Type": "application/json", "x-api-key": "your-frontend-api-key"}
    data = {"email": "admin@cda.com", "password": "secret123"}
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'x-api-key': 'your-frontend-api-key'},
      body: JSON.stringify({email: 'admin@cda.com', password: 'secret123'})
    })
    .then(r => r.json())
    .then(console.log);
    ```

### Validate Token

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/auth/validate-token \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/auth/validate-token"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.post(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/auth/validate-token', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    })
    .then(r => r.json())
    .then(console.log);
    ```

---

## 2. Inspections

### Create Inspection (with files)

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/inspections \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -F 'data={"mileage":1200,"client_id":"1","vehicle_id":"1","vehicle_type":"LIVIANO","fuel_type":"GASOLINA","service_type":"PARTICULAR","operator_id":"1","customer_type":"PROPIETARIO","revision_type":"TECNICO_MECANICA","tinted_windows":"NO","armored_vehicle":"NO","brake_fluid_sight_glass":"BUEN_ESTADO","checklist":{"is_clean":true},"axles":[{"index":1,"axle_type":"DELANTERO"}],"tires":[{"position":"FRONT_LEFT","code":"TIR-001","tire_pressure":32}]}' \
      -F 'photo=@/path/to/photo.jpg' \
      -F 'signature=@/path/to/signature.png'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    data = {"data": '{"mileage":1200,"client_id":"1","vehicle_id":"1","vehicle_type":"LIVIANO","fuel_type":"GASOLINA","service_type":"PARTICULAR","operator_id":"1","customer_type":"PROPIETARIO","revision_type":"TECNICO_MECANICA","tinted_windows":"NO","armored_vehicle":"NO","brake_fluid_sight_glass":"BUEN_ESTADO","checklist":{"is_clean":true},"axles":[{"index":1,"axle_type":"DELANTERO"}],"tires":[{"position":"FRONT_LEFT","code":"TIR-001","tire_pressure":32}]}'}
    files = {"photo": ("photo.jpg", open("/path/to/photo.jpg", "rb")), "signature": ("signature.png", open("/path/to/signature.png", "rb"))}
    response = requests.post(url, data=data, files=files, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    const form = new FormData();
    form.append('data', JSON.stringify({mileage:1200,client_id:'1',vehicle_id:'1',vehicle_type:'LIVIANO',fuel_type:'GASOLINA',service_type:'PARTICULAR',operator_id:'1',customer_type:'PROPIETARIO',revision_type:'TECNICO_MECANICA',tinted_windows:'NO',armored_vehicle:'NO',brake_fluid_sight_glass:'BUEN_ESTADO',checklist:{is_clean:true},axles:[{index:1,axle_type:'DELANTERO'}],tires:[{position:'FRONT_LEFT',code:'TIR-001',tire_pressure:32}]}));
    fetch('http://localhost:3600/api/v1/inspections', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'},
      body: form
    }).then(r => r.json()).then(console.log);
    ```

### Update Inspection (partial)

=== "cURL"

    ```bash
    curl -s -X PATCH http://localhost:3600/api/v1/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -F 'data={"mileage":1500,"observations":"Updated"}' \
      -F 'photo=@/path/to/new-photo.jpg'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    data = {"data": '{"mileage":1500,"observations":"Updated"}'}
    files = {"photo": ("photo.jpg", open("/path/to/new-photo.jpg", "rb"))}
    response = requests.patch(url, data=data, files=files, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    const form = new FormData();
    form.append('data', JSON.stringify({mileage:1500,observations:'Updated'}));
    fetch('http://localhost:3600/api/v1/inspections/<id>', {
      method: 'PATCH',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'},
      body: form
    }).then(r => r.json()).then(console.log);
    ```

### List Inspections

=== "cURL"

    ```bash
    curl -s 'http://localhost:3600/api/v1/inspections?page=1&size=10&vehicle_id=ABC123' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections"
    params = {"page": 1, "size": 10, "vehicle_id": "ABC123"}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/inspections?page=1&size=10&vehicle_id=ABC123', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Get Inspection by ID

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/inspections/<id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Delete Inspection (Admin)

=== "cURL"

    ```bash
    curl -s -X DELETE http://localhost:3600/api/v1/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.delete(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/inspections/<id>', {
      method: 'DELETE',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 3. Files

### Upload File

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/storage/upload \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -F 'file=@/path/to/document.pdf'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/storage/upload"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    files = {"file": ("document.pdf", open("/path/to/document.pdf", "rb"))}
    response = requests.post(url, files=files, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    const form = new FormData();
    form.append('file', fileInput.files[0]);
    fetch('http://localhost:3600/api/v1/storage/upload', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'},
      body: form
    }).then(r => r.json()).then(console.log);
    ```

### Download File (Public)

=== "cURL"

    ```bash
    curl -s -O http://localhost:3600/api/v1/storage/files/<uuid>
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/storage/files/<uuid>"
    response = requests.get(url)
    with open("downloaded_file", "wb") as f:
        f.write(response.content)
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/storage/files/<uuid>')
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'file';
      a.click();
    });
    ```

### List Files

=== "cURL"

    ```bash
    curl -s 'http://localhost:3600/api/v1/storage/files?limit=20' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/storage/files"
    params = {"limit": 20}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/storage/files?limit=20', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 4. Catalogs (Read-only)

### List Vehicle Types

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/vehicle-types \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/vehicle-types"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/vehicle-types', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### List Fuel Types

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/fuel-types \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/fuel-types"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/fuel-types', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 5. Unified Catalogs (CRUD)

### Create Catalog Item

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/catalogs/marcas \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"nombre": "Toyota"}'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/marcas"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"nombre": "Toyota"}
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/marcas', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({nombre: 'Toyota'})
    }).then(r => r.json()).then(console.log);
    ```

### List Catalog Items

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/marcas \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/marcas"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/marcas', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Get Catalog Item by ID

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/marcas/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/marcas/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/marcas/<id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Update Catalog Item

=== "cURL"

    ```bash
    curl -s -X PUT http://localhost:3600/api/v1/catalogs/marcas/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"nombre": "Mazda"}'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/marcas/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"nombre": "Mazda"}
    response = requests.put(url, json=data, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/marcas/<id>', {
      method: 'PUT',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({nombre: 'Mazda'})
    }).then(r => r.json()).then(console.log);
    ```

### Delete Catalog Item

=== "cURL"

    ```bash
    curl -s -X DELETE http://localhost:3600/api/v1/catalogs/marcas/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/marcas/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.delete(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/marcas/<id>', {
      method: 'DELETE',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 6. Vehicles

### Create Vehicle

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/vehiculo \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"placa":"ABC123","marca_id":1,"linea_id":1,"modelo":2024,"cliente_id":"1"}'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/vehiculo"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"placa": "ABC123", "marca_id": 1, "linea_id": 1, "modelo": 2024, "cliente_id": "1"}
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/vehiculo', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({placa:'ABC123',marca_id:1,linea_id:1,modelo:2024,cliente_id:'1'})
    }).then(r => r.json()).then(console.log);
    ```

### List Vehicles

=== "cURL"

    ```bash
    curl -s 'http://localhost:3600/api/v1/vehiculo?page=1&size=10' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/vehiculo"
    params = {"page": 1, "size": 10}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/vehiculo?page=1&size=10', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### List Vehicles by Client

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/vehiculo/cliente/<client_id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/vehiculo/cliente/<client_id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/vehiculo/cliente/<client_id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 7. Clients

### Create Client

=== "cURL"

    ```bash
    curl -s -X POST http://localhost:3600/api/v1/clients \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Juan","apellido":"Pérez","email":"juan@example.com","telefono":"3001234567"}'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/clients"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"nombre": "Juan", "apellido": "Pérez", "email": "juan@example.com", "telefono": "3001234567"}
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/clients', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({nombre:'Juan',apellido:'Pérez',email:'juan@example.com',telefono:'3001234567'})
    }).then(r => r.json()).then(console.log);
    ```

### List Clients

=== "cURL"

    ```bash
    curl -s 'http://localhost:3600/api/v1/clients?page=1&size=10' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/clients"
    params = {"page": 1, "size": 10}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/clients?page=1&size=10', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

---

## 8. Health Check

=== "cURL"

    ```bash
    curl -s http://localhost:3600/api/v1/health
    ```

=== "Python"

    ```python
    import requests

    url = "http://localhost:3600/api/v1/health"
    response = requests.get(url)
    print(response.json())
    ```

=== "JavaScript"

    ```javascript
    fetch('http://localhost:3600/api/v1/health')
    .then(r => r.json())
    .then(console.log);
    ```

---

## 9. Response Format

All endpoints return JSON responses with the following structure:

**Success:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error description"
  }
}
```

**Paginated list:**

```json
{
  "success": true,
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "size": 10
}
```
