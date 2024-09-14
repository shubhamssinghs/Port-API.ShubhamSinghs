#!/bin/bash

# Define the path to sequelize
sequelizePath="./node_modules/.bin/sequelize"

# Function to ask for migration name
askForMigrationName() {
  read -p "🗂️  Enter the migration name: " migrationName
  generateMigration "$migrationName"
}

# Function to generate migration
generateMigration() {
  local migrationName="$1"
  local command="$sequelizePath migration:generate --name $migrationName"

  # Execute the command
  output=$(eval "$command")

  # Check for errors
  if [ $? -ne 0 ]; then
    echo "Error generating migration: $output ❌"
  else
    echo "Migration generated: $output ✅"
  fi
}

# Call the function to start the process
askForMigrationName
