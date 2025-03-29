#!/bin/bash

# Database Setup Script for NIBOG Event Booking Website

# Ensure MySQL is running
mysql.server start

# Create database if not exists
mysql -u root -e "CREATE DATABASE IF NOT EXISTS nibog_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Navigate to project directory
cd /Users/justrohith/Documents/Nibog/Nibog/nibog-website

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

echo "Database setup completed successfully!"
