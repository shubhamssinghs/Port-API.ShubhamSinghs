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


# Testing the application now
echo "🏗️  Testing the application now..."
cross-env jest --config jest.config.ts
