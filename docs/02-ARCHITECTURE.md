# GOALDEN Architecture

## System Overview

GOALDEN is built as a modern, full-stack web application using Next.js 15 with a focus on mobile-first Progressive Web App (PWA) capabilities. The architecture is designed for scalability, real-time functionality, and seamless user experience.

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
  - React 18 with Server Components
  - TypeScript for type safety
  - Server Actions for mutations
  - App Router for file-based routing

- **Styling**: 
  - Tailwind CSS for utility-first styling
  - ShadCN UI component library
  - Custom CSS variables for theming
  - Framer Motion for animations

- **State Management**:
  - React hooks (useState, useEffect, useContext)
  - React Query (future)
  - Local storage for PWA caching

- **PWA Features**:
  - Service Worker for offline capability
  - Web App Manifest
  - Push notifications (future)

### Backend

- **Database**: Supabase (PostgreSQL)
  - Row Level Security (RLS) policies
  - Database triggers
  - Real-time subscriptions
  - Edge functions (future)

- **Authentication**: Supabase Auth
  - Email/password
  - Phone authentication
  - PKCE flow for security
  - Session management

- **Storage**: Supabase Storage
  - Match screenshots
  - Tournament posters
  - Image optimization

- **Real-time**: Supabase Realtime
  - Tournament chat
  - Match status updates
  - Live bracket updates

### Infrastructure

- **Hosting**: Vercel (Primary)
  - Automatic deployments
  - Edge functions
  - Global CDN
  - Analytics

- **Alternative**: Railway
  - Docker-based deployments
  - Database hosting
  - Environment management

## Application Architecture

### Client-Side Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── callback/      # Email verification
│   ├── admin/             # Admin dashboard
│   │   ├── dashboard/
│   │   ├── tournaments/
│   │   └── disputes/
│   ├── dashboard/         # Player dashboard
│   │   ├── matches/       # Match submissions
│   │   └── tournaments/   # Tournament views
│   ├── actions/           # Server Actions
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # ShadCN components
│   ├── admin/             # Admin-specific
│   ├── dashboard/         # Dashboard tabs
│   ├── tournaments/       # Tournament features
│   ├── matches/           # Match features
│   └── layout/            # Navigation
└── lib/                   # Utilities
    ├── supabase/          # Supabase clients
    ├── bracket-generator.ts
    ├── database.types.ts
    └── utils.ts
```

### Server-Side Architecture

```
Server Actions (src/app/actions/)
├── auth.ts               # Authentication
│   ├── signUp()
│   ├── signIn()
│   ├── signOut()
│   └── getCurrentUser()
├── tournaments.ts        # Tournament management
│   ├── createTournament()
│   ├── registerForTournament()
│   └── startTournament()
└── matches.ts            # Match management
    ├── submitMatchResult()
    ├── verifyMatchResults()
    ├── resolveDispute()
    └── advanceToNextRound()
```

## Data Flow

### Tournament Flow

```
Admin Dashboard
  ↓
Create Tournament
  ↓
Store in Database (tournaments table)
  ↓
Display to Players
  ↓
Player Registration (registrations table)
  ↓
Admin Starts Tournament
  ↓
Generate Bracket (matches table)
  ↓
Match Execution
  ↓
Result Submission
  ↓
Verification/Dispute
  ↓
Winner Advancement
  ↓
Tournament Complete
```

### Match Flow

```
Match Assigned
  ↓
Status: ongoing, Deadline: 10min
  ↓
Both Players Submit
  ↓
Verify Results
  ├── Scores Agree → Complete
  ├── Scores Mismatch → Dispute
  └── Draw → Replay Match
  ↓
Update Stats
  ↓
Advance Winner
```

### Authentication Flow

```
User Signs Up
  ↓
Email Verification
  ↓
Create Profile (handle_new_user trigger)
  ↓
Initialize Stats (player_stats table)
  ↓
Session Created
  ↓
Middleware Validates
  ↓
