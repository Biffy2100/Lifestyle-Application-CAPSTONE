# Lifestyle Habit Tracker - CAPSTONE Project

**TEAM VENEMEA TECH**

A full-stack habit tracking application built with React Native (Expo) for web deployment, featuring a Node.js backend with MongoDB integration.

## 🚀 Features

### Frontend (React Native Web)
- **Cross-platform compatibility** - Runs on web, iOS, and Android
- **Modern UI** - Clean, responsive design with animations
- **User Authentication** - Secure login/signup with JWT tokens
- **Habit Management** - Create, update, delete, and track habits
- **Progress Analytics** - Visual charts and statistics
- **Offline Support** - Local storage with server sync
- **Real-time Updates** - Instant UI updates with optimistic rendering

### Backend (Node.js + Express + MongoDB)
- **RESTful API** - Well-structured API endpoints
- **JWT Authentication** - Secure user sessions
- **Data Validation** - Comprehensive input validation
- **MongoDB Integration** - Scalable database with Mongoose ODM
- **Error Handling** - Centralized error management
- **Security** - Rate limiting, CORS protection, password hashing

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │    Database     │
│                 │    │                  │    │                 │
│ React Native    │◄──►│ Node.js/Express  │◄──►│    MongoDB      │
│ Expo Web        │    │ JWT Auth         │    │    Atlas        │
│ Axios API       │    │ Mongoose ODM     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform framework
- **Expo** - Development platform and web deployment
- **React Navigation** - Navigation library
- **Axios** - HTTP client for API calls
- **AsyncStorage/localStorage** - Platform-specific storage
- **React Context** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JSON Web Token (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Development Tools
- **Metro** - React Native bundler
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📦 Project Structure

```
├── src/
│   ├── Screens/           # Screen components
│   ├── context/           # React Context providers
│   ├── services/          # API service layer
│   └── utils/             # Utility functions
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   └── routes/        # API routes
│   └── server.js          # Entry point
├── assets/                # Static assets
└── components/            # Reusable components
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start      # Start Expo dev server
   npm run web    # Run on web specifically
   ```

3. **Build for web**
   ```bash
   npm run build:web
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get user profile
- `PUT /api/users/profile` - Update profile

### Habits
- `GET /api/habits` - Get user habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `PATCH /api/habits/:id/toggle` - Toggle completion
- `GET /api/habits/stats` - Get statistics

## 📱 Screenshots

[Screenshots will be added once the app is deployed]

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy URLs
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com)

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Manual API testing
curl http://localhost:5000/health
```

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting
- CORS protection
- Secure HTTP headers

## 📊 Performance Features

- Optimistic UI updates
- Local data caching
- Lazy loading
- Image optimization
- Bundle splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**TEAM VENEMEA TECH**
- Project lead and development team

## 🙏 Acknowledgments

- Expo team for the amazing platform
- React Native community
- MongoDB for the excellent database solution
- All open source contributors

---

**Built with ❤️ by TEAM VENEMEA TECH**
