#!/bin/bash

# Function to display checkmark
function checkmark {
  echo -e " ✅"
}

# Function to display cross mark and error message
function crossmark {
  echo -e " ❌"
}

# Function to handle errors
error_exit() {
  crossmark
  echo -e "\n❌ $1"
  exit 1
}

# Install dependencies
echo -n "🚀 Installing dependencies..."
install_output=$(npm install 2>&1) && checkmark || error_exit "Failed to install dependencies:\n$install_output"

# Setting Node environment
echo -n "🛠  Setting Node environment to development"
export NODE_ENV=development && checkmark || error_exit "Failed to set NODE_ENV to development."

# Setting configuration directory
echo -n "🗂️  Setting configuration directory"
export NODE_CONFIG_DIR=./src/config && checkmark || error_exit "Failed to set NODE_CONFIG_DIR."

# Running migrations
echo -n "🏃💨 Running migrations..."
migrate_output=$(npx sequelize-cli db:migrate 2>&1) && checkmark || error_exit "Failed to run migrations:\n$migrate_output"

# Start the server
echo "🌐 Starting local development server..."
cross-env nodemon --exec ts-node src/server.ts || error_exit "Failed to start the local development server."