Access Granted
```

## Database Architecture

### Core Tables

#### `profiles`
- Extends Supabase auth
- User metadata
- Role (player/admin)
- Phone verification

#### `tournaments`
- Tournament configuration
- Status tracking
- Prize pool calculation
- Poster URL

#### `registrations`
- Player-tournament relationships
- Payment status
- Elimination tracking
- Position finished

#### `matches`
- Match details
- Scores and screenshots
- Status (pending/ongoing/completed)
- Deadlines
- Winner tracking

#### `disputes`
- Conflict resolution
- Admin review
- Resolution tracking

#### `player_stats`
- Win/loss records
- Earnings
- Tournament history

#### `chat_messages`
- Tournament discussions
- Real-time messaging

### Relationships

```
profiles (1) ──┐
               ├──> (many) registrations
tournaments (1)─┘

tournaments (1) ────> (many) matches
tournaments (1) ────> (many) chat_messages

matches (1) ────> (1) disputes (optional)

profiles (1) ────> (1) player_stats
```

### Storage Buckets

- `match-screenshots`: Player-submitted result images
- `tournament-media`: Tournament posters and assets

## Security Architecture

### Authentication & Authorization

1. **Supabase Auth**
   - PKCE flow for email confirmation
   - JWT tokens for sessions
   - Refresh token rotation

2. **Row Level Security (RLS)**
   - Database-level access control
   - User can only access their data
   - Admin policies for management

3. **Middleware Protection**
   - Route guards for protected pages
   - Token refresh automation
   - Redirect for unauthorized access

### Data Validation

1. **Client-Side**
   - Form validation
   - Input sanitization
   - TypeScript type checking

2. **Server-Side**
   - Server Action validation
   - Database constraints
   - File upload limits (5MB)

3. **Anti-Fraud**
   - One account per phone
   - Unique constraints
   - Screenshot requirements

## Real-Time Architecture

### Supabase Realtime

```
Database Changes
  ↓
Postgres Notifications
  ↓
Supabase Realtime Service
  ↓
WebSocket Connection
  ↓
Client Updates (React)
  ↓
UI Re-renders
```

### Channels

1. **Tournament Chat**: `tournament-{tournamentId}`
   - New messages
   - Player presence

2. **Match Updates** (future):
   - Score submissions
   - Status changes

## Performance Optimizations

### Frontend

1. **Code Splitting**
   - Dynamic imports
   - Lazy loading
   - Route-based splitting

2. **Image Optimization**
   - Next.js Image component
   - Automatic format conversion
   - Responsive images

3. **Caching**
   - Static page generation
   - ISR (Incremental Static Regeneration)
   - PWA service worker

### Backend

1. **Database**
   - Indexed queries
   - Connection pooling
   - Query optimization

2. **API**
   - Server Components for SSR
   - Edge functions for low latency
   - Response compression

## Deployment Architecture

### Production Environment

```
GitHub Repository
  ↓
Vercel Auto-Deploy
  ↓
Next.js Build
  ↓
Edge Network Distribution
  ↓
Users (Global)
```

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# App
NEXT_PUBLIC_SITE_URL

# Integrations (Future)
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
```

## Monitoring & Analytics

### Current

- Vercel Analytics
- Supabase Dashboard
- Browser DevTools

### Planned

- Sentry for error tracking
- Custom analytics dashboard
- Performance monitoring
- User behavior analytics

## Scalability Considerations

### Current Capacity

- ~1000 concurrent users
- ~100 tournaments/month
- ~10,000 matches/month

### Scaling Plan

1. **Horizontal Scaling**
   - Multiple Vercel instances
   - Database read replicas
   - CDN caching

2. **Database Optimization**
   - Partitioning old data
   - Archiving completed tournaments
   - Query optimization

3. **Caching Strategy**
   - Redis for sessions
   - Edge caching
   - Database query cache

## Development Workflow

### Local Development

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code quality
```

### CI/CD Pipeline

```
Git Push → GitHub
  ↓
Automated Tests
  ↓
Build Check
  ↓
Deploy to Vercel
  ↓
Production Ready
```

## Future Architecture Enhancements

### Phase 2

- [ ] Microservices migration
- [ ] Separate API layer
- [ ] Event-driven architecture
- [ ] Message queue (Redis/RabbitMQ)

### Phase 3

- [ ] Multi-region deployment
- [ ] Database sharding
- [ ] GraphQL API
- [ ] WebRTC for live streaming

---

**Last Updated**: January 2025  
**Version**: 1.0

