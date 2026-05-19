# 🚀 Quick API Reference

**Production URL:** https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app

---

## Quick cURL Commands

### 1. Health Check
```bash
curl https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/
```

### 2. Signup
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Your Name","email":"your@email.com","password":"password123"}'
```

### 3. Login
```bash
curl -X POST https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"password123"}'
```

### 4. Get Profile (Replace TOKEN)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile
```

### 5. Update Profile (Replace TOKEN)
```bash
curl -X PUT https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app/api/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"fullName":"New Name","phone":"+1234567890"}'
```

---

## Request/Response Examples

### Signup Request
```json
{
  "fullName": "Farmer John",
  "farmName": "Sunny Creek Farm",
  "email": "farmer@example.com",
  "phone": "+1234567890",
  "preferredLanguage": "English",
  "password": "password123"
}
```

### Signup Response
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Farmer John",
    "email": "farmer@example.com",
    ...
  }
}
```

---

## Flutter Quick Setup

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

const String baseUrl = 'https://aqabackend-9llxvgslt-adithyavennas-projects.vercel.app';

// Signup
final response = await http.post(
  Uri.parse('$baseUrl/api/auth/signup'),
  headers: {'Content-Type': 'application/json'},
  body: json.encode({
    'fullName': 'Your Name',
    'email': 'your@email.com',
    'password': 'password123',
  }),
);

// Login
final response = await http.post(
  Uri.parse('$baseUrl/api/auth/login'),
  headers: {'Content-Type': 'application/json'},
  body: json.encode({
    'email': 'your@email.com',
    'password': 'password123',
  }),
);

final data = json.decode(response.body);
String token = data['token'];

// Get Profile
final response = await http.get(
  Uri.parse('$baseUrl/api/user/profile'),
  headers: {'Authorization': 'Bearer $token'},
);
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 500 | Server Error |

---

## All Documentation Files

- `API_DOCUMENTATION.md` - Complete API reference with all details
- `TESTING_GUIDE.md` - Step-by-step testing instructions
- `QUICK_REFERENCE.md` - This file - Quick command reference
- `api-tests.http` - VS Code REST Client tests
- `DEPLOYMENT.md` - Deployment instructions

---

**🎯 Ready to use!** All APIs are tested and working on Vercel.
