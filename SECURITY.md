# Security Features

PassKeep implements multiple layers of security to protect your passwords and account information.

## Authentication Security

### Supabase Auth
- **Built-in Security**: Uses Supabase Auth which includes:
  - Bcrypt password hashing (automatic)
  - Rate limiting (built-in protection against brute force attacks)
  - Secure session management with JWT tokens
  - PKCE flow for enhanced OAuth security
  - Automatic token refresh
  - Secure cookie handling

### Password Requirements
- **Minimum 12 characters**: Longer passwords are harder to crack
- **Uppercase letters**: Must contain at least one uppercase letter
- **Lowercase letters**: Must contain at least one lowercase letter
- **Numbers**: Must contain at least one number
- **Special characters**: Must contain at least one special character
- **Common password detection**: Blocks commonly used weak passwords

### Login Security
- **Rate Limiting**: Supabase automatically limits login attempts to prevent brute force attacks
- **Secure Error Messages**: Error messages don't reveal whether an email exists or not
- **Session Management**: Secure JWT tokens with automatic refresh
- **Password Visibility Toggle**: Users can verify they're typing the correct password

## Data Encryption

### Master Password Encryption
- **AES Encryption**: All stored passwords are encrypted using AES encryption
- **Master Password**: Each user sets a master password that encrypts/decrypts their stored passwords
- **Client-Side Encryption**: Passwords are encrypted before being sent to the database
- **Zero-Knowledge Architecture**: The server never sees unencrypted passwords

### Database Security

#### Row Level Security (RLS)
- **User Isolation**: Each user can only access their own passwords
- **Automatic Enforcement**: Supabase RLS policies ensure data isolation
- **No Cross-User Access**: Impossible for users to access other users' data

#### Database Schema
- **Encrypted Storage**: Only encrypted passwords are stored in the database
- **No Plaintext**: Passwords are never stored in plaintext
- **Secure Indexing**: Indexes are optimized for performance without compromising security

## Application Security

### Input Validation
- **Client-Side Validation**: Immediate feedback for user input
- **Server-Side Validation**: Supabase enforces data constraints
- **SQL Injection Protection**: Supabase uses parameterized queries automatically
- **XSS Protection**: React automatically escapes user input

### Session Security
- **Secure Storage**: Sessions stored securely in localStorage
- **Automatic Expiration**: Sessions expire after inactivity
- **Token Refresh**: Automatic token refresh prevents session hijacking
- **Logout**: Complete session cleanup on logout

### Network Security
- **HTTPS Required**: All communication uses HTTPS (enforced by Supabase)
- **Secure Headers**: Supabase sets appropriate security headers
- **CORS Protection**: Cross-origin requests are properly handled

## Best Practices Implemented

1. **Never Log Passwords**: Passwords are never logged in console or server logs
2. **Secure Password Generation**: Uses cryptographically secure random number generation
3. **Error Handling**: Secure error messages that don't leak information
4. **Input Sanitization**: All inputs are trimmed and validated
5. **Type Safety**: Proper validation of all data types

## Additional Security Recommendations

### For Production Deployment

1. **Enable Email Confirmation**: 
   - In Supabase Dashboard > Authentication > Settings
   - Enable "Enable email confirmations"

2. **Enable MFA/2FA**:
   - Supabase supports TOTP-based 2FA
   - Consider enabling for additional security

3. **Set Up Rate Limiting**:
   - Supabase has built-in rate limiting
   - Configure additional limits if needed in Supabase Dashboard

4. **Regular Security Audits**:
   - Review Supabase security updates
   - Keep dependencies updated
   - Monitor for suspicious activity

5. **Backup Strategy**:
   - Set up regular database backups in Supabase
   - Test restore procedures

6. **Environment Variables**:
   - Never commit `.env` files
   - Use secure secret management
   - Rotate keys regularly

## Security Checklist

- ✅ Strong password requirements
- ✅ Bcrypt password hashing (via Supabase)
- ✅ JWT token authentication
- ✅ AES encryption for stored passwords
- ✅ Rate limiting (via Supabase)
- ✅ Input validation
- ✅ Row Level Security (RLS)
- ✅ Secure password generation
- ✅ Secure session management
- ✅ HTTPS enforcement
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ Secure error messages

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:
1. Do not open a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

