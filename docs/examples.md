# Ejemplos con cURL, Python y JavaScript

Encabezados comunes usados por todas las peticiones:

- `x-api-key: your-frontend-api-key` — API key del frontend
- `Authorization: Bearer <token>` — Token JWT (excepto login y descargas públicas)
- Base URL: `http://localhost:3600`

## Autenticación

### Iniciar sesión

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

### Validar token

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

## Inspecciones

### Crear inspección (con archivos)

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
    // En un navegador:
    // form.append('photo', fileInput.files[0]);
    // form.append('signature', fileInput.files[1]);
    fetch('http://localhost:3600/api/v1/inspections', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'},
      body: form
    }).then(r => r.json()).then(console.log);
    ```

### Actualizar inspección (parcial)

=== "cURL"
    ```bash
    curl -s -X PATCH http://localhost:3600/api/v1/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -F 'data={"mileage":1500,"observations":"Actualizado"}' \
      -F 'photo=@/path/to/new-photo.jpg'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    data = {"data": '{"mileage":1500,"observations":"Actualizado"}'}
    files = {"photo": ("photo.jpg", open("/path/to/new-photo.jpg", "rb"))}
    response = requests.patch(url, data=data, files=files, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    const form = new FormData();
    form.append('data', JSON.stringify({mileage:1500,observations:'Actualizado'}));
    fetch('http://localhost:3600/api/v1/inspections/<id>', {
      method: 'PATCH',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'},
      body: form
    }).then(r => r.json()).then(console.log);
    ```

### Actualizar checklistId de inspección

=== "cURL"
    ```bash
    curl -s -X PATCH http://localhost:3600/api/v1/inspections/<id>/checklist-id \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"checklistId": "6651a8e2f1b2c3d4e5f6a7b8"}'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/inspections/<id>/checklist-id"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"checklistId": "6651a8e2f1b2c3d4e5f6a7b8"}
    response = requests.patch(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/inspections/<id>/checklist-id', {
      method: 'PATCH',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({checklistId: '6651a8e2f1b2c3d4e5f6a7b8'})
    }).then(r => r.json()).then(console.log);
    ```

!!! tip "Nota"
    Este endpoint es utilizado internamente por el gateway para asociar el checklist creado automáticamente con la inspección de recepción. También puede usarse manualmente si se necesita vincular una inspección de checklist existente.

### Listar inspecciones

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

### Obtener inspección por ID

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

### Eliminar inspección (Admin)

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

## Archivos

### Subir archivo

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

### Descargar archivo (público)

=== "cURL"
    ```bash
    curl -s -O http://localhost:3600/api/v1/storage/files/<uuid>
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/storage/files/<uuid>"
    response = requests.get(url)
    with open("archivo_descargado", "wb") as f:
        f.write(response.content)
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/storage/files/<uuid>')
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'archivo';
      a.click();
    });
    ```

### Listar archivos

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

## Catálogos (solo lectura)

### Listar tipos de vehículo

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

### Listar tipos de combustible

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

## Catálogos unificados (CRUD)

### Crear elemento de catálogo

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

### Listar elementos de catálogo

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/lineas \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/lineas"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/lineas', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Obtener elemento de catálogo por ID

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/catalogs/colores/1 \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/colores/1"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/colores/1', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Actualizar elemento de catálogo

=== "cURL"
    ```bash
    curl -s -X PUT http://localhost:3600/api/v1/catalogs/tipos-vehiculo/1 \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"nombre": "CAMIONETA"}'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/tipos-vehiculo/1"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"nombre": "CAMIONETA"}
    response = requests.put(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/tipos-vehiculo/1', {
      method: 'PUT',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({nombre: 'CAMIONETA'})
    }).then(r => r.json()).then(console.log);
    ```

### Eliminar elemento de catálogo

=== "cURL"
    ```bash
    curl -s -X DELETE http://localhost:3600/api/v1/catalogs/tipos-combustible/1 \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/catalogs/tipos-combustible/1"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.delete(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/catalogs/tipos-combustible/1', {
      method: 'DELETE',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

## Vehículos

### Crear vehículo

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

### Listar vehículos

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

### Listar vehículos por cliente

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/vehiculo/cliente/1 \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/vehiculo/cliente/1"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/vehiculo/cliente/1', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

## Clientes

### Crear cliente

=== "cURL"
    ```bash
    curl -s -X POST http://localhost:3600/api/v1/clients \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Juan Pérez","documento":"12345678","tipo_documento_id":1,"tipo_persona_id":1}'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/clients"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"nombre": "Juan Pérez", "documento": "12345678", "tipo_documento_id": 1, "tipo_persona_id": 1}
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/clients', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({nombre:'Juan Pérez',documento:'12345678',tipo_documento_id:1,tipo_persona_id:1})
    }).then(r => r.json()).then(console.log);
    ```

### Health Check

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/health \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/health"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/health', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

## Checklist — Plantillas

### Crear plantilla

