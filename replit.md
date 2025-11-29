# KIFZLDEV NEO-2025 Bot Hosting Platform

## Project Status

### Completed Features ✅
- **Authentication**: Replit OAuth login + session management
- **Dashboard**: Real-time bot status monitoring (online/offline/error/idle)
- **Bot Creation Flow**: User creates bot with Telegram ID + Bot Token
- **Database Schema**: Users, Bots (v1/v2), Premium Packages, Payments, OTP, Security Logs
- **Bot Configuration System**:
  - Auto-inject botToken + telegramId via environment variables
  - Bootstrap scripts for both Node.js (V1) and Python (V2)
  - Config generation endpoints: `/api/bots/:id/config`
  - Deployment script generation: `/api/bots/:id/deploy/:version`
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
- Premium subscription validation (7/30/90 day packages via QRIS manual payment)
- Real-time Telegram notifications for OTP and system events
- Bot monitoring callbacks (CPU, RAM, Ping, Uptime at 5-sec intervals)
- Admin panel at `/kifzldev` route with full control
- Custom domain setup at `kifzldev-cloud.devpanel.me`

### Architecture

**Frontend** (React + Vite + TailwindCSS)
- Pages: Login, Dashboard, Add Bot, Premium, Admin Panel
- Components: Sidebar navigation, bot cards, three-dot menu overlay
- Real-time queries with TanStack React Query

**Backend** (Express.js + PostgreSQL + Drizzle ORM)
- Authentication: Replit OAuth + passport-local sessions
- Bot management: CRUD operations with access control
- Config generation: Auto-inject credentials for both bot versions
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
- `GET /api/login` - Replit OAuth login redirect
- `GET /api/logout` - Logout and clear session

#### Bots
- `GET /api/bots` - Get user's bots (auth required)
- `POST /api/bots` - Create new bot (auth required)
  - Body: `{ botToken, telegramId, version }`
- `DELETE /api/bots/:id` - Delete bot (auth required)
- `POST /api/bots/:id/restart` - Restart bot (auth required)
- `GET /api/bots/:id/config` - Get auto-injected config (auth required)
  - Returns: `{ botToken, telegramId, userId, isPremium, webhookUrl, ... }`
- `GET /api/bots/:id/deploy/:version` - Get deployment script (auth required)
  - Returns: Bash script with all environment variables set

#### Premium
- `GET /api/premium/packages` - Get available packages (public)
- `POST /api/premium/upgrade` - Start upgrade flow (auth required)
- `GET /api/premium/validate` - Validate current subscription (auth required)

#### Admin
- `GET /api/admin/stats` - Get platform statistics (admin only)
- `GET /api/admin/payments` - Get pending payments (admin only)
- `PATCH /api/admin/payments/:id` - Approve/reject payment (admin only)

### Bot Auto-Config System

**Flow:**
1. User creates bot via dashboard with Telegram ID + Bot Token
2. Platform generates config: `{ botToken, telegramId, userId, isPremium, ... }`
3. User downloads deployment script via `/api/bots/:id/deploy/:version`
4. Script sets `BOT_CONFIG` environment variable with JSON
5. Bootstrap script (`bootstrap.js` or `bootstrap.py`) parses config
6. Bot starts with auto-injected credentials

**Example Bot V1 Start:**
```bash
export BOT_CONFIG='{"botToken":"xxx","telegramId":"123","isPremium":true,...}'
cd bots/v1
node bootstrap.js
```

**Example Bot V2 Start:**
```bash
export BOT_CONFIG='{"botToken":"xxx","telegramId":"123","isPremium":true,...}'
cd bots/v2
python bootstrap.py
```

### User Preferences
- Language: Indonesian (casual-professional tone)
- Design: Neon cyberpunk with glassmorphism
- Performance: Instant navigation without animations on menu clicks
- Telegram ID for bot identification (numeric format)

### Next Steps
1. ✅ Database schema with Telegram ID migration
2. ✅ Bot repositories cloned (V1 NodeJS, V2 Python)
3. ✅ Auto-config injection system implemented
4. ⏳ Install bot dependencies and test locally
5. ⏳ Premium payment validation workflow
6. ⏳ Real-time Telegram notifications
7. ⏳ Bot monitoring system (5-sec metrics)
8. ⏳ Admin panel setup at /kifzldev
9. ⏳ Custom domain deployment to kifzldev-cloud.devpanel.me
