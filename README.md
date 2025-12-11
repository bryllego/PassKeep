# PassKeep - Secure Password Manager

**PassKeep** is a modern, secure password manager built with Vite + React frontend and Supabase backend. Safely store, manage, and retrieve your passwords with enterprise-grade security features.

## Description

PassKeep is a full-stack web application that helps you securely manage your passwords. Built with Supabase for authentication and database, PassKeep implements multiple layers of security to ensure your sensitive data remains protected.

**Key Features:**
-  **Secure Authentication**: Supabase Auth with strong password requirements and bcrypt hashing
-  **Advanced Encryption**: AES encryption for stored passwords using a master password
-  **Modern Tech Stack**: Built with React and Vite for a fast, responsive user experience
-  **JWT Tokens**: Secure session management with automatic token refresh
-  **Attack Protection**: Built-in rate limiting to prevent brute force attacks
-  **Row Level Security**: Database-level security with Supabase RLS policies
-  **Clean UI**: Beautiful, intuitive interface for managing your passwords

**Perfect for:**
- Personal password management
- Learning secure authentication practices
- Understanding encryption and security best practices
- Production-ready password management solutions

## Security Features

- **Strong Password Requirements**: Minimum 12 characters with uppercase, lowercase, numbers, and special characters
- **Bcrypt Hashing**: User passwords are hashed with bcrypt (handled by Supabase)
- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **AES Encryption**: Stored passwords are encrypted using AES encryption with master password
- **Rate Limiting**: Built-in protection against brute force attacks (via Supabase)
- **Row Level Security**: Database-level access control ensuring users can only access their own data
- **Input Validation**: Client-side and server-side validation for all inputs
- **Secure Session Management**: JWT tokens with automatic refresh
- **PKCE Flow**: Enhanced security for authentication flows

See [SECURITY.md](./SECURITY.md) for detailed security documentation.
