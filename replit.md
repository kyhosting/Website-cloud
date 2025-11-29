# KIFZLDEV NEO-2025

## Overview

KIFZLDEV NEO-2025 is a comprehensive Telegram bot hosting platform with a futuristic neon-cyber aesthetic. The platform enables users to host and manage both V1 (Node.js) and V2 (Python) Telegram bots with real-time monitoring, premium features, and advanced security systems.

**Core Purpose**: Provide a complete bot hosting solution with user management, bot deployment, premium subscriptions, payment processing, and administrative controls.

**Tech Stack**: React (Vite) frontend with TypeScript, Express.js backend, Drizzle ORM with PostgreSQL (Neon), Replit Auth for authentication, and shadcn/ui components with Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Framework**: React 18+ with TypeScript using Vite as the build tool and bundler.

**UI Design System**: 
- Custom cyber/neon futuristic theme built on shadcn/ui components (New York style)
- Tailwind CSS for styling with HSL-based theming for dark/light modes
- Design emphasizes glassmorphism effects, neon glows, and Material Design foundation
- Typography system using Inter/Space Grotesk for headings, DM Sans for body text, and JetBrains Mono for technical data
- Custom CSS variables for theming with neon border effects and elevation states

**Routing**: Wouter for lightweight client-side routing with protected routes for authenticated users.

**State Management**: 
- TanStack Query (React Query) for server state management with custom query client configuration
- React Context API for theme management
- Custom hooks for authentication state (`useAuth`)

**Key Pages**:
- **Landing**: Public marketing page with hero section, features showcase, and stats display
- **Dashboard**: Protected user dashboard showing bot overview and management
- **Add Bot**: Multi-step bot creation wizard with V1/V2 selection
- **Premium**: Subscription management and payment upload interface
- **Admin Panel**: Multi-page admin interface for user/bot/payment management
- **Static Pages**: About, Security, Developer information pages

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js with ES modules.

**Authentication Strategy**: 
- OpenID Connect (OIDC) via Replit Auth using Passport.js
- Session-based authentication with PostgreSQL session storage (connect-pg-simple)
- 7-day session TTL with HTTP-only secure cookies
- Role-based access control (user/admin roles)

**API Design**:
- RESTful endpoints under `/api/*` namespace
- Protected routes using `isAuthenticated` and `isAdmin` middleware
- File upload handling with Multer for payment proof images (5MB limit, images only)
- Response includes proper HTTP status codes and JSON error messages

**Data Access Layer**:
- Storage abstraction pattern (`IStorage` interface) for database operations
- Centralized in `server/storage.ts` with methods for all entity operations
- Supports transactions and complex queries through Drizzle ORM

### Database Schema

**ORM**: Drizzle ORM with Neon serverless PostgreSQL adapter using WebSocket connection.

**Core Tables**:

1. **sessions** - Session storage for authentication (required for Replit Auth)
   - Fields: sid (primary key), sess (jsonb), expire (timestamp)
   
2. **users** - User accounts with premium status tracking
   - UUID primary key with human-readable `visibleId` (KIFZUSR-XXXXXX format)
   - Stores email, Telegram ID, profile data, role, account status, premium status
   - Tracks bot limits (totalBots, maxBots) and login timestamps
   
3. **bots** - Bot instances managed by users
   - Supports V1 (Node.js) and V2 (Python) bot versions
   - Tracks status (online/offline/error/idle), metrics (CPU, RAM, ping, uptime)
   - Stores bot token, configuration, and ownership relationships
   
4. **payments** - Premium subscription payment records
   - Links to users and premium packages
   - Stores proof image path, approval status, admin notes
   - Tracks payment amounts and processing timestamps
   
5. **otpCodes** - OTP verification for security operations
   - 6-digit codes with 5-minute expiration
   - Tracks verification status and attempts
   
6. **securityLogs** - Audit trail for security events
   - Records login attempts, suspicious activities, admin actions
   - Includes IP tracking and event categorization
   
7. **adminMessages** - Admin broadcast messaging system
   - Supports scheduled messages with priority levels
   
8. **premiumPackages** - Subscription tier definitions
   - Configurable pricing, duration, bot limits, and features

**Enums**: TypeScript enums for user roles, account status, premium status, bot versions, bot status, and payment status.

### Security Architecture

**Multi-Layer Protection**:
- Anti-brute force with rate limiting and cooldowns
- Session monitoring with 24-hour auto-logout
- IP-based firewall with temporary blocking (6-hour auto-unblock)
- OTP verification via Telegram with 5-minute expiration
- Anti-cloning detection via system fingerprinting
- CSRF protection via session validation

**File Upload Security**:
- Type validation (images only: jpeg, jpg, png, gif, webp)
- Size limits (5MB maximum)
- Secure file storage in dedicated upload directory
- Filename sanitization with timestamp-based unique names

### Build System

**Development**: 
- Vite dev server with HMR over WebSocket
- Custom middleware integration for Express
- Replit-specific plugins for cartographer and dev banner
- Live template reloading with cache busting

**Production Build**:
- Two-stage build process: Vite for client, esbuild for server
- Server bundling with selective dependency inclusion (allowlist pattern)
- Output to `dist/` directory with separated public assets
- Single CommonJS bundle for optimized cold start performance

## External Dependencies

### Third-Party Services

**Database**: Neon Serverless PostgreSQL
- WebSocket-based connection via `@neondatabase/serverless`
- Connection string via `DATABASE_URL` environment variable
- Requires database provisioning before application start

**Authentication**: Replit OIDC Provider
- OAuth 2.0 / OpenID Connect flow
- Issuer URL: `https://replit.com/oidc` (configurable)
- Client ID from `REPL_ID` environment variable
- Session secret from `SESSION_SECRET` environment variable

### Key NPM Packages

**UI Components**:
- `@radix-ui/*` - Headless UI primitives (20+ components)
- `class-variance-authority` - Component variant management
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library for transitions

**Forms & Validation**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - TypeScript-first schema validation
- `drizzle-zod` - Drizzle schema to Zod conversion

**Server**:
- `express` - Web application framework
- `passport` / `passport-local` - Authentication middleware
- `express-session` - Session management
- `express-rate-limit` - Rate limiting middleware
- `multer` - Multipart form data (file uploads)
- `cors` - Cross-origin resource sharing

**Database**:
- `drizzle-orm` - TypeScript ORM
- `drizzle-kit` - Schema migration tools
- `connect-pg-simple` - PostgreSQL session store

**Utilities**:
- `nanoid` - Unique ID generation
- `date-fns` - Date manipulation
- `ws` - WebSocket client for Neon
- `clsx` / `tailwind-merge` - Conditional className utilities

### Environment Requirements

**Required Environment Variables**:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret
- `REPL_ID` - Replit application identifier (for OIDC)
- `ISSUER_URL` - OIDC issuer URL (defaults to Replit)
- `NODE_ENV` - Environment mode (development/production)

**File System Structure**:
- `/uploads/payments/` - Payment proof image storage
- `/migrations/` - Database migration files
- `/dist/` - Production build output
- `/dist/public/` - Client static assets