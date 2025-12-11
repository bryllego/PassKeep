# PassKeep - Secure Password Manager

🔒 **PassKeep** is a modern, secure password manager built with Vite + React frontend and Supabase backend. Safely store, manage, and retrieve your passwords with enterprise-grade security features.

## Description

PassKeep is a full-stack web application that helps you securely manage your passwords. Built with Supabase for authentication and database, PassKeep implements multiple layers of security to ensure your sensitive data remains protected.

**Key Features:**
- 🔐 **Secure Authentication**: Supabase Auth with strong password requirements and bcrypt hashing
- 🛡️ **Advanced Encryption**: AES encryption for stored passwords using a master password
- 🚀 **Modern Tech Stack**: Built with React and Vite for a fast, responsive user experience
- 🔑 **JWT Tokens**: Secure session management with automatic token refresh
- 🛡️ **Attack Protection**: Built-in rate limiting to prevent brute force attacks
- 🔒 **Row Level Security**: Database-level security with Supabase RLS policies
- ✨ **Clean UI**: Beautiful, intuitive interface for managing your passwords

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

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd passkeep-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Set up the database**:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase-schema.sql` to create the necessary tables and policies

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   - Navigate to `http://localhost:3000`

### Usage

1. **Register**: Create a new account with a strong password
2. **Login**: Sign in with your credentials
3. **Set Master Password**: When you first add a password, you'll be prompted for a master password (this encrypts/decrypts your stored passwords)
4. **Add Passwords**: Store passwords for websites/services
5. **View Passwords**: Click "View" to decrypt and see a password (requires master password)
6. **Edit/Delete**: Manage your stored passwords

## Project Structure

```
passkeep/
├── src/
│   ├── lib/
│   │   └── supabase.js       # Supabase client and utilities
│   ├── components/
│   │   ├── Login.jsx         # Login component
│   │   ├── Register.jsx     # Registration component
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── PasswordList.jsx # Password list display
│   │   └── PasswordModal.jsx # Add/edit password modal
│   ├── App.jsx               # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── supabase-schema.sql      # Database schema and RLS policies
├── .env.example             # Environment variables template
├── index.html
├── vite.config.js
└── package.json
```

## Database Schema

The application uses Supabase PostgreSQL with the following structure:

- **passwords table**: Stores encrypted passwords with Row Level Security
- **RLS Policies**: Ensures users can only access their own passwords
- **Automatic timestamps**: Created and updated timestamps are managed automatically

See `supabase-schema.sql` for the complete schema.

## Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Set Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

4. **Deploy**:
   - Vercel will automatically deploy on every push to main
   - Or trigger a manual deployment

### Deploying to Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Other Platforms

Any platform that supports static site hosting with environment variables will work:
- GitHub Pages (with environment variable support)
- Cloudflare Pages
- AWS Amplify
- Any static hosting service

## Supabase Configuration

### Authentication Settings

Recommended settings in Supabase Dashboard > Authentication:

1. **Email Confirmation**: Enable for production (optional for development)
2. **Password Requirements**: Already enforced by client-side validation
3. **Rate Limiting**: Enabled by default in Supabase
4. **Session Duration**: Configure as needed (default is good)

### Database Settings

1. **Row Level Security**: Already enabled via schema
2. **Backups**: Enable automatic backups in Supabase dashboard
3. **Connection Pooling**: Use Supabase connection pooling for production

## Security Best Practices

- ✅ Password strength requirements
- ✅ Bcrypt password hashing (via Supabase)
- ✅ JWT token authentication
- ✅ AES encryption for stored passwords
- ✅ Rate limiting (via Supabase)
- ✅ Row Level Security (RLS)
- ✅ Input validation
- ✅ Secure password generation
- ✅ Protection against timing attacks
- ✅ No password disclosure in error messages
- ✅ HTTPS enforcement
- ✅ SQL injection protection (via Supabase)
- ✅ XSS protection (via React)

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you've created a `.env` file with your Supabase credentials
- Check that variable names start with `VITE_`
- Restart the dev server after adding environment variables

### "Failed to fetch passwords" error
- Verify your Supabase project is active
- Check that you've run the SQL schema in Supabase SQL Editor
- Ensure RLS policies are correctly set up

### Authentication issues
- Check Supabase dashboard for any service issues
- Verify your Supabase URL and key are correct
- Check browser console for detailed error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- Check the [SECURITY.md](./SECURITY.md) for security-related questions
- Review Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Open an issue on GitHub
