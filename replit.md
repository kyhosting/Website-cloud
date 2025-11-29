# KIFZLDEV NEO-2025 Bot Hosting Platform

## Project Status

### Completed Features ✅
- **Authentication System Refactor**: 
  - Replaced Replit OAuth with Google OAuth + Email OTP via Telegram
  - Session-based auth with PostgreSQL storage
  - Two login methods: Google & Email+OTP (Telegram verification)
- **Google OAuth Credentials**: Added and configured with dynamic redirect URI
- **New Auth Routes**:
  - `/api/auth/google` - Google OAuth redirect
  - `/api/auth/google/callback` - Google callback handler
  - `/api/auth/email/request-otp` - Request OTP code
  - `/api/auth/email/verify-otp` - Verify OTP code
  - `/api/logout` - Session logout
- **New Frontend Pages**:
  - `/login` - Login options (Google + Email OTP)
  - `/login/email` - Email + OTP verification form
  - `/dashboard` - User bot dashboard
  - `/kifzldev` - Admin dashboard (with full stats)
  - `/kifzldev/users` - Manage all users
  - `/kifzldev/payments` - QRIS payment validation
  - `/kifzldev/bots` - List all bots
  - `/kifzldev/premium` - Premium package control
  - `/kifzldev/security` - Security settings
  - `/kifzldev/v2-activate` - Bot V2 activation (NEW!)
- **Dashboard**: Real-time bot status monitoring (online/offline/error/idle)
- **Bot Creation Flow**: User creates bot with Telegram ID + Bot Token
- **Database Schema**: Users, Bots (v1/v2), Premium Packages, Payments, OTP, Security Logs
- **Bot Configuration System**:
  - Auto-inject botToken + telegramId via environment variables
  - Bootstrap scripts for both Node.js (V1) and Python (V2)
  - Config generation endpoints: `/api/bots/:id/config`
  - Deployment script generation: `/api/bots/:id/deploy/:version`
- **Bot V2 Activation System** ⭐ NEW:
  - OPSI 1: Admin activate V2 for specific user (stays FREE unless upgraded)
    - Endpoint: `POST /api/admin/v2/user`
    - Form: ID Pengguna, Bot Token, ID Telegram
    - Data stored at: `/bots/<userId>/<botId>/`
  - OPSI 2: Admin activate V2 for self (MULTI-BOT, no limit)
    - Endpoint: `POST /api/admin/v2/self`
    - Form: Bot Token, ID Telegram
    - Data stored at: `/bots/admin/<botId>/`
    - Get admin bots: `GET /api/admin/v2/self`
