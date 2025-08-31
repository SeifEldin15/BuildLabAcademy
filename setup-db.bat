@echo off
echo Setting up PostgreSQL database for Build Lab Academy...

REM Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE buildlab_db;"

REM Run the schema file
psql -U postgres -d buildlab_db -f database/schema.sql

echo Database setup complete!
echo.
echo Next steps:
echo 1. Update your .env.local file with the correct database credentials
echo 2. Make sure PostgreSQL service is running
echo 3. Test the connection by running: npm run dev
pause
