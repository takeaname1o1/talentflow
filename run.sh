#!/bin/bash

# Navigate to the project directory (optional if already here)
cd "$(dirname "$0")"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting Vite development server..."
npm run dev

