# AQA Shrimp AI Backend API

Complete backend API system for AQA Shrimp AI mobile application with authentication, user management, and profile features.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Vercel** - Serverless deployment

## 📁 Project Structure

```
aqabackend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic (signup, login)
│   └── userController.js     # User profile logic
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   └── User.js              # User schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── userRoutes.js        # User endpoints
├── utils/
│   └── jwt.js               # JWT utilities
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── index.js                # Main app entry point
├── package.json            # Dependencies
├── vercel.json             # Vercel configuration
└── README.md               # Documentation
```

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the root directory with:
```env
MONGODB_URI=mongodb+srv://aqa:12345@cluster0.zsqkib3.mongodb.net/aqa_shrimp_ai
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
NODE_ENV=development
```

3. **Run development server:**
```bash
npm run dev
```

The server will start at `http://localhost:3000`

## 📡 API Endpoints

### 🔐 Authentication Endpoints

#### 1. Signup
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "fullName": "Farmer John",
  "farmName": "Sunny Creek Farm",
  "email": "farmer@aqashrimp.ai",
  "phone": "+15550192",
  "preferredLanguage": "English",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "createdAt": "2024-12-13T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

#### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "farmer@aqashrimp.ai",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "createdAt": "2024-12-13T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 👤 User Profile Endpoints (Protected)

**Note:** All user endpoints require authentication. Include JWT token in headers:
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Get User Profile
**GET** `/api/user/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "createdAt": "2024-12-13T10:30:00.000Z",
    "updatedAt": "2024-12-13T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

#### 4. Update User Profile
**PUT** `/api/user/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "farmName": "Updated Farm",
  "phone": "+9199999999",
  "preferredLanguage": "Telugu"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "fullName": "Updated Name",
    "farmName": "Updated Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+9199999999",
    "preferredLanguage": "Telugu",
    "createdAt": "2024-12-13T10:30:00.000Z",
    "updatedAt": "2024-12-13T11:45:00.000Z"
  }
}
```

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  fullName: String (required),
  farmName: String,
  email: String (required, unique),
  phone: String,
  preferredLanguage: String (default: "English"),
  password: String (hashed, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔒 Security Features

✅ Password hashing with bcryptjs (10 rounds)
✅ JWT tokens with 7-day expiration
✅ Password never returned in responses
✅ Protected routes with middleware
✅ Input validation
✅ Duplicate email prevention
✅ Error handling with try/catch

## 🌐 Vercel Deployment

### Deploy to Vercel:

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add the following environment variables:
     - `MONGODB_URI`: `mongodb+srv://aqa:12345@cluster0.zsqkib3.mongodb.net/aqa_shrimp_ai`
     - `JWT_SECRET`: Your secret key
     - `NODE_ENV`: `production`

5. **Production Deployment:**
```bash
vercel --prod
```

### Alternative: Deploy via Vercel Dashboard
1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy automatically

## 📱 Flutter Integration

### 1. Store JWT Token
```dart
// After login/signup
SharedPreferences prefs = await SharedPreferences.getInstance();
await prefs.setString('token', response.token);
```

### 2. Auto-Login Check
```dart
// On app start
SharedPreferences prefs = await SharedPreferences.getInstance();
String? token = prefs.getString('token');
if (token != null) {
  // Make API call to verify token
  // Navigate to home screen if valid
}
```

### 3. API Calls with Token
```dart
final response = await http.get(
  Uri.parse('https://your-api.vercel.app/api/user/profile'),
  headers: {
    'Authorization': 'Bearer $token',
    'Content-Type': 'application/json',
  },
);
```

## 🧪 Testing the API

### Using cURL:

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Update Profile:**
```bash
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Updated Name",
    "phone": "+1234567890"
  }'
```

## 🔍 HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST signup)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials/token)
- `404` - Not Found
- `500` - Server Error

## 🚦 Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

## 📝 Development Notes

- JWT tokens expire after 7 days
- Passwords must be at least 6 characters
- Email must be unique
- All profile update fields are optional
- Email cannot be changed after signup
- Password field excluded from all responses

## 🔮 Future Enhancements

- Password reset functionality
- Email verification
- Social media login (Google, Facebook)
- User avatar uploads
- Multi-language support
- Rate limiting
- API documentation with Swagger
- Unit and integration tests

## 📞 Support

For issues or questions, contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** December 13, 2025  
**Database:** MongoDB Atlas (`aqa_shrimp_ai`)  
**Deployment:** Vercel Serverless