=== "cURL"
    ```bash
    curl -s -X POST http://localhost:3600/api/v1/checklist/templates \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{
        "code": "MOTOS",
        "name": "Inspección Motos",
        "supported_vehicle_types": ["MOTO"],
        "sections": [
          {
            "title": "Sistema Eléctrico",
            "order": 1,
            "subsections": [
              {
                "title": "Batería",
                "order": 1,
                "items": [
                  {
                    "code": "BAT-001",
                    "description": "La batería está en buen estado",
                    "defect_type": "A",
                    "order": 1
                  }
                ]
              }
            ]
          }
        ]
      }'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/templates"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {
        "code": "MOTOS",
        "name": "Inspección Motos",
        "supported_vehicle_types": ["MOTO"],
        "sections": [{
            "title": "Sistema Eléctrico",
            "order": 1,
            "subsections": [{
                "title": "Batería",
                "order": 1,
                "items": [{
                    "code": "BAT-001",
                    "description": "La batería está en buen estado",
                    "defect_type": "A",
                    "order": 1
                }]
            }]
        }]
    }
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/templates', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        code: 'MOTOS',
        name: 'Inspección Motos',
        supported_vehicle_types: ['MOTO'],
        sections: [{title: 'Sistema Eléctrico', order: 1, subsections: [{title: 'Batería', order: 1, items: [{code: 'BAT-001', description: 'La batería está en buen estado', defect_type: 'A', order: 1}]}]}]
      })
    }).then(r => r.json()).then(console.log);
    ```

### Listar plantillas

=== "cURL"
    ```bash
    curl -s 'http://localhost:3600/api/v1/checklist/templates?vehicle_type=MOTO' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/templates"
    params = {"vehicle_type": "MOTO"}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/templates?vehicle_type=MOTO', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Obtener plantilla por ID

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/checklist/templates/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/templates/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/templates/<id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Obtener plantilla activa por tipo de vehículo

=== "cURL"
    ```bash
    # Motos, Livianos o Pesados
    curl -s http://localhost:3600/api/v1/checklist/templates/active/MOTO \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/templates/active/MOTO"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/templates/active/MOTO', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Eliminar plantilla

=== "cURL"
    ```bash
    curl -s -X DELETE http://localhost:3600/api/v1/checklist/templates/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/templates/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.delete(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/templates/<id>', {
      method: 'DELETE',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

## Checklist — Inspecciones

### Crear inspección (borrador)

=== "cURL"
    ```bash
    curl -s -X POST http://localhost:3600/api/v1/checklist/inspections \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{
        "plate": "ABC123",
        "vehicle_id": 1,
        "client_id": 1,
        "vehicle_type": "LIVIANO",
        "inspector_id": "02524568-5b17-4218-94c5-3fc09d5b6268",
        "responses": [
          {
            "section_code": "SEC-001",
            "subsection_code": "SUB-001",
            "item_code": "BAT-001",
            "response": "OK",
            "observation": ""
          }
        ]
      }'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {
        "plate": "ABC123",
        "vehicle_id": 1,
        "client_id": 1,
        "vehicle_type": "LIVIANO",
        "inspector_id": "02524568-5b17-4218-94c5-3fc09d5b6268",
        "responses": [{"section_code": "SEC-001", "subsection_code": "SUB-001", "item_code": "BAT-001", "response": "OK", "observation": ""}]
    }
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        plate: 'ABC123',
        vehicle_id: 1,
        client_id: 1,
        vehicle_type: 'LIVIANO',
        inspector_id: '02524568-5b17-4218-94c5-3fc09d5b6268',
        responses: [{section_code: 'SEC-001', subsection_code: 'SUB-001', item_code: 'BAT-001', response: 'OK', observation: ''}]
      })
    }).then(r => r.json()).then(console.log);
    ```

### Listar inspecciones

=== "cURL"
    ```bash
    curl -s 'http://localhost:3600/api/v1/checklist/inspections' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Obtener inspección por ID

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/checklist/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/<id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Buscar inspecciones por placa

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/checklist/inspections/by-plate/ABC123 \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/by-plate/ABC123"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/by-plate/ABC123', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Buscar inspecciones por rango de fechas

=== "cURL"
    ```bash
    curl -s 'http://localhost:3600/api/v1/checklist/inspections/by-date?start=2026-01-01&end=2026-12-31' \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/by-date"
    params = {"start": "2026-01-01", "end": "2026-12-31"}
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, params=params, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/by-date?start=2026-01-01&end=2026-12-31', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Buscar inspecciones por estado

=== "cURL"
    ```bash
    # Estados: draft, in_progress, completed, cancelled
    curl -s http://localhost:3600/api/v1/checklist/inspections/by-status/draft \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/by-status/draft"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/by-status/draft', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Marcar inspección en progreso

=== "cURL"
    ```bash
    curl -s -X PATCH http://localhost:3600/api/v1/checklist/inspections/<id>/in-progress \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"responses": [{"section_code":"SEC-001","subsection_code":"SUB-001","item_code":"BAT-001","response":"OK"}]}'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/<id>/in-progress"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"responses": [{"section_code": "SEC-001", "subsection_code": "SUB-001", "item_code": "BAT-001", "response": "OK"}]}
    response = requests.patch(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/<id>/in-progress', {
      method: 'PATCH',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({responses: [{section_code: 'SEC-001', subsection_code: 'SUB-001', item_code: 'BAT-001', response: 'OK'}]})
    }).then(r => r.json()).then(console.log);
    ```

