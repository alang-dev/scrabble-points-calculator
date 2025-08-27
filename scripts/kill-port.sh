#!/bin/bash

# Function to kill process running on specified port
kill_port() {
    local PORT=$1
    
    if [ -z "$PORT" ]; then
        echo "Usage: kill_port <port_number>"
        return 1
    fi
    
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
}

# If script is called directly with port argument
if [ "$0" = "${BASH_SOURCE[0]}" ]; then
    kill_port $1
fi