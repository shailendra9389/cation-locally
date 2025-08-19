# Local PostgreSQL Setup for Cation

This document provides instructions for setting up and using a local PostgreSQL database with the Cation application instead of the cloud-based Neon DB.

## Prerequisites

1. PostgreSQL installed on your local machine
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Recommended version: 14 or higher

2. Basic knowledge of PostgreSQL administration

## Configuration Steps

1. **Create a PostgreSQL database**

   ```sql
   CREATE DATABASE cation;
   ```

   You can run this command using psql or a PostgreSQL administration tool like pgAdmin.

2. **Configure environment variables**

   The `.env` file has been updated with local PostgreSQL connection details. Update these values to match your PostgreSQL installation:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cation
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

   Make sure to set the correct password for your PostgreSQL user.

3. **Run the database setup script**

   ```bash
   npm run setup-local-db
   ```

   This script will create the necessary tables and initial data in your local PostgreSQL database.

## Verification

To verify that the local database is working correctly:

1. Start the server:

   ```bash
   npm start
   ```

2. Access the health check endpoint:

   ```
   http://localhost:9000/health
   ```

   The response should show `"database": "Connected"`.

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL service is running on your machine
- Verify the connection details in the `.env` file
- Check PostgreSQL logs for any errors
- Make sure your PostgreSQL user has the necessary permissions

### Schema Issues

If you encounter schema-related errors:

1. Connect to your PostgreSQL database using psql or pgAdmin
2. Verify that the tables exist:

   ```sql
   \dt
   ```

3. If needed, manually run the SQL commands from `database.sql`

## Switching Back to Neon DB

If you need to switch back to using Neon DB:

1. Edit the `.env` file to uncomment the `DATABASE_URL` line and comment out the local PostgreSQL variables
2. Revert the changes in `db.js` and `update_password.js` to use the connection string instead of individual parameters

## Additional Notes

- The local PostgreSQL configuration uses more connections (20) than the Neon DB configuration (5) since local PostgreSQL can handle more concurrent connections
- The health check interval has been increased from 2.5 minutes to 10 minutes since local connections are more stable