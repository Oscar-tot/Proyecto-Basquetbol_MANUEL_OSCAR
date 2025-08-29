# Marcador de Baloncesto (Frontend Angular)

Aplicación web para gestionar el marcador de partidos de baloncesto en tiempo real. Desarrollada con Angular 20 y TypeScript.

## Características

- Marcador en tiempo real con temporizador y control de períodos.
- Gestión de faltas y tiempos muertos para ambos equipos.
- Persistencia de datos mediante integración con backend (API REST).
- Interfaz moderna y responsiva con Material Icons y fuente Silkscreen.
- Preparada para despliegue en Docker y Nginx.

## Requisitos

- Node.js 18+
- npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker (opcional, para despliegue)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd front-proyecto1-desaweb
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución en desarrollo

```bash
npm start
```
Accede a [http://localhost:4200](http://localhost:4200) en tu navegador.

## Scripts disponibles

- `npm start` - Ejecuta el servidor de desarrollo.
- `npm run build` - Compila la aplicación para producción.
- `npm test` - Ejecuta los tests unitarios.

## Estructura del proyecto

```
src/
├── app/
│   ├── services/
│   │   └── partido.service.ts
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   └── app.config.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── main.ts
├── styles.css
└── index.html
```

## Docker

Para construir y ejecutar el frontend con Docker:

```bash
docker build -t basketball-scoreboard .
docker run -p 4200:80 basketball-scoreboard
```

O usando Docker Compose:

```bash
docker-compose up --build
```

## Variables de entorno

Configura las variables en `.env` (puedes copiar desde `.env.example`).

## Integración con backend

El frontend está preparado para conectarse a un backend REST en `http://localhost:5260/api/scoreboard`. Puedes modificar la URL en el servicio [`PartidoService`](src/app/services/partido.service.ts).

## Contribuir

¡Las contribuciones son bienvenidas! Abre un issue o pull request para sugerencias y mejoras.

## Licencia

Este proyecto está bajo la licencia
