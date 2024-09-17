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

# Setting Node environment
echo -n "🛠  Setting Node environment to production..."
export NODE_ENV=production && checkmark || error_exit "Failed to set NODE_ENV to production."

# Setting configuration directory
echo -n "🗂️  Setting configuration directory..."
export NODE_CONFIG_DIR=./src/config && checkmark || error_exit "Failed to set NODE_CONFIG_DIR."

# Testing the application now
echo "🏗️  Testing the application now..."
cross-env jest --config jest.config.ts
