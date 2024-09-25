#!/bin/bash

# Define the path to sequelize
sequelizePath="./node_modules/.bin/sequelize"

# Function to ask for seeder name
askForSeederName() {
  read -p "🌱 Enter the seeder name: " seederName
  generateSeeder "$seederName"
}

# Function to generate seeder
generateSeeder() {
  local seederName="$1"
  local command="$sequelizePath seed:generate --name $seederName"

  # Execute the command
  output=$(eval "$command")

  # Check for errors
  if [ $? -ne 0 ]; then
    echo "Error generating seeder: $output ❌"
  else
    echo "Seeder generated: $output ✅"
  fi
}

# Call the function to start the process
askForSeederName
