#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with required environment variables."
    exit 1
fi

# Check if podman is installed
if ! command -v podman &> /dev/null; then
    echo "Error: podman command not found!"
    echo "Please install Podman to run the database container."
    exit 1
fi

# Load environment variables from .env file
echo "Loading environment variables from .env..."
export $(grep -v '^#' .env | xargs)

# Source the shared kill-port script
source ./scripts/kill-port.sh

# Get ports from environment variables or defaults
BACKEND_PORT=${SERVER_PORT:-8080}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Kill any processes using the ports
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

echo "Starting PostgreSQL database..."
podman compose up -d postgres --no-recreate

echo "Waiting for database to be ready..."
for i in {1..30}; do
    if podman compose exec postgres pg_isready -U ${DB_USER} > /dev/null 2>&1; then
        echo "Database is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Database failed to start within 60 seconds"
        exit 1
    fi
    echo "Waiting for database... ($i/30)"
    sleep 2
done

# Start backend in new terminal
osascript -e "
tell application \"Terminal\"
    do script \"cd '$PWD' && echo 'Starting Spring Boot backend on port $BACKEND_PORT...' && cd backend && ./gradlew bootRun\"
end tell
"

# Start frontend in new terminal
osascript -e "
tell application \"Terminal\"
    do script \"cd '$PWD' && echo 'Starting React frontend on port $FRONTEND_PORT...' && cd frontend && npm run dev\"
end tell
"

echo "Backend and frontend started in separate terminals. Pls check the terminal to make sure they are working."
echo "Backend: http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT"
