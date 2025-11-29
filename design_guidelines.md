# KIFZLDEV NEO-2025 Design Guidelines

## Design Approach
**Hybrid System**: Material Design foundation enhanced with cyber/neon futuristic aesthetics. Drawing inspiration from cyberpunk UI (Cyberpunk 2077, Valorant), gaming dashboards (Discord, Steam), and modern SaaS platforms (Vercel, Linear) with Indonesian casual-professional language tone.

## Typography System
**Font Families**:
- Primary: Inter or 'Space Grotesk' (headings, UI elements) - futuristic, clean
- Secondary: 'DM Sans' or 'Plus Jakarta Sans' (body text) - readable, modern
- Accent: 'JetBrains Mono' (code, IDs, technical data)

**Hierarchy**:
- Hero Titles: text-5xl to text-7xl, font-bold, tracking-tight
- Section Headers: text-3xl to text-4xl, font-semibold
- Card Titles: text-xl, font-medium
- Body Text: text-base, font-normal, leading-relaxed
- Captions/Labels: text-sm, uppercase tracking-wider for technical labels
- User IDs/Technical: text-sm, font-mono

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-24
- Card gaps: gap-4 to gap-6
- Element margins: m-2, m-4, m-8

**Grid Structure**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature showcase: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Stats panel: grid-cols-2 md:grid-cols-4
- Container max-width: max-w-7xl with px-4 to px-8

## Landing Page Structure

**Hero Section** (h-screen):
- Full-viewport animated neon banner with glassmorphism overlay
- Large futuristic robot mascot illustration (SVG or high-quality PNG) - cute cyber style with glowing elements
- Massive "KIFZLDEV NEO-2025" title with glow effect
- Tagline: "Platform Hosting Bot Telegram Terlengkap & Terfuturistik"
- Primary CTA: "Mulai Sekarang" button (large, glowing border)
- Animated particle background or grid lines

**Features Section** (py-20):
- 4-column grid showcasing key features
- Icon + Title + Short description per card
- Glassmorphism cards with hover glow effects
- Icons: Heroicons with custom neon treatment

**Stats/Trust Section** (py-16):
- 4-column stats grid: Total Bots, Active Users, Uptime %, Response Time
- Large numbers with glowing accent, small labels
- Animated counting effect on scroll

**CTA Section** (py-24):
- Center-aligned with robot mascot
- "Siap Memulai?" headline
- Description + primary button
- Background: gradient with geometric patterns

## Navigation System

**Primary Header**:
- Fixed top, glassmorphism background with backdrop-blur
- Logo (robot icon) + "KIFZLDEV" wordmark on left
- Three-dot menu (⋮) on right - opens full-screen overlay menu
- Height: h-16 to h-20

**Three-Dot Menu Overlay**:
- Full-screen modal (z-50) with backdrop-blur-xl
- Large menu items with icons, stacked vertically, center-aligned
- Smooth fade-in animation
- Close button (X) top-right
- Menu items have hover glow effect

**Back Button**:
- Always visible top-left on internal pages
- Icon (←) + "Kembali" text
- Consistent position: top-4 left-4 or in header

## Dashboard Components

**User Dashboard Layout**:
- Welcome header with user name + ID badge (glassmorphism)
- Stats cards grid (Total Bot, Status Akun, Aktivitas)
- Bot list table with status indicators (online/offline with glow)
- "Tambah Bot" FAB button (bottom-right, floating, glowing)

**Admin Dashboard Layout** (/kifzldev):
- Comprehensive stats overview: 6-card grid
- Tab navigation for different sections (Users, Bots, Payments)
- Data tables with advanced filters
- Action buttons with confirmation modals

**Bot Status Cards**:
- Card header: Bot name + status badge (online = green glow, offline = red dim)
- Real-time metrics: CPU, RAM, Ping, Uptime with progress bars
- Action buttons: View Logs, Restart, Delete
- Glassmorphism with subtle neon border

## Form Components

**Login Forms**:
- Centered card (max-w-md) with glassmorphism
- Large icon/logo at top
- Input fields with glowing focus state
- Google OAuth button with logo
- OTP input: 6-digit boxes, large, monospace font
- Error messages with alert icon, fade-in animation

**Bot Creation Forms**:
- Multi-step wizard with progress indicator (glowing dots)
- Input labels: uppercase, small, tracking-wide
- Text inputs: border with glow on focus
- Dropdowns with custom styling
- Submit button: large, gradient, animated on hover

**QRIS Payment**:
- Split layout: QRIS image left, upload form right
- Large "Upload Bukti Bayar" drop zone
- Preview uploaded image before submit
- Instructions in card format

## Premium System UI

**Pricing Cards**:
- 3-column grid (7/30/90 hari packages)
- Featured plan: larger, elevated, extra glow
- Price large and bold, features list with checkmarks
- "Pilih Paket" button matches card theme

**Premium Badge**:
- Small crown icon + "PREMIUM" text
- Glowing gold/yellow accent
- Appears on user profile, bot cards

## Notification System

**Toast Notifications**:
- Top-right corner (fixed position)
- Glassmorphism with appropriate icon (success, error, info)
- Auto-dismiss after 5 seconds, slide-in animation
- Stack multiple notifications with gap-2

**Alert Modals**:
- Center screen, backdrop blur
- Icon at top, title, message, action buttons
- Confirmation dialogs for destructive actions

## Developer Mode

**Hidden Panel**:
- Full-screen overlay (dark, semi-transparent)
- Terminal-style interface with monospace font
- Live metrics: CPU/RAM graphs (line charts)
- Log viewer with syntax highlighting
- Grid layout for multiple panels

## Visual Effects

**Glassmorphism Treatment**:
- backdrop-blur-md to backdrop-blur-xl
- Semi-transparent backgrounds
- Subtle border (1px) with low opacity
- Applied to cards, modals, navigation

**Glow Effects**:
- box-shadow with color blur for borders
- Text glow for headings (text-shadow)
- Button glow on hover (stronger shadow)
- Status indicators pulse animation

**Animations**:
- Page transitions: fade + slight slide (200ms)
- Hover states: smooth scale (0.98 to 1.02)
- Loading states: skeleton screens with shimmer
- Success actions: brief scale bounce

## Images

**Hero Section**:
- Large futuristic robot mascot illustration (center or right-aligned)
- Style: Cute cyber character with neon accents, clean vector art
- Background: Abstract neon grid or particle system (animated SVG)

**Feature Icons**:
- Custom neon-styled icons from Heroicons library
- Consistent stroke width, outlined style
- 48px to 64px size in feature cards

**QRIS Display**:
- Admin-provided QRIS code image (centered, max-w-sm)
- White/light background for QR readability
- Border with subtle glow

**Empty States**:
- Friendly robot character illustration (smaller version of mascot)
- "Belum ada bot" or "Tidak ada data" messaging

## Responsive Behavior

- Mobile: Single column, full-width cards, hamburger menu becomes three-dot overlay
- Tablet: 2-column grids, adjusted spacing (py-12 instead of py-20)
- Desktop: Full multi-column layouts, maximum visual impact
- All touch targets minimum 44px height

## Indonesian Language Tone

- Casual professional: "Halo!" instead of "Selamat datang"
- Use emoji sparingly for friendliness: "Yeay! Bot berhasil dibuat 🎉"
- Error messages: "Waduh, ada masalah nih..." instead of formal warnings
- CTAs: "Gas!" "Mulai Sekarang!" "Aktifkan Premium!"