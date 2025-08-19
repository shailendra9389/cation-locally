// // db.js
// import pkg from 'pg';
// const { Pool } = pkg;
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
//   idleTimeoutMillis: 60000,       // 1 minute idle timeout for client
//   connectionTimeoutMillis: 30000, // 30 seconds connect timeout
//                          // Minimum number of clients in the pool
//   keepAlive: true                // Keep connections alive
// });

// // Keep-alive ping every 3 minutes (Neon idle limit ~5 min)
// const keepAliveInterval = 3 * 60 * 1000; // 3 minutes
// let keepAliveTimer = null;

// function startKeepAlive() {
//   if (keepAliveTimer) {
//     clearInterval(keepAliveTimer);
//   }
  
//   keepAliveTimer = setInterval(async () => {
//     try {
//       await pool.query('SELECT 1');
//       console.log('✅ DB keep-alive ping sent');
//     } catch (err) {
//       console.error('❌ DB keep-alive failed:', err.message);
//       // Try to reconnect
//       try {
//         await testConnection();
//         console.log('✅ Reconnection successful');
//       } catch (reconnectErr) {
//         console.error('❌ Reconnection failed:', reconnectErr.message);
//       }
//     }
//   }, keepAliveInterval);
// }

// startKeepAlive();

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
  
//   // If the connection was terminated unexpectedly, try to recover
//   if (err.message.includes('Connection terminated unexpectedly')) {
//     console.log('🔄 Attempting to recover from connection termination...');
    
//     // Restart the keep-alive mechanism
//     startKeepAlive();
    
//     // You might want to implement additional recovery logic here
//     // such as notifying the application to retry failed queries
//   }
// });
// // 
// export const testConnection = async () => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     console.log('✅ Database connection test successful:', result.rows[0]);
//     return true;
//   } catch (error) {
//     console.error('❌ Database connection test failed:', error.message);
//     return false;
//   }
// };

// export default pool;


// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let pool;

/**
 * Create a new connection pool to Neon DB
 */
function createPool() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Neon SSL
    idleTimeoutMillis: 0,               // Close idle connections immediately
    connectionTimeoutMillis: 30000,     // 30s connection timeout
    keepAlive: true,                    // Keep TCP alive
    max: 5                              // Neon free tier allows few connections
  });

  // Handle unexpected errors on idle clients
  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    
    // Recreate pool on connection issues
    if (err.code === 'ECONNRESET' || err.message.includes('Connection terminated unexpectedly')) {
      console.log('🔄 Recreating pool due to connection loss...');
      recreatePool();
    }
  });

  return pool;
}

/**
 * Close and recreate the pool
 */
function recreatePool() {
  if (pool) {
    pool.end()
      .then(() => {
        console.log('✅ Old pool closed, creating new pool...');
        createPool();
      })
      .catch((err) => {
        console.error('❌ Error closing pool:', err);
        createPool();
      });
  } else {
    createPool();
  }
}

// Initialize pool at startup
pool = createPool();

// Keep-alive ping every 2.5 minutes (Neon idle cutoff ~5 min)
const keepAliveInterval = 150000;
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ DB keep-alive ping sent');
  } catch (err) {
    console.error('❌ Keep-alive failed:', err.message);
    recreatePool();
  }
}, keepAliveInterval);

/**
 * Test DB connection
 */
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
};

/**
 * Query helper - uses a client from the pool
 */
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};

export default pool;
