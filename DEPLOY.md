# Deploy PassKeep to Vercel

Complete guide to deploy PassKeep to Vercel and connect it to Supabase.

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com) - free tier available)
- A Supabase account (sign up at [supabase.com](https://supabase.com) - free tier available)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: PassKeep (or your preferred name)
   - **Database Password**: Choose a strong password (save it securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient

4. Wait for project creation (1-2 minutes)

### 1.2 Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")

### 1.3 Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase-schema.sql` from this repository
4. Copy the entire contents and paste into SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### 1.4 Configure Supabase Authentication (Optional but Recommended)

1. Go to **Authentication** → **Settings**
2. Under **"Site URL"**, add your Vercel URL (you'll get this after deployment):
   - Format: `https://your-project.vercel.app`
3. Under **"Redirect URLs"**, add:
   - `https://your-project.vercel.app/**`
   - `http://localhost:3000/**` (for local development)

## Step 2: Prepare Your Code for Deployment

### 2.1 Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - PassKeep with Supabase"
```

### 2.2 Push to GitHub

1. Create a new repository on GitHub
2. Push your code:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Select your repository
   - Click **"Import"**

### 3.2 Configure Build Settings

Vercel should auto-detect Vite, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables

**IMPORTANT**: Add these before deploying!

1. In Vercel project settings, go to **"Environment Variables"**
2. Add the following variables:

   **Variable 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase Project URL (from Step 1.2)
   - **Environments**: Production, Preview, Development (select all)

   **Variable 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key (from Step 1.2)
   - **Environments**: Production, Preview, Development (select all)

3. Click **"Save"** after adding each variable

### 3.4 Deploy

1. Click **"Deploy"** button
2. Wait for deployment to complete (usually 1-2 minutes)
3. Once deployed, you'll see: **"Congratulations! Your project has been deployed."**

### 3.5 Get Your Deployment URL

After deployment, Vercel will show your project URL:
- Format: `https://your-project-name.vercel.app`
- Copy this URL - you'll need it for Supabase configuration

## Step 4: Connect Supabase to Your Vercel Deployment

### 4.1 Update Supabase Site URL

1. Go back to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Under **"Site URL"**, add your Vercel URL:
   ```
   https://your-project-name.vercel.app
   ```

### 4.2 Update Redirect URLs

1. Still in **Authentication** → **Settings**
2. Under **"Redirect URLs"**, add:
   ```
   https://your-project-name.vercel.app/**
   ```
3. Click **"Save"**

## Step 5: Test Your Deployment

1. Open your Vercel deployment URL in a browser
2. Test the following:
   - ✅ Register a new account
   - ✅ Login with your credentials
   - ✅ Add a password entry
   - ✅ View a password (with master password)
   - ✅ Edit/Delete passwords

## Step 6: Set Up Custom Domain (Optional)

1. In Vercel project settings, go to **"Domains"**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update Supabase redirect URLs to include your custom domain

## Troubleshooting

### "Missing Supabase environment variables" Error

**Problem**: App shows error about missing environment variables

**Solution**:
1. Check Vercel project settings → Environment Variables
2. Ensure variables are named exactly:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Make sure they're enabled for all environments
4. Redeploy after adding variables

### "Failed to fetch passwords" Error

**Problem**: Can't load passwords after login

**Solution**:
1. Verify database schema was created in Supabase SQL Editor
2. Check browser console for detailed errors
3. Verify RLS policies are active (Supabase → Authentication → Policies)
4. Check Supabase project is active (not paused)

### Authentication Not Working

**Problem**: Can't login or register

**Solution**:
1. Check Supabase Site URL matches your Vercel URL
2. Verify Redirect URLs include your Vercel domain
3. Check Supabase project status (not paused)
4. Review browser console for errors
5. Verify environment variables are set correctly in Vercel

### CORS Errors

**Problem**: CORS errors in browser console

**Solution**:
1. In Supabase dashboard → Settings → API
2. Check "CORS" settings
3. Add your Vercel domain to allowed origins
4. Or use wildcard: `*` (less secure, but works for development)

### Database Connection Issues

**Problem**: Can't connect to Supabase database

**Solution**:
1. Verify Supabase project is active
2. Check project status in Supabase dashboard
3. Verify you're using correct Project URL (not anon key)
4. Check Supabase service status: [status.supabase.com](https://status.supabase.com)

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Vercel will automatically build and deploy

## Environment Variables for Different Environments

You can set different environment variables for:
- **Production**: Your main deployment
- **Preview**: Pull request previews
- **Development**: Local development (use `.env` file)

To update environment variables:
1. Go to Vercel project → Settings → Environment Variables
2. Edit or add variables
3. Redeploy to apply changes

## Monitoring and Logs

### View Deployment Logs

1. In Vercel dashboard, go to your project
2. Click on a deployment
3. View build logs and runtime logs

### Monitor Supabase Usage

1. Go to Supabase dashboard
2. Check **"Usage"** tab for:
   - Database size
   - API requests
   - Bandwidth usage
   - Active users

## Security Checklist

Before going to production:

- [ ] Environment variables set in Vercel
- [ ] Supabase Site URL configured
- [ ] Redirect URLs configured in Supabase
- [ ] Database schema created
- [ ] RLS policies active
- [ ] Email confirmation enabled (optional but recommended)
- [ ] Custom domain configured (if using)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Regular backups enabled in Supabase

## Next Steps

- Set up monitoring and alerts
- Configure custom domain
- Enable email confirmation in Supabase
- Set up automated backups
- Review security settings
- Monitor usage and performance

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)

