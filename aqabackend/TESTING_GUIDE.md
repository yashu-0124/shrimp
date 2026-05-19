# API Testing Guide - AQA Shrimp AI Backend

## 🚀 Quick Start

Your API is now live at: **https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app**

---

## ✅ All APIs Tested Successfully

I've verified all endpoints are working correctly on your Vercel deployment:

### 1. ✅ Health Check
```bash
curl https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/
```
**Status:** Working ✓

### 2. ✅ Signup
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User Demo",
    "farmName": "Demo Farm",
    "email": "testdemo@aqashrimp.ai",
    "phone": "+1234567890",
    "preferredLanguage": "English",
    "password": "password123"
  }'
```
**Status:** Working ✓

### 3. ✅ Login
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testdemo@aqashrimp.ai",
    "password": "password123"
  }'
```
**Status:** Working ✓

### 4. ✅ Get Profile
```bash
curl -X GET https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
**Status:** Working ✓

### 5. ✅ Update Profile
```bash
curl -X PUT https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "Updated Test User",
    "farmName": "Updated Demo Farm",
    "phone": "+9876543210",
    "preferredLanguage": "Telugu"
  }'
```
**Status:** Working ✓

---

## 📋 Testing Methods

### Method 1: Using cURL (Command Line)

#### Step-by-step Test Flow:

1. **Test Health Check:**
```bash
curl -s https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/ | jq .
```

2. **Create Account:**
```bash
curl -s -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Your Name",
    "email": "your.email@example.com",
    "password": "password123"
  }' | jq .
```
**📝 Copy the token from the response!**

3. **Login:**
```bash
curl -s -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your.email@example.com",
    "password": "password123"
  }' | jq .
```
**📝 Copy the token from the response!**

4. **Get Profile (Replace YOUR_TOKEN):**
```bash
curl -s -X GET https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN" | jq .
```

5. **Update Profile (Replace YOUR_TOKEN):**
```bash
curl -s -X PUT https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fullName": "Updated Name",
    "phone": "+1234567890"
  }' | jq .
```

---

### Method 2: Using VS Code REST Client

1. Open `api-tests.http` file in VS Code
2. Install "REST Client" extension if not already installed
3. Click on "Send Request" above each API call
4. The file now includes both Production and Local URLs

---

### Method 3: Using Postman

#### Import Collection:
1. Open Postman
2. Click "Import"
3. Select `postman_collection.json` from the project folder
4. Create environment with:
   - Variable: `base_url`
   - Value: `https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app`

#### Test Flow in Postman:
1. Run "Signup" request → Save token from response
2. Create environment variable `auth_token` with the token value
3. Run "Login" request → Update token if needed
4. Run "Get Profile" request (uses `{{auth_token}}`)
5. Run "Update Profile" request (uses `{{auth_token}}`)

---

### Method 4: Using Postman in VS Code

If you have Postman extension installed in VS Code:
1. Use the "Send Request" button in Postman tab
2. Tests are available in the Postman collection

---

## 🧪 Complete Test Script

Create a file `test-api.sh` and run all tests:

```bash
#!/bin/bash

BASE_URL="https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app"

echo "🧪 Testing AQA Shrimp AI Backend API..."
echo "========================================="
echo ""

# Test 1: Health Check
echo "✅ Test 1: Health Check"
curl -s "$BASE_URL/" | jq .
echo ""

# Test 2: Signup
echo "✅ Test 2: User Signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')
echo "$SIGNUP_RESPONSE" | jq .
TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r .token)
echo "📝 Token: $TOKEN"
echo ""

# Test 3: Login
echo "✅ Test 3: User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')
echo "$LOGIN_RESPONSE" | jq .
echo ""

# Test 4: Get Profile
echo "✅ Test 4: Get User Profile"
curl -s -X GET "$BASE_URL/api/user/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# Test 5: Update Profile
echo "✅ Test 5: Update User Profile"
curl -s -X PUT "$BASE_URL/api/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "Updated Test User",
    "phone": "+1234567890",
    "preferredLanguage": "Telugu"
  }' | jq .
echo ""

