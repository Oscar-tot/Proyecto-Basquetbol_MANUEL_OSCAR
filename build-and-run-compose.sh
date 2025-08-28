#!/bin/bash

# Script para construir y ejecutar el marcador de baloncesto con Docker Compose

set -e

echo "🏀 Iniciando servicios del marcador de baloncesto..."

# Verificar si existe archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Revisa las variables de entorno si es necesario."
fi

# Construir y ejecutar servicios
echo "🔨 Construyendo servicios..."
docker-compose up --build -d

echo "⏳ Esperando a que SQL Server esté listo..."
sleep 30

echo "✅ Servicios ejecutándose:"
echo "  - Frontend: http://localhost:4200"
echo "  - Base de datos: localhost:1433 (sa/${SA_PASSWORD})"
# echo "  - Backend: http://localhost:8080 (deshabilitado)"

echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Detener: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo "  - Acceder a SQL Server: docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD}"

echo ""
echo "💡 Para habilitar el backend:"
echo "  1. Descomenta la sección 'backend' en docker-compose.yml"
echo "  2. Actualiza las variables en .env"
echo "  3. Vuelve a ejecutar: docker-compose up --build -d"
