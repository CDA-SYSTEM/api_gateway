# Guía de Contribución / Contributing Guide

## Español

Gracias por tu interés en contribuir al **CDA System — API Gateway**.
Actualmente este es un proyecto académico privado y las contribuciones
externas no están abiertas. Si eres miembro del equipo de desarrollo,
sigue las siguientes pautas:

### Proceso de desarrollo

1. Crea una rama desde `main` con el formato:
   - `feat/<nombre-de-la-caracteristica>`
   - `fix/<nombre-del-error>`
   - `docs/<descripcion>`
   - `refactor/<descripcion>`

2. Los mensajes de commit deben seguir el formato:
   `<tipo>(<alcance>): <descripción>`

   Tipos permitidos: `feat`, `fix`, `docs`, `style`, `refactor`,
   `perf`, `test`, `build`, `ci`, `chore`, `revert`

3. Antes de crear un PR, asegúrate de:
   - Ejecutar `npm run lint` sin errores
   - Ejecutar `npm run build` exitosamente
   - Ejecutar `npm run test` con todas las pruebas pasando

### Pull Requests

- Los PRs deben ser revisados por al menos otro miembro del equipo
- Mantén los PRs pequeños y enfocados en un solo cambio
- Incluye una descripción clara de los cambios y el motivo

---

## English

Thank you for your interest in contributing to **CDA System — API Gateway**.
This is currently a private academic project and external contributions
are not open. If you are a development team member, please follow
these guidelines:

### Development Process

1. Create a branch from `main` using the format:
   - `feat/<feature-name>`
   - `fix/<bug-name>`
   - `docs/<description>`
   - `refactor/<description>`

2. Commit messages must follow:
   `<type>(<scope>): <description>`

   Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`,
   `perf`, `test`, `build`, `ci`, `chore`, `revert`

3. Before creating a PR, ensure:
   - `npm run lint` passes
   - `npm run build` succeeds
   - `npm run test` passes all tests

### Pull Requests

- PRs must be reviewed by at least one other team member
- Keep PRs small and focused on a single change
- Include a clear description of changes and rationale
