// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import pool from '../db.js';

// const router = express.Router();

// // ✅ LOGIN USER (MUST BE BEFORE '/:id')
// router.post('/login', async (req, res) => {
//   try {
//     const { name, password } = req.body;

//     if (!name || !password) {
//       return res.status(400).json({ success: false, error: 'Name and password are required' });
//     }

//     const result = await pool.query(
//       'SELECT id, name, password_hash, user_level FROM users WHERE name = $1',
//       [name]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ success: false, error: 'Invalid credentials' });
//     }

//     const user = result.rows[0];
//     const isValidPassword = await bcrypt.compare(password, user.password_hash);

//     if (!isValidPassword) {
//       return res.status(401).json({ success: false, error: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       {
//         userId: user.id,
//         name: user.name,
//         userLevel: user.user_level,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           userLevel: user.user_level
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// // ✅ CREATE NEW USER
// router.post('/', async (req, res) => {
//   console.log('📥 Incoming request to create user:', req.body);
//   try {
//     const { name, password, userLevel } = req.body;

//     if (!name || !password || !userLevel) {
//       return res.status(400).json({ success: false, error: 'Name, password, and user level are required' });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
//     }

//     if (!['operator', 'maintenance', 'engineer'].includes(userLevel)) {
//       return res.status(400).json({ success: false, error: 'Invalid user level' });
//     }

//     const existingUser = await pool.query('SELECT id FROM users WHERE name = $1', [name]);
//     if (existingUser.rows.length > 0) {
//       return res.status(400).json({ success: false, error: 'User with this name already exists' });
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       'INSERT INTO users (name, password_hash, user_level) VALUES ($1, $2, $3) RETURNING id, name, user_level, created_at',
//       [name, passwordHash, userLevel]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       data: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// // ✅ GET ALL USERS
// router.get('/', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT id, name, user_level, created_at, updated_at FROM users ORDER BY created_at DESC'
//     );
//     res.json({
//       success: true,
//       data: result.rows,
//       count: result.rows.length
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// // ✅ GET USER BY ID
// router.get('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       'SELECT id, name, user_level, created_at, updated_at FROM users WHERE id = $1',
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     res.json({
//       success: true,
//       data: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// // ✅ UPDATE USER
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, userLevel } = req.body;

//     if (!name || !userLevel) {
//       return res.status(400).json({ success: false, error: 'Name and user level are required' });
//     }

//     if (!['operator', 'maintenance', 'engineer'].includes(userLevel)) {
//       return res.status(400).json({ success: false, error: 'Invalid user level' });
//     }

//     const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
//     if (existingUser.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     const result = await pool.query(
//       'UPDATE users SET name = $1, user_level = $2 WHERE id = $3 RETURNING id, name, user_level, updated_at',
//       [name, userLevel, id]
//     );

//     res.json({
//       success: true,
//       message: 'User updated successfully',
//       data: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// // ✅ DELETE USER
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingUser = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
//     if (existingUser.rows.length === 0) {
//       return res.status(404).json({ success: false, error: 'User not found' });
//     }

//     await pool.query('DELETE FROM users WHERE id = $1', [id]);

//     res.json({ success: true, message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
//   }
// });

// export default router;


import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js'; // use query helper instead of pool.query

const router = express.Router();

// ✅ LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false, error: 'Name and password are required' });
    }

    const result = await query(
      'SELECT id, name, password_hash, user_level FROM users WHERE name = $1',
      [name]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, userLevel: user.user_level },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, name: user.name, userLevel: user.user_level }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// ✅ CREATE NEW USER
router.post('/', async (req, res) => {
  console.log('📥 Body received:', req.body);
  console.log('📥 Incoming request to create user:', req.body);
  try {
    const { name, password, userLevel } = req.body;

    if (!name || !password || !userLevel) {
      return res.status(400).json({ success: false, error: 'Name, password, and user level are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    if (!['operator', 'maintenance', 'engineer'].includes(userLevel)) {
      return res.status(400).json({ success: false, error: 'Invalid user level' });
    }

    const existingUser = await query('SELECT id FROM users WHERE name = $1', [name]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'User with this name already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, password_hash, user_level) VALUES ($1, $2, $3) RETURNING id, name, user_level, created_at',
      [name, passwordHash, userLevel]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// ✅ GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, user_level, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// ✅ GET USER BY ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, user_level, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// ✅ UPDATE USER
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, userLevel } = req.body;

    if (!name || !userLevel) {
      return res.status(400).json({ success: false, error: 'Name and user level are required' });
    }

    if (!['operator', 'maintenance', 'engineer'].includes(userLevel)) {
      return res.status(400).json({ success: false, error: 'Invalid user level' });
    }

    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const result = await query(
      'UPDATE users SET name = $1, user_level = $2 WHERE id = $3 RETURNING id, name, user_level, updated_at',
      [name, userLevel, id]
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

// ✅ DELETE USER
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
});

export default router;