### Cerrar inspección

=== "cURL"
    ```bash
    curl -s -X PATCH http://localhost:3600/api/v1/checklist/inspections/<id>/close \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{"general_result": "APROBADO"}'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/<id>/close"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {"general_result": "APROBADO"}
    response = requests.patch(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/<id>/close', {
      method: 'PATCH',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({general_result: 'APROBADO'})
    }).then(r => r.json()).then(console.log);
    ```

### Eliminar inspección

=== "cURL"
    ```bash
    curl -s -X DELETE http://localhost:3600/api/v1/checklist/inspections/<id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/inspections/<id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.delete(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/inspections/<id>', {
      method: 'DELETE',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

## Checklist — Labrado

### Crear medidas de labrado

=== "cURL"
    ```bash
    curl -s -X POST http://localhost:3600/api/v1/checklist/labrado \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{
        "inspection_id": "<inspection_id>",
        "axles": [
          {
            "axle_code": "DEL-001",
            "wheels": [
              {
                "wheel_code": "WHEEL-LF",
                "tires": [
                  {
                    "tire_code": "TIR-001",
                    "outer_mm": 6.5,
                    "middle_mm": 6.2,
                    "inner_mm": 6.0
                  }
                ]
              }
            ]
          }
        ]
      }'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/labrado"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {
        "inspection_id": "<inspection_id>",
        "axles": [{
            "axle_code": "DEL-001",
            "wheels": [{
                "wheel_code": "WHEEL-LF",
                "tires": [{
                    "tire_code": "TIR-001",
                    "outer_mm": 6.5,
                    "middle_mm": 6.2,
                    "inner_mm": 6.0
                }]
            }]
        }]
    }
    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/labrado', {
      method: 'POST',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        inspection_id: '<inspection_id>',
        axles: [{axle_code: 'DEL-001', wheels: [{wheel_code: 'WHEEL-LF', tires: [{tire_code: 'TIR-001', outer_mm: 6.5, middle_mm: 6.2, inner_mm: 6.0}]}]}]
      })
    }).then(r => r.json()).then(console.log);
    ```

### Obtener medidas de labrado por inspección

=== "cURL"
    ```bash
    curl -s http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>"}
    response = requests.get(url, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id>', {
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>'}
    }).then(r => r.json()).then(console.log);
    ```

### Actualizar medidas de labrado por inspección

=== "cURL"
    ```bash
    curl -s -X PUT http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id> \
      -H 'x-api-key: your-frontend-api-key' \
      -H 'Authorization: Bearer <token>' \
      -H 'Content-Type: application/json' \
      -d '{
        "axles": [
          {
            "axle_code": "DEL-001",
            "wheels": [
              {
                "wheel_code": "WHEEL-LF",
                "tires": [
                  {
                    "tire_code": "TIR-001",
                    "outer_mm": 7.0,
                    "middle_mm": 6.8,
                    "inner_mm": 6.5
                  }
                ]
              }
            ]
          }
        ]
      }'
    ```
=== "Python"
    ```python
    import requests

    url = "http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id>"
    headers = {"x-api-key": "your-frontend-api-key", "Authorization": "Bearer <token>", "Content-Type": "application/json"}
    data = {
        "axles": [{
            "axle_code": "DEL-001",
            "wheels": [{
                "wheel_code": "WHEEL-LF",
                "tires": [{
                    "tire_code": "TIR-001",
                    "outer_mm": 7.0,
                    "middle_mm": 6.8,
                    "inner_mm": 6.5
                }]
            }]
        }]
    }
    response = requests.put(url, json=data, headers=headers)
    print(response.json())
    ```
=== "JavaScript"
    ```javascript
    fetch('http://localhost:3600/api/v1/checklist/labrado/by-inspection/<inspection_id>', {
      method: 'PUT',
      headers: {'x-api-key': 'your-frontend-api-key', 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        axles: [{axle_code: 'DEL-001', wheels: [{wheel_code: 'WHEEL-LF', tires: [{tire_code: 'TIR-001', outer_mm: 7.0, middle_mm: 6.8, inner_mm: 6.5}]}]}]
      })
    }).then(r => r.json()).then(console.log);
    ```

## Formato de respuesta

Todas las respuestas exitosas siguen esta estructura:

```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-05-10T21:12:09.144Z",
  "path": "/api/v1/inspections"
}
```

Respuestas de error:

```json
{
  "statusCode": 400,
  "message": "Validation error details",
  "error": "Bad Request",
  "timestamp": "2026-05-10T21:12:10.504Z",
  "path": "/api/v1/inspections"
}
```

!!! tip "Reemplazar placeholders"
    Reemplace `localhost:3600`, `<token>`, `<id>`, `<uuid>`, `your-frontend-api-key` y las rutas de archivo con sus valores reales.
