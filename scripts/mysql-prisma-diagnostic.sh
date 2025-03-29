#!/bin/bash

echo "=== MySQL and Prisma Diagnostic Script ==="

# Check MySQL installation
echo -e "\n1. Checking MySQL Installation:"
which mysql || echo "MySQL not found in PATH"

# Check MySQL server status
echo -e "\n2. MySQL Server Status:"
mysql.server status || echo "MySQL server status check failed"

# Check database connection
echo -e "\n3. Database Connection Test:"
mysql -u root -e "SHOW DATABASES;" || echo "Database connection failed"

# Check Prisma installation
echo -e "\n4. Prisma Installation:"
npx prisma --version || echo "Prisma CLI not found"

# Check Prisma client generation
echo -e "\n5. Prisma Client Generation:"
cd /Users/justrohith/Documents/Nibog/Nibog/nibog-website
npx prisma generate || echo "Prisma client generation failed"

# Check database existence
echo -e "\n6. Database Existence:"
mysql -u root -e "SHOW DATABASES LIKE 'nibog_events';" || echo "Database 'nibog_events' not found"

# Detailed Prisma schema validation
echo -e "\n7. Prisma Schema Validation:"
npx prisma validate || echo "Prisma schema validation failed"

echo -e "\n=== Diagnostic Complete ==="