- **UI/UX**:
  - Neon cyberpunk aesthetic (purple #9D4EDD / cyan #00BBF9)
  - Glassmorphism cards with smooth animations
  - Instant navigation (full-screen menu overlay)
  - Responsive design across all pages
- **Directory Structure**:
  - `bots/v1/` - Bot V1 repository (NodeJS) cloned & ready
  - `bots/v2/` - Bot V2 repository (Python) cloned & ready
  - Bootstrap scripts for auto-config injection

### In Progress ⏳
- Real-time Telegram notifications for OTP and system events (console logging as placeholder)
- Bot monitoring callbacks (CPU, RAM, Ping, Uptime at 5-sec intervals)
- Custom domain setup at `kifzldev-cloud.devpanel.me`
- Website landing page with features showcase

### Architecture

**Frontend** (React + Vite + TailwindCSS)
- Pages: Login, Dashboard, Admin Panel (6 subpages), Bot V2 Activation
- Components: Header, Bot Cards, Stats Cards, Forms
- Real-time queries with TanStack React Query v5
- Login flow: Google OAuth or Email+OTP method
- Routing: Wouter (client-side routing)

**Backend** (Express.js + PostgreSQL + Drizzle ORM)
- Authentication: Google OAuth + Email OTP via Telegram sessions
- Auth files: `server/auth/newAuth.ts`, `server/auth/googleOAuth.ts`, `server/auth/emailOtp.ts`
- Auth routes: `server/routes/authRoutes.ts`
- V2 Activation: `server/routes/v2Activate.ts`
- Telegram service: `server/services/telegram.ts` (console logging for dev)
- Bot management: CRUD operations with access control
- Admin operations: User management, bot activation, payment validation
- Premium validation: Check user subscription status

**Bot Repositories** (External)
- Bot V1: https://github.com/kyhosting/BotCv-V1 (NodeJS)
- Bot V2: https://github.com/kyhosting/BotCv-V2 (Python)

### Database Schema

```
users
  ├─ id (UUID)
  ├─ visibleId (KIFZUSR-XXXXXX)
  ├─ email, firstName, lastName
  ├─ telegramId, profileImageUrl
  ├─ role (user/admin), accountStatus, premiumStatus
  └─ createdAt, updatedAt

bots
  ├─ id (UUID)
  ├─ userId (FK)
  ├─ botToken (encrypted in production)
  ├─ telegramId (bot owner ID)
  ├─ version (v1/v2)
  ├─ status (online/offline/error/idle)
  ├─ isAdminBot (boolean - true if admin's V2)
  ├─ metrics (cpuUsage, ramUsage, ping, uptime)
  └─ createdAt, updatedAt

premiumPackages
  ├─ id, name, durationDays, price, maxBots
  └─ features (array of feature strings)

payments
  ├─ id, userId, packageId
  ├─ amount, status (pending/approved/rejected)
  ├─ proofImageUrl (QRIS payment proof)
  └─ adminNote, processedBy, processedAt

otpCodes
  ├─ id, email, telegramId, code (6-digit)
  ├─ expiresAt, attempts, isUsed
  └─ createdAt
```

### API Endpoints

#### Auth
- `GET /api/auth/user` - Get current user (requires session)
- `GET /api/auth/google` - Redirect to Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/email/request-otp` - Request OTP code
- `POST /api/auth/email/verify-otp` - Verify OTP code
- `GET /api/logout` - Logout and clear session

#### Bots
- `GET /api/bots` - Get user's bots (auth required)
- `POST /api/bots` - Create new bot
- `DELETE /api/bots/:id` - Delete bot
- `POST /api/bots/:id/restart` - Restart bot
- `GET /api/bots/:id/config` - Get bot config
- `GET /api/bots/:id/deploy/:version` - Get deployment script

#### Premium
- `GET /api/premium/packages` - Get available packages
- `POST /api/premium/upgrade` - Start upgrade flow
- `GET /api/premium/validate` - Validate current subscription

#### Bot V2 Activation (Admin)
- `POST /api/admin/v2/user` - Activate V2 for specific user
  - Body: `{ userId, botToken, telegramId }`
- `POST /api/admin/v2/self` - Activate V2 for admin (multi-bot)
  - Body: `{ botToken, telegramId }`
- `GET /api/admin/v2/self` - Get admin's own V2 bots

#### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/payments` - Get all payments
- `POST /api/admin/payments/:id/process` - Process payment

### User Preferences
- Language: Indonesian (casual-professional tone)
- Design: Neon cyberpunk with glassmorphism
- Performance: Instant navigation without animations
- Google OAuth + Email OTP authentication
- Admin can activate Bot V2 for users OR for self (multi-bot)

### Latest Changes (Session 6)
- ✅ Fixed Google OAuth session persistence (added req.session.save())
- ✅ Fixed all 404 errors by creating missing admin pages
- ✅ Implemented Bot V2 activation system with 2 admin options
- ✅ Added dynamic Google redirect URI (hostname-based)
- ✅ Set all admin user as admin role with premium status
- ✅ Fixed redirect URLs from `/api/login` to `/login`
- ✅ Created admin pages: Bots, Premium, Security, V2 Activation
