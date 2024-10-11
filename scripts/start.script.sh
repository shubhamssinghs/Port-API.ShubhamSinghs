#!/bin/bash

# Function to handle errors and stop the script
error_exit() {
  echo -e "\n❌ $1"
  exit 1
}

# Install dependencies
echo -n "🚀 Installing dependencies..."
npm install || error_exit "Failed to install dependencies."

# Running migrations
echo -n "🏃💨 Running migrations..."
npm run migrate || error_exit "Failed to run migrations."

# Start the server
echo "🌐 Starting  server..."
cross-env ts-node src/server.ts || error_exit "Failed to start the server."
