# Cation Backend Server with Neon PostgreSQL

This is the backend server for the Cation user management system using Neon PostgreSQL cloud database.

## 🚀 Quick Setup Guide

### Step 1: Set up Neon PostgreSQL Database

1. **Create Neon Account**:
   - Go to [neon.tech](https://neon.tech)
   - Sign up for a free account
   - Create a new project (e.g., "cation-db")

2. **Get Connection Details**:
   - After project creation, copy your connection string
   - It looks like: `postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database_name?sslmode=require`

3. **Set up Database Schema**:
   - Go to your Neon dashboard
   - Click on "SQL Editor"
   - Copy and paste the contents of `database.sql`
   - Click "Run" to create the tables

### Step 2: Configure Environment Variables

1. **Create `.env` file**:
   ```bash
   cp env.example .env
   ```

2. **Update `.env` with your Neon credentials**:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database_name?sslmode=require
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Server and database health status

### Users Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/login` - User login

## 🔐 Sample Admin User

The database schema includes a sample admin user:
- **Username**: Admin User
- **Password**: admin123
- **Level**: engineer

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_level VARCHAR(50) NOT NULL CHECK (user_level IN ('operator', 'maintenance', 'engineer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **SSL/TLS**: Encrypted database connections

## 🧪 Testing the Setup

1. **Test Database Connection**:
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test User Creation**:
   ```bash
   curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "password": "password123",
       "userLevel": "operator"
     }'
   ```

3. **Test User Login**:
   ```bash
   curl -X POST http://localhost:5000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "password": "admin123"
     }'
   ```

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Check your `DATABASE_URL` in `.env`
   - Verify Neon project is active
   - Ensure SSL is enabled

2. **CORS Errors**:
   - Update `CORS_ORIGIN` in `.env` to match your frontend URL

3. **Port Already in Use**:
   - Change `PORT` in `.env` to another port (e.g., 5001)

## 📚 Next Steps

After setting up the backend:
1. Update your React frontend to connect to this API
2. Test all CRUD operations
3. Implement authentication in your frontend
4. Add more features as needed

## 🆘 Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify your Neon database connection
3. Ensure all environment variables are set correctly 