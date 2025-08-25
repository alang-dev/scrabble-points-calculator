#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
fi

# Get port from environment variable or default to 8080
PORT=${BACKEND_PORT:-8080}

echo "Checking for processes on port $PORT..."

# Find process using the port
PID=$(lsof -ti:$PORT 2>/dev/null)

if [ ! -z "$PID" ]; then
    echo "Found process $PID running on port $PORT, killing it..."
    kill $PID
    
    # Wait for process to be killed
    sleep 2
    
    # Check if process is really dead
    if kill -0 $PID 2>/dev/null; then
        echo "Process still running, force killing..."
        kill -9 $PID
        sleep 1
    fi
    
    echo "Process killed successfully"
else
    echo "No process found on port $PORT"
fi

echo "Starting Spring Boot application on port $PORT..."
cd backend && ./gradlew bootRun