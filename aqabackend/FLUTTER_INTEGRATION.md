# Flutter Integration Guide

Complete guide to integrate the AQA Shrimp AI Backend API with your Flutter mobile application.

## 📦 Required Flutter Packages

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  shared_preferences: ^2.2.2
  provider: ^6.1.1  # For state management
```

Run:
```bash
flutter pub get
```

## 🔧 API Service Setup

### 1. Create API Config File

**lib/config/api_config.dart:**
```dart
class ApiConfig {
  // Development
  // static const String baseUrl = 'http://localhost:3001';
  
  // Production (Replace with your Vercel URL)
  static const String baseUrl = 'https://your-project.vercel.app';
  
  // Endpoints
  static const String signupEndpoint = '/api/auth/signup';
  static const String loginEndpoint = '/api/auth/login';
  static const String profileEndpoint = '/api/user/profile';
  
  // Headers
  static Map<String, String> headers = {
    'Content-Type': 'application/json',
  };
  
  static Map<String, String> authHeaders(String token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
}
```

### 2. Create User Model

**lib/models/user_model.dart:**
```dart
class User {
  final String id;
  final String fullName;
  final String farmName;
  final String email;
  final String phone;
  final String preferredLanguage;
  final DateTime createdAt;
  final DateTime? updatedAt;

  User({
    required this.id,
    required this.fullName,
    required this.farmName,
    required this.email,
    required this.phone,
    required this.preferredLanguage,
    required this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      fullName: json['fullName'],
      farmName: json['farmName'] ?? '',
      email: json['email'],
      phone: json['phone'] ?? '',
      preferredLanguage: json['preferredLanguage'] ?? 'English',
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'fullName': fullName,
      'farmName': farmName,
      'email': email,
      'phone': phone,
      'preferredLanguage': preferredLanguage,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }
}
```

### 3. Create API Response Model

**lib/models/api_response.dart:**
```dart
class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final String? token;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.token,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'],
      message: json['message'],
      data: json['user'] != null && fromJsonT != null
          ? fromJsonT(json['user'])
          : null,
      token: json['token'],
    );
  }
}
```

### 4. Create Auth Service

**lib/services/auth_service.dart:**
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/user_model.dart';
import '../models/api_response.dart';

class AuthService {
  // Signup
  Future<ApiResponse<User>> signup({
    required String fullName,
    required String email,
    required String password,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.signupEndpoint}'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'fullName': fullName,
          'email': email,
          'password': password,
          'farmName': farmName ?? '',
          'phone': phone ?? '',
          'preferredLanguage': preferredLanguage ?? 'English',
        }),
      );

      final jsonData = jsonDecode(response.body);

      if (response.statusCode == 201) {
        // Save token
        if (jsonData['token'] != null) {
          await _saveToken(jsonData['token']);
        }
        
        return ApiResponse.fromJson(
          jsonData,
          (json) => User.fromJson(json),
        );
      } else {
        return ApiResponse(
          success: false,
          message: jsonData['message'] ?? 'Signup failed',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  // Login
  Future<ApiResponse<User>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.loginEndpoint}'),
        headers: ApiConfig.headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final jsonData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        // Save token
        if (jsonData['token'] != null) {
          await _saveToken(jsonData['token']);
        }
        
        return ApiResponse.fromJson(
          jsonData,
          (json) => User.fromJson(json),
        );
      } else {
        return ApiResponse(
          success: false,
          message: jsonData['message'] ?? 'Login failed',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  // Get stored token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  // Save token
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  // Clear token (logout)
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
```

### 5. Create User Service

**lib/services/user_service.dart:**
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/user_model.dart';
import '../models/api_response.dart';
import 'auth_service.dart';

class UserService {
  final AuthService _authService = AuthService();

  // Get user profile
  Future<ApiResponse<User>> getProfile() async {
    try {
      final token = await _authService.getToken();
      
      if (token == null) {
        return ApiResponse(
          success: false,
          message: 'No authentication token found',
        );
      }

      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.profileEndpoint}'),
        headers: ApiConfig.authHeaders(token),
      );

      final jsonData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.fromJson(
          jsonData,
          (json) => User.fromJson(json),
        );
      } else {
        return ApiResponse(
          success: false,
          message: jsonData['message'] ?? 'Failed to fetch profile',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }

  // Update user profile
  Future<ApiResponse<User>> updateProfile({
    String? fullName,
    String? farmName,
    String? phone,
    String? preferredLanguage,
  }) async {
    try {
      final token = await _authService.getToken();
      
      if (token == null) {
        return ApiResponse(
          success: false,
          message: 'No authentication token found',
        );
      }

      final Map<String, dynamic> updateData = {};
      if (fullName != null) updateData['fullName'] = fullName;
      if (farmName != null) updateData['farmName'] = farmName;
      if (phone != null) updateData['phone'] = phone;
      if (preferredLanguage != null) {
        updateData['preferredLanguage'] = preferredLanguage;
      }

      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.profileEndpoint}'),
        headers: ApiConfig.authHeaders(token),
        body: jsonEncode(updateData),
      );

      final jsonData = jsonDecode(response.body);

      if (response.statusCode == 200) {
        return ApiResponse.fromJson(
          jsonData,
          (json) => User.fromJson(json),
        );
      } else {
        return ApiResponse(
          success: false,
          message: jsonData['message'] ?? 'Failed to update profile',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: $e',
      );
    }
  }
}
```

## 📱 UI Implementation Examples

### Login Screen

**lib/screens/login_screen.dart:**
```dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final response = await _authService.login(
      email: _emailController.text.trim(),
      password: _passwordController.text,
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (response.success && response.data != null) {
      // Navigate to home screen
      Navigator.of(context).pushReplacementNamed('/home');
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Welcome, ${response.data!.fullName}!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.message),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('Login'),
                ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pushNamed('/signup');
                },
                child: const Text('Create Account'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

### Signup Screen

**lib/screens/signup_screen.dart:**
```dart
import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({Key? key}) : super(key: key);

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _farmNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  
  String _selectedLanguage = 'English';
  bool _isLoading = false;

  final List<String> _languages = [
    'English',
    'Telugu',
    'Hindi',
    'Tamil',
    'Malayalam',
  ];

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Passwords do not match'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    final response = await _authService.signup(
      fullName: _fullNameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
      farmName: _farmNameController.text.trim(),
      phone: _phoneController.text.trim(),
      preferredLanguage: _selectedLanguage,
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (response.success) {
      Navigator.of(context).pushReplacementNamed('/home');
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account created successfully!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response.message),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _fullNameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name *',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your full name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _farmNameController,
                decoration: const InputDecoration(
                  labelText: 'Farm Name / Pond ID',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email *',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _phoneController,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedLanguage,
                decoration: const InputDecoration(
                  labelText: 'Preferred Language',
                  border: OutlineInputBorder(),
                ),
                items: _languages.map((lang) {
                  return DropdownMenuItem(value: lang, child: Text(lang));
                }).toList(),
                onChanged: (value) {
                  setState(() => _selectedLanguage = value!);
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password *',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _confirmPasswordController,
                decoration: const InputDecoration(
                  labelText: 'Confirm Password *',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please confirm your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSignup,
                  child: _isLoading
                      ? const CircularProgressIndicator()
                      : const Text('Create Account'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _farmNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }
}
```

### Profile Screen

**lib/screens/profile_screen.dart:**
```dart
import 'package:flutter/material.dart';
import '../services/user_service.dart';
import '../services/auth_service.dart';
import '../models/user_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _userService = UserService();
  final _authService = AuthService();
  User? _user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    
    final response = await _userService.getProfile();
    
    if (response.success && response.data != null) {
      setState(() {
        _user = response.data;
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(response.message)),
      );
    }
  }

  Future<void> _handleLogout() async {
    await _authService.logout();
    if (!mounted) return;
    Navigator.of(context).pushReplacementNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              // Navigate to edit profile screen
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _user == null
              ? const Center(child: Text('Failed to load profile'))
              : RefreshIndicator(
                  onRefresh: _loadProfile,
                  child: ListView(
                    padding: const EdgeInsets.all(16.0),
                    children: [
                      _buildInfoCard('Full Name', _user!.fullName),
                      _buildInfoCard('Farm Name', _user!.farmName),
                      _buildInfoCard('Email', _user!.email),
                      _buildInfoCard('Phone', _user!.phone),
                      _buildInfoCard('Language', _user!.preferredLanguage),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _handleLogout,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                        ),
                        child: const Text('Logout'),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInfoCard(String label, String value) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
        subtitle: Text(
          value.isEmpty ? 'Not provided' : value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }
}
```

## 🔄 Auto-Login Implementation

**lib/main.dart:**
```dart
import 'package:flutter/material.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AQA Shrimp AI',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const SplashScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/signup': (context) => const SignupScreen(),
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    // Wait a moment for splash effect
    await Future.delayed(const Duration(seconds: 2));

    final isLoggedIn = await _authService.isLoggedIn();

    if (!mounted) return;

    if (isLoggedIn) {
      Navigator.of(context).pushReplacementNamed('/home');
    } else {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FlutterLogo(size: 100),
            SizedBox(height: 24),
            Text(
              'AQA Shrimp AI',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
```

## 🧪 Testing

1. **Test on Android Emulator:**
   - Use `10.0.2.2:3001` instead of `localhost:3001`
   - Update `ApiConfig.baseUrl`

2. **Test on iOS Simulator:**
   - Use `localhost:3001` directly

3. **Test on Physical Device:**
   - Ensure device and computer are on same network
   - Use computer's IP address (e.g., `http://192.168.1.100:3001`)

## 📝 Best Practices

1. **Error Handling:** Always show user-friendly messages
2. **Loading States:** Use CircularProgressIndicator during API calls
3. **Token Management:** Clear token on 401 errors
4. **Validation:** Validate forms before API calls
5. **Network Errors:** Handle offline scenarios gracefully

## 🚀 Production Checklist

- [ ] Update `ApiConfig.baseUrl` with production URL
- [ ] Add proper error logging
- [ ] Implement token refresh mechanism
- [ ] Add network connectivity checks
- [ ] Implement retry logic for failed requests
- [ ] Add analytics tracking
- [ ] Test on multiple devices
- [ ] Handle deep linking
- [ ] Implement biometric authentication (optional)

---

**For support, refer to the main README.md**
