# Habit Tracker Backend API

Production-ready Node.js backend for the Lifestyle Habit Tracker application.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Habit Management**: CRUD operations for habits with progress tracking
- **User Profiles**: User management and profile updates
- **Data Validation**: Comprehensive input validation using express-validator
- **Security**: Rate limiting, CORS protection, and secure headers
- **MongoDB**: Mongoose ODM for MongoDB integration
- **Error Handling**: Centralized error handling with detailed logging

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/me` - Get current user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Habits
- `GET /api/habits` - Get all user habits (Protected)
- `POST /api/habits` - Create new habit (Protected)
- `PUT /api/habits/:id` - Update habit (Protected)
- `DELETE /api/habits/:id` - Delete habit (Protected)
- `PATCH /api/habits/:id/toggle` - Toggle habit completion (Protected)
- `GET /api/habits/stats` - Get habit statistics (Protected)

### Health Check
- `GET /health` - Server health status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

3. Start the development server:
```bash
npm run dev
```

4. Start the production server:
```bash
npm start
```

## Environment Variables

Required environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (use a strong, random string)
- `JWT_EXPIRE` - JWT expiration time (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS

## Deployment

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all required env vars

### Railway Deployment

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Create new project: `railway new`
4. Deploy: `railway up`
5. Set environment variables in Railway dashboard

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Route definitions
│   └── config/         # Configuration files
├── server.js           # Entry point
├── package.json        # Dependencies and scripts
└── .env.example       # Environment variables template
```

## Data Models

### User
- name, email, password
- preferences (theme, notifications, etc.)
- stats (total habits, completions, streaks, etc.)

### Habit
- text, category, icon
- completion tracking
- streak counting
- difficulty levels
- progress history

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Error logging and handling