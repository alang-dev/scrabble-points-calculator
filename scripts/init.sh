#!/bin/bash

# Scrabble Points Calculator - Initialization Script
# This script sets up the project by installing dependencies and pulling Docker images
set -e

echo "Initializing Scrabble Points Calculator..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found. Using default configuration."
fi

echo ""
echo "Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
./gradlew build -x test
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install e2e dependencies
echo "Installing e2e test dependencies..."
cd e2e
npm install
cd ..

echo ""
echo "Pulling PostgreSQL Docker image..."

# Pull PostgreSQL Docker image
if command -v podman &> /dev/null; then
    echo "Using Podman..."
    podman pull postgres:16.10
elif command -v docker &> /dev/null; then
    echo "Using Docker..."
    docker pull postgres:16.10
else
    echo "Error: Neither podman nor docker found. Please install Docker or Podman first."
    exit 1
fi
