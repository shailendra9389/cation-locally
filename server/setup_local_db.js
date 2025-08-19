// setup_local_db.js
// Script to set up the local PostgreSQL database

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a connection pool to the PostgreSQL server
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cation',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

async function setupDatabase() {
  let client;
  try {
    // Connect to the database
    client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('📄 Executing SQL script...');
    
    // Execute the SQL script
    await client.query(sqlScript);
    
    console.log('✅ Database setup completed successfully');
    
    // Verify the users table was created
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log(`✅ Users table created with ${result.rows[0].count} records`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(error.stack);
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

setupDatabase();