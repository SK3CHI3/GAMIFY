# Setup Guide

Complete guide for setting up GOALDEN on your local machine and preparing for production deployment.

## Prerequisites

### Required Software

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Required Accounts

- **Supabase**: Free account for database and backend
- **Vercel**: Free account for deployment
- **GitHub**: For code repository

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SK3CHI3/GAMIFY.git
cd GAMIFY
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- ShadCN UI components
- And other dependencies

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # If example exists
```

Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Future Integrations (Optional for now)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
```

### 4. Supabase Setup

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Sign in or create account
   - Click "New Project"
   - Choose organization
   - Set project name and database password
   - Select region closest to users
   - Wait for project creation

2. **Configure Project Settings**
   - Go to Settings → API
   - Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up Database Schema**
   - Go to SQL Editor in Supabase
   - Run the schema migrations (if provided)
   - Or use MCP tools to set up schema

4. **Configure Authentication**
   - Go to Authentication → Settings
   - Enable Email provider
   - Configure email templates
   - Set up redirect URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`

5. **Create Storage Buckets**
   - Go to Storage
   - Create bucket: `match-screenshots` (public)
   - Create bucket: `tournament-media` (public)
   - Set up bucket policies

6. **Enable Row Level Security**
   - Ensure RLS is enabled on all tables
   - Policies should be configured automatically

### 5. Run Database Migrations

If using Supabase MCP:

```bash
# MCP tools will handle migrations
# Or run SQL scripts manually in Supabase SQL Editor
```

### 6. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 7. Create Admin User

1. Sign up normally through the app
2. In Supabase Dashboard:
   - Go to Authentication → Users
   - Find your user
   - Click "Edit User"
   - Update `raw_app_meta_data` → `role: admin`
   - Save changes

Or use Supabase MCP:

```typescript
// Update profile role
await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('email', 'your-email@example.com')
```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   - In Vercel project settings
   - Add all `.env.local` variables
   - Use production Supabase URL
   - Set `NEXT_PUBLIC_SITE_URL` to your domain

4. **Deploy**
   - Vercel auto-deploys on push
   - Or click "Deploy" manually

5. **Configure Custom Domain** (Optional)
   - Add domain in Vercel settings
   - Follow DNS configuration steps
   - SSL certificates auto-generated

### Option 2: Railway

1. **Connect Repository**
   - Go to https://railway.app
   - Sign in with GitHub
   - New Project → GitHub Repo

2. **Configure Environment**
   - Add environment variables
   - Set Node.js version to 18+
   - Configure build/start commands

3. **Deploy**
   - Railway auto-detects Next.js
   - Automatic deployment on push

## Post-Deployment Setup

### 1. Update Supabase Auth URLs

- Production redirect URL in Supabase
- Update `NEXT_PUBLIC_SITE_URL` to production domain

### 2. Verify Email Settings

- Test email confirmation flow
- Verify email templates
- Check spam folders

### 3. Test Core Features

- [ ] Sign up new user
- [ ] Email confirmation
- [ ] Admin login
- [ ] Tournament creation
- [ ] Registration flow
- [ ] Match submission
- [ ] Dispute resolution
- [ ] Chat functionality

### 4. Configure Monitoring

- Set up error tracking
- Configure analytics
- Set up uptime monitoring

## Database Management

### Backup Strategy

1. **Automatic Backups**
   - Supabase provides daily backups
   - Retention: 7 days (free tier)

2. **Manual Backups**
   ```bash
   # Export via Supabase Dashboard
   # Or use pg_dump command
   ```

### Migration Management

- Store migrations in `/supabase/migrations`
- Test locally before deploying
- Use version control for schema changes

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- GitLens
- Supabase

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate types (if available)
npm run db:push      # Push schema changes

# Testing
npm run test         # Run tests (when implemented)
npm run test:watch   # Watch mode

# Build analysis
npm run analyze      # Bundle analyzer
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill
   ```

2. **Module Not Found**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are correct

4. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

5. **TypeScript Errors**
   ```bash
   # Regenerate database types
   # Or check tsconfig.json configuration
   ```

### Getting Help

- Check [Troubleshooting Guide](./20-TROUBLESHOOTING.md)
- Review [Supabase Documentation](https://supabase.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Open GitHub issue

## Next Steps

1. Read [Architecture](./02-ARCHITECTURE.md)
2. Review [Tournament System](./06-TOURNAMENT-SYSTEM.md)
3. Set up [Email Configuration](./19-EMAIL-SETUP.md)
4. Configure [Integrations](./18-INTEGRATION-GUIDE.md)

---

**Last Updated**: January 2025  
**Version**: 1.0

