#!/bin/bash

# Database Setup Script for NIBOG Event Booking Website

# Exit on any error
set -e

# Check if MySQL is installed
if ! command -v mysql &> /dev/null
then
    echo "MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Prompt for MySQL root password
read -sp "Enter MySQL root password: " MYSQL_ROOT_PASSWORD
echo

# Create database
echo "Creating database nibog_events..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS nibog_events CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create database user (optional, replace with your preferred credentials)
echo "Creating database user..."
mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "
CREATE USER IF NOT EXISTS 'nibog_user'@'localhost' IDENTIFIED BY 'nibog_password';
GRANT ALL PRIVILEGES ON nibog_events.* TO 'nibog_user'@'localhost';
FLUSH PRIVILEGES;
"

# Generate .env.local file
echo "Generating .env.local file..."
cat > /Users/justrohith/Documents/Nibog/Nibog/nibog-website/.env.local << EOL
DATABASE_URL="mysql://nibog_user:nibog_password@localhost:3306/nibog_events?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
EOL

# Navigate to project directory
cd /Users/justrohith/Documents/Nibog/Nibog/nibog-website

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "Seeding database..."
npx prisma db seed

echo "Database setup completed successfully!"
