// Script to update user password
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updatePassword() {
  try {
    const username = 'Shailendra';
    const password = 'sp1234';
    
    // Generate new password hash
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Generated hash:', passwordHash);
    
    // Update the user's password
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE name = $2 RETURNING id, name, user_level',
      [passwordHash, username]
    );
    
    if (result.rows.length > 0) {
      console.log('User updated successfully:', result.rows[0]);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error updating password:', error.message);
    console.error(error.stack);
  } finally {
    // Close the pool
    await pool.end();
  }
}

updatePassword();