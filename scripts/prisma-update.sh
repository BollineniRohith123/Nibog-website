#!/bin/bash

# Navigate to project directory
cd /Users/justrohith/Documents/Nibog/Nibog/nibog-website

# Update Prisma packages
npm install prisma@latest @prisma/client@latest

# Remove existing Prisma client
rm -rf node_modules/.prisma

# Regenerate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

echo "Prisma update and database setup completed successfully!"
