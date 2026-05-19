# AQA Shrimp AI Backend - API Documentation

**Base URL (Production):** `https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app`

**Base URL (Local):** `http://localhost:3000`

---

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [User Profile Endpoints](#user-profile-endpoints)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Quick Test Guide](#quick-test-guide)

---

## Authentication Endpoints

### 1. Health Check
**Endpoint:** `GET /`

**Description:** Check if API is running

**Request:**
```bash
curl https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/
```

**Response:**
```json
{
  "success": true,
  "message": "AQA Shrimp AI Backend API",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "signup": "POST /api/auth/signup",
      "login": "POST /api/auth/login"
    },
    "user": {
      "getProfile": "GET /api/user/profile",
      "updateProfile": "PUT /api/user/profile"
    }
  }
}
```

---

### 2. User Signup
**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account

**Headers:**
```
Content-Type: application/json
```

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

**Required Fields:**
- `fullName` (string) - User's full name
- `email` (string) - Valid email address
- `password` (string) - Minimum 6 characters

**Optional Fields:**
- `farmName` (string) - Name of the farm
- `phone` (string) - Phone number
- `preferredLanguage` (string) - Default: "English"

**cURL Example:**
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "password": "password123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "createdAt": "2025-12-14T00:00:00.000Z"
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

---

### 3. User Login
**Endpoint:** `POST /api/auth/login`

**Description:** Login with existing credentials

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "farmer@aqashrimp.ai",
  "password": "password123"
}
```

**Required Fields:**
- `email` (string) - User's email
- `password` (string) - User's password

**cURL Example:**
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@aqashrimp.ai",
    "password": "password123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English"
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

---

## User Profile Endpoints

### 4. Get User Profile
**Endpoint:** `GET /api/user/profile`

**Description:** Get current user's profile (requires authentication)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**cURL Example:**
```bash
curl -X GET https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Farmer John",
    "farmName": "Sunny Creek Farm",
    "email": "farmer@aqashrimp.ai",
    "phone": "+15550192",
    "preferredLanguage": "English",
    "createdAt": "2025-12-14T00:00:00.000Z",
    "updatedAt": "2025-12-14T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

---

### 5. Update User Profile
**Endpoint:** `PUT /api/user/profile`

**Description:** Update current user's profile (requires authentication)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Request Body (all fields optional):**
```json
{
  "fullName": "Updated Farmer John",
  "farmName": "Updated Farm Name",
  "phone": "+919999999999",
  "preferredLanguage": "Telugu"
}
```

**Note:** Email and password cannot be updated through this endpoint.

**cURL Example:**
```bash
curl -X PUT https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "fullName": "Updated Farmer John",
    "farmName": "Updated Farm Name",
    "phone": "+919999999999",
    "preferredLanguage": "Telugu"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Updated Farmer John",
    "farmName": "Updated Farm Name",
    "email": "farmer@aqashrimp.ai",
    "phone": "+919999999999",
    "preferredLanguage": "Telugu",
    "createdAt": "2025-12-14T00:00:00.000Z",
    "updatedAt": "2025-12-14T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, invalid token"
}
```

---

## Response Format

All API responses follow this general structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (only in development)"
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required or failed |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

### Common Error Messages

1. **Authentication Errors:**
   - "Not authorized, no token"
   - "Not authorized, invalid token"
   - "Not authorized, token failed"

2. **Validation Errors:**
   - "Please provide full name, email, and password"
   - "Password must be at least 6 characters long"
   - "Please provide email and password"

3. **User Errors:**
   - "User with this email already exists"
   - "Invalid email or password"
   - "User not found"

---

## Quick Test Guide

### Step 1: Test Health Check
```bash
curl https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/
```

### Step 2: Create a New Account
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Save the token from the response!**

### Step 3: Login
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Save the token from the response!**

### Step 4: Get Profile (Replace TOKEN)
```bash
curl -X GET https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 5: Update Profile (Replace TOKEN)
```bash
curl -X PUT https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "Updated Test User",
    "phone": "+1234567890"
  }'
```

---

## Testing with Postman

1. **Import Collection:** Import the `postman_collection.json` file from the project root
2. **Set Base URL:** Create an environment variable `base_url` = `https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app`
3. **Test Signup:** Run the signup request and save the token
4. **Set Token:** Create an environment variable `auth_token` with the token value
5. **Test Protected Routes:** Run profile endpoints with the token

---

## Integration with Flutter App

### Using Dart/HTTP Package

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app';
  
  // Signup
  Future<Map<String, dynamic>> signup({
    required String fullName,
    required String email,
    required String password,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'fullName': fullName,
        'email': email,
        'password': password,
        'farmName': farmName,
        'phone': phone,
        'preferredLanguage': preferredLanguage ?? 'English',
      }),
    );
    
    return json.decode(response.body);
  }
  
  // Login
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );
    
    return json.decode(response.body);
  }
  
  // Get Profile
  Future<Map<String, dynamic>> getProfile(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/user/profile'),
      headers: {'Authorization': 'Bearer $token'},
    );
    
    return json.decode(response.body);
  }
  
  // Update Profile
  Future<Map<String, dynamic>> updateProfile({
    required String token,
    String? fullName,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/api/user/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: json.encode({
        if (fullName != null) 'fullName': fullName,
        if (farmName != null) 'farmName': farmName,
        if (phone != null) 'phone': phone,
        if (preferredLanguage != null) 'preferredLanguage': preferredLanguage,
      }),
    );
    
    return json.decode(response.body);
  }
}
```

---

## Security Notes

1. **Token Storage:** Store JWT tokens securely on the client side
2. **HTTPS Only:** Always use HTTPS in production
3. **Token Expiration:** Tokens expire after 30 days (configurable)
4. **Password Requirements:** Minimum 6 characters (consider increasing for production)
5. **Environment Variables:** Never commit sensitive data to version control

---

## Support

For issues or questions, contact: support@aqashrimp.ai

**API Version:** 1.0.0  
**Last Updated:** December 14, 2025