echo "========================================="
echo "✅ All tests completed!"
```

Make it executable and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📱 Flutter Integration Example

### Complete Flutter Service Class:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class AqaShrimpApiService {
  static const String baseUrl = 'https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app';
  String? _authToken;

  // Singleton pattern
  static final AqaShrimpApiService _instance = AqaShrimpApiService._internal();
  factory AqaShrimpApiService() => _instance;
  AqaShrimpApiService._internal();

  // Set authentication token
  void setToken(String token) {
    _authToken = token;
  }

  // Get authentication token
  String? getToken() => _authToken;

  // Clear authentication token
  void clearToken() {
    _authToken = null;
  }

  // ========== Authentication APIs ==========

  /// Signup new user
  Future<Map<String, dynamic>> signup({
    required String fullName,
    required String email,
    required String password,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/signup'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'fullName': fullName,
          'email': email,
          'password': password,
          if (farmName != null) 'farmName': farmName,
          if (phone != null) 'phone': phone,
          'preferredLanguage': preferredLanguage ?? 'English',
        }),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 201 && data['success']) {
        // Save token automatically
        _authToken = data['token'];
      }
      
      return data;
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }

  /// Login user
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          'password': password,
        }),
      );

      final data = json.decode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        // Save token automatically
        _authToken = data['token'];
      }
      
      return data;
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }

  // ========== User Profile APIs ==========

  /// Get user profile
  Future<Map<String, dynamic>> getProfile() async {
    if (_authToken == null) {
      return {
        'success': false,
        'message': 'Not authenticated',
      };
    }

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/user/profile'),
        headers: {'Authorization': 'Bearer $_authToken'},
      );

      return json.decode(response.body);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }

  /// Update user profile
  Future<Map<String, dynamic>> updateProfile({
    String? fullName,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    if (_authToken == null) {
      return {
        'success': false,
        'message': 'Not authenticated',
      };
    }

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/user/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_authToken',
        },
        body: json.encode({
          if (fullName != null) 'fullName': fullName,
          if (farmName != null) 'farmName': farmName,
          if (phone != null) 'phone': phone,
          if (preferredLanguage != null) 'preferredLanguage': preferredLanguage,
        }),
      );

      return json.decode(response.body);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: $e',
      };
    }
  }
}
```

### Usage Example in Flutter:

```dart
// Initialize service
final apiService = AqaShrimpApiService();

// Signup
final signupResult = await apiService.signup(
  fullName: 'Farmer John',
  email: 'farmer@example.com',
  password: 'password123',
  farmName: 'Sunny Creek Farm',
  phone: '+1234567890',
  preferredLanguage: 'English',
);

if (signupResult['success']) {
  print('Signup successful! Token: ${apiService.getToken()}');
  print('User: ${signupResult['user']}');
} else {
  print('Signup failed: ${signupResult['message']}');
}

// Login
final loginResult = await apiService.login(
  email: 'farmer@example.com',
  password: 'password123',
);

if (loginResult['success']) {
  print('Login successful!');
}

// Get Profile
final profile = await apiService.getProfile();
if (profile['success']) {
  print('User profile: ${profile['user']}');
}

// Update Profile
final updateResult = await apiService.updateProfile(
  fullName: 'Updated Name',
  phone: '+9876543210',
  preferredLanguage: 'Telugu',
);

if (updateResult['success']) {
  print('Profile updated!');
}
```

---

## 🎯 API Endpoints Summary

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/` | GET | No | Health check |
| `/api/auth/signup` | POST | No | Create new account |
| `/api/auth/login` | POST | No | Login to account |
| `/api/user/profile` | GET | Yes | Get user profile |
| `/api/user/profile` | PUT | Yes | Update user profile |

---

## 🔐 Authentication Flow

1. **Signup** → Receive JWT token
2. **Store token** securely in your app
3. **Include token** in Authorization header for protected routes
4. **Token format:** `Authorization: Bearer YOUR_JWT_TOKEN`
5. **Token expiry:** 30 days (configurable)

---

## 📊 Expected Responses

### Success Response Format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **"Not authorized, no token"**
   - Make sure you include the Authorization header
   - Format: `Authorization: Bearer YOUR_TOKEN`

2. **"Invalid email or password"**
   - Check credentials are correct
   - Email is case-sensitive

3. **"User with this email already exists"**
   - Use a different email or login instead

4. **Network errors**
   - Check internet connection
   - Verify Vercel deployment is active

---

## 📈 Next Steps

1. ✅ API is deployed and working
2. ✅ All endpoints tested successfully
3. 📱 Integrate with your Flutter app
4. 🔐 Add environment variables in Vercel (if not done)
5. 🧪 Test from your mobile app
6. 🚀 Ready for production use!

---

## 📞 Support

For API issues or questions:
- Check `API_DOCUMENTATION.md` for detailed endpoint info
- Review `DEPLOYMENT.md` for deployment help
- Test endpoints using `api-tests.http` in VS Code

---

**Deployment Status:** ✅ Live  
**Base URL:** https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app  
**Last Tested:** December 14, 2025
