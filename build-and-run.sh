#!/bin/bash

# Script para construir y ejecutar el marcador de baloncesto con Docker

echo "🏀 Construyendo imagen Docker del marcador de baloncesto..."
docker build -t basketball-scoreboard .

echo "🚀 Ejecutando contenedor..."
docker run -d --name basketball-app -p 4200:80 basketball-scoreboard

echo "✅ Aplicación ejecutándose en http://localhost:4200"
echo ""
echo "📋 Comandos útiles:"
echo "  - Ver logs: docker logs basketball-app"
echo "  - Detener: docker stop basketball-app"
echo "  - Eliminar: docker rm basketball-app"
echo "  - Shell: docker exec -it basketball-app sh"
