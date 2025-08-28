# Marcador de Baloncesto con Docker

Aplicación web de marcador de baloncesto en tiempo real con integración a backend .NET y base de datos SQL Server.

## Arquitectura

- **Frontend**: Angular 20 con TypeScript
- **Backend**: .NET (por implementar)
- **Base de datos**: SQL Server 2022 en contenedor Docker
- **Despliegue**: Docker Compose con Nginx

## Características

- ✅ Marcador en tiempo real con temporizador
- ✅ Control de períodos, faltas y tiempos muertos
- ✅ Interfaz robótica con Material Icons
- ✅ Integración con backend para persistencia
- ✅ Contenedores Docker preparados
- ✅ Base de datos SQL Server en contenedor

## Requisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- .NET 8+ (para el backend)

## Instalación y Ejecución

### Opción 1: Usando Docker Compose (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd basketball-scoreboard
   ```

2. **Construir y ejecutar todos los servicios**
   ```bash
   docker-compose up --build
   ```

3. **Acceder a la aplicación**
   - Frontend: http://localhost:4200
   - Base de datos: localhost:1433 (sa/StrongPassword123!)

### Opción 2: Desarrollo Local

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**
   ```bash
   npm start
   ```

3. **Acceder**: http://localhost:4200

## Configuración del Backend

### Variables de Entorno

El frontend está configurado para conectarse al backend en:
- **Desarrollo**: `http://localhost:8080/api`
- **Producción**: `http://backend:8080/api`

### Endpoints del Backend

La aplicación espera los siguientes endpoints:

```
POST   /api/partidos           - Crear nuevo partido
PUT    /api/partidos/:id       - Actualizar partido
PUT    /api/partidos/:id/finalizar   - Finalizar partido
PUT    /api/partidos/:id/cancelar    - Cancelar partido
PUT    /api/partidos/:id/suspender   - Suspender partido
GET    /api/partidos           - Obtener todos los partidos
GET    /api/partidos/:id       - Obtener partido por ID
```

### Estructura del Partido

```typescript
interface Partido {
  id?: number;
  equipoLocal: string;
  equipoVisitante: string;
  puntuacionLocal: number;
  puntuacionVisitante: number;
  periodo: number;
  tiempoRestante: number;
  faltasLocal: number;
  faltasVisitante: number;
  tiemposMuertosLocal: number;
  tiemposMuertosVisitante: number;
  estado: 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO' | 'SUSPENDIDO';
  fechaCreacion?: Date;
  fechaFinalizacion?: Date;
}
```

## Docker

### Construir Imagen Manualmente

```bash
# Construir imagen
docker build -t basketball-scoreboard .

# Ejecutar contenedor
docker run -p 4200:80 basketball-scoreboard
```

### Servicios en Docker Compose

- **sqlserver**: SQL Server 2022 Express
- **backend**: Aplicación .NET (deshabilitado hasta implementación)
- **frontend**: Aplicación Angular servida por Nginx

### Volúmenes

- `sqlserver_data`: Persistencia de datos de SQL Server

## Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm start              # Servidor de desarrollo
npm run build          # Construir para desarrollo
npm run build:prod     # Construir para producción
npm test              # Ejecutar tests

# Docker
docker-compose up      # Ejecutar todos los servicios
docker-compose down    # Detener servicios
docker-compose logs    # Ver logs
```

### Estructura del Proyecto

```
src/
├── app/
│   ├── services/
│   │   └── partido.service.ts    # Servicio para backend
│   ├── app.ts                    # Componente principal
│   ├── app.html                  # Template
│   └── app.css                   # Estilos
├── environments/
│   ├── environment.ts            # Config desarrollo
│   └── environment.prod.ts       # Config producción
└── ...
```

## Base de Datos

### Conexión

- **Servidor**: localhost:1433 (o sqlserver:1433 en Docker)
- **Usuario**: sa
- **Contraseña**: StrongPassword123!
- **Base de datos**: BasketballDB

### Tabla de Partidos

```sql
CREATE TABLE Partidos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EquipoLocal NVARCHAR(100) NOT NULL,
    EquipoVisitante NVARCHAR(100) NOT NULL,
    PuntuacionLocal INT DEFAULT 0,
    PuntuacionVisitante INT DEFAULT 0,
    Periodo INT DEFAULT 1,
    TiempoRestante INT DEFAULT 600,
    FaltasLocal INT DEFAULT 0,
    FaltasVisitante INT DEFAULT 0,
    TiemposMuertosLocal INT DEFAULT 7,
    TiemposMuertosVisitante INT DEFAULT 7,
    Estado NVARCHAR(20) DEFAULT 'EN_CURSO',
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    FechaFinalizacion DATETIME2 NULL
);
```

## Próximos Pasos

1. **Implementar el backend .NET**
2. **Crear scripts de inicialización de BD**
3. **Agregar autenticación**
4. **Implementar tests**
5. **Configurar CI/CD**

## Soporte

Para problemas o preguntas, por favor crear un issue en el repositorio.
