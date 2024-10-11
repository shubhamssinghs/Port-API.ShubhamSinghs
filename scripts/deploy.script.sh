#!/bin/bash

sudo apt-get update
sudo apt-get install -y docker-compose

echo "ENV=${{ vars.ENV }}" >> .env
echo "APP_URL=${{ vars.APP_URL }}" >> .env
echo "APP_NAME=${{ vars.APP_NAME }}" >> .env
echo "SERVER_HOST=${{ vars.SERVER_HOST }}" >> .env
echo "SERVER_PORT=${{ vars.SERVER_PORT }}" >> .env
echo "ACCESS_TOKEN_SECRET=${{ vars.ACCESS_TOKEN_SECRET }}" >> .env
echo "REFRESH_TOKEN_SECRET=${{ vars.REFRESH_TOKEN_SECRET }}" >> .env
echo "EMAIL_VERIFICATION_SECRET=${{ vars.EMAIL_VERIFICATION_SECRET }}" >> .env
echo "ACCESS_TOKEN_EXPIRY=${{ vars.ACCESS_TOKEN_EXPIRY }}" >> .env
echo "REFRESH_TOKEN_EXPIRY=${{ vars.REFRESH_TOKEN_EXPIRY }}" >> .env
echo "EMAIL_VERIFICATION_TOKEN_EXPIRY=${{ vars.EMAIL_VERIFICATION_TOKEN_EXPIRY }}" >> .env
echo "SMTP_USERNAME=${{ vars.SMTP_USERNAME }}" >> .env 
echo "SMTP_PASSWORD=${{ vars.SMTP_PASSWORD }}" >> .env
echo "SMTP_HOST=${{ vars.SMTP_HOST }}" >> .env
echo "SMTP_PORT=${{ vars.SMTP_PORT }}" >> .env
echo "SMTP_SSL=${{ vars.SMTP_SSL }}" >> .env
echo "SMTP_SENDER_NAME=${{ vars.SMTP_SENDER_NAME }}" >> .env
echo "SMTP_FROM_MAIL=${{ vars.SMTP_FROM_MAIL }}" >> .env
echo "DB_HOST=${{ vars.DB_HOST }}" >> .env
echo "DB_USERNAME=${{ vars.DB_USERNAME }}" >> .env
echo "DB_PASSWORD=${{ vars.DB_PASSWORD }}" >> .env
echo "DB_DATABASE=${{ vars.DB_DATABASE }}" >> .env
echo "CORS_ALLOWED_ORIGINS=${{ vars.CORS_ALLOWED_ORIGINS }}" >> .env
echo "LOG_LEVEL=database" >> .env
echo "LOG_TIME_ZONE=Asia/Kolkata" >> .env

echo "version: '3.8'" > docker-compose.yml
echo "services:" >> docker-compose.yml
echo "  app:" >> docker-compose.yml
echo "    image: ${{ secrets.DOCKER_USERNAME }}/${{ vars.DOCKER_IMAGE_NAME }}" >> docker-compose.yml
echo "    container_name: ${{ vars.DOCKER_IMAGE_NAME }}" >> docker-compose.yml
echo "    ports:" >> docker-compose.yml
echo "      - \"${{ vars.SERVER_PORT }}:${{ vars.SERVER_PORT }}\"" >> docker-compose.yml
echo "    env_file: .env" >> docker-compose.yml
echo "    restart: unless-stopped" >> docker-compose.yml

docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml up -d