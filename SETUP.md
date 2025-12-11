# PassKeep Setup Guide

Complete setup guide for PassKeep password manager with Supabase.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: PassKeep (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

5. Wait for project to be created (takes 1-2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")

## Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this repository
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates:
- `passwords` table for storing encrypted passwords
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic timestamp updates

## Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in a text editor

3. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   Replace with your actual values from Step 2.

4. Save the file

## Step 5: Install Dependencies

```bash
npm install
```

This installs:
- React and React DOM
- Vite
- Supabase JavaScript client
- CryptoJS for encryption

## Step 6: Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

## Step 7: Test the Application

1. **Register a new account**:
   - Click "Register"
   - Enter email and password
   - Password must be at least 12 characters with uppercase, lowercase, number, and special character
   - Click "Register"

2. **Login**:
   - Enter your credentials
   - Click "Sign In"

3. **Add a password**:
   - Click "Add Password"
   - Enter master password (this encrypts your stored passwords)
   - Fill in website, username, and password
   - Click "Save"

4. **View password**:
   - Click "View" on any password entry
   - Enter master password when prompted
   - Password will be decrypted and displayed

## Optional: Enable Email Confirmation (Production)

For production use, enable email confirmation:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under "Email Auth", enable **"Enable email confirmations"**
3. Configure email templates if needed

## Optional: Enable Two-Factor Authentication

Supabase supports TOTP-based 2FA:

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Enable **"Enable TOTP"**
3. Users can enable 2FA in their account settings

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variables start with `VITE_`
- Restart dev server after creating `.env`

### "Failed to fetch passwords"
- Verify database schema was created (check Supabase SQL Editor)
- Check browser console for detailed errors
- Verify RLS policies are active (Supabase → Authentication → Policies)

### "Invalid login credentials"
- Check that email is confirmed (if email confirmation is enabled)
- Verify password meets requirements
- Check Supabase dashboard for any service issues

### Database connection issues
- Verify Supabase project is active
- Check project status in Supabase dashboard
- Ensure you're using the correct project URL

## Security Checklist

Before deploying to production:

- [ ] Enable email confirmation in Supabase
- [ ] Set up proper CORS settings in Supabase
- [ ] Enable automatic backups in Supabase
- [ ] Review and test RLS policies
- [ ] Set up monitoring and alerts
- [ ] Use environment variables (never commit `.env`)
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Review security settings in Supabase dashboard

## Next Steps

- Read [SECURITY.md](./SECURITY.md) for security best practices
- Review [README.md](./README.md) for deployment instructions
- Customize the UI to match your brand
- Add additional features as needed

## Support

- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: Open an issue in this repository

