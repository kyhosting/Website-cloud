# Deploy ke Vercel/Netlify (Frontend) + Replit (Backend) - 100% GRATIS

## Setup Diagramnya:
```
┌─────────────────────────┐
│  Domain Gratis (.eu.org)│
└────────────┬────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   Vercel/   │  │   Replit Backend │
│   Netlify   │  │ + Keep-Alive Bot │
│ (Frontend)  │  │   (24/7 Online)  │
└──────────────┘  └──────────────────┘
```

## Step 1: Siapkan Replit Backend (Keep-Alive)

1. **Setup UptimeRobot (Gratis):**
   - Buka: https://uptimerobot.com/
   - Daftar dengan email
   - Klik "Add Monitor"
   - Pilih "HTTP(s)"
   - URL: `https://YOUR_REPLIT_URL.replit.dev`
   - Interval: 5 menit
   - Klik "Save"
   
   ✅ Backend akan tetap online 24/7 (tidak pernah sleep)

2. **Catat Replit URL:**
   - Format: `https://REPLIT_USERNAME-PROJECT.replit.dev`
   - Contoh: `https://kifzldev-neo2025.replit.dev`

---

## Step 2: Deploy Frontend ke Vercel (RECOMMENDED)

### Opsi A: Deploy via GitHub (Paling Mudah)

1. **Push project ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/repo-name
   git push -u origin main
   ```

2. **Buka Vercel:**
   - Buka: https://vercel.com/
   - Klik "Sign in with GitHub"
   - Authorize Vercel

3. **Import Project:**
   - Klik "New Project"
   - Pilih repository
   - Framework: "Other"
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Environment Variables:
     ```
     VITE_API_URL = https://YOUR_REPLIT_URL.replit.dev
     ```
   - Klik "Deploy"

✅ Website live dalam 2 menit!

---

## Step 3: Deploy Frontend ke Netlify (ALTERNATIF)

1. **Buka Netlify:**
   - Buka: https://app.netlify.com/
   - Klik "Log in with GitHub"

2. **Deploy:**
   - Klik "New site from Git"
   - Pilih repository
   - Build Command: `npm run build`
   - Publish Directory: `dist/public`
   - Environment Variables:
     ```
     VITE_API_URL = https://YOUR_REPLIT_URL.replit.dev
     ```
   - Klik "Deploy site"

✅ Website live!

---

## Step 4: Setup Domain Gratis

### Pilih Salah Satu:

**Opsi 1: .eu.org (Recommended - Gratis Selamanya)**
1. Buka: https://nic.eu.org/
2. Klik "Request"
3. Isi form (nama domain, email, dll)
4. Tunggu approval (~1-7 hari)
5. Setup DNS pointing ke Vercel/Netlify

**Opsi 2: .me.uk (Gratis Selamanya)**
1. Buka: https://www.meuk.org/
2. Daftar domain
3. Point DNS

**Opsi 3: .tk/.ga/.ml (Gratis 1 Tahun)**
1. Buka: https://www.freenom.com/
2. Daftar domain
3. Point DNS

---

## Step 5: Point Domain ke Vercel/Netlify

### Vercel:
1. Dashboard Vercel → Settings → Domains
2. Tambah domain gratis kamu
3. Copy Vercel DNS records
4. Paste ke DNS provider domain
5. Tunggu 24-48 jam propagasi

### Netlify:
1. Dashboard Netlify → Domain settings
2. Custom domain
3. Masukkan domain kamu
4. Copy DNS records dari Netlify
5. Paste ke DNS provider
6. Done!

---

## Step 6: Verifikasi Setup

1. **Frontend Online:**
   ```
   https://your-domain.eu.org
   ```

2. **Backend API:**
   ```
   https://your-domain.eu.org/api/auth/user
   ```
   Should return: `{"message":"Unauthorized"}` (ini normal jika belum login)

3. **Check Status:**
   - UptimeRobot dashboard → lihat uptime Replit
   - Harusnya 100% uptime

---

## Troubleshooting

**Q: API calls error "CORS"?**
A: Pastikan `VITE_API_URL` sudah set di environment variables Vercel/Netlify

**Q: Backend tidak bisa diakses?**
A: Cek UptimeRobot - pastikan monitoring aktif

**Q: Domain tidak resolve?**
A: DNS propagasi butuh 24-48 jam, tunggu atau check DNS checker: https://dnschecker.org/

---

## Hasil Akhir = GRATIS SELAMANYA! 

✅ Website online 24/7
✅ Backend tetap online (UptimeRobot keep-alive)
✅ Domain custom (gratis)
✅ Database PostgreSQL Replit (gratis)
✅ **0 RUPIAH BIAYA**

---

## Environment Variables Reference

**Vercel/Netlify perlu set:**
```
VITE_API_URL=https://YOUR_REPLIT_URL.replit.dev
```

**Replit sudah otomatis setup:**
- DATABASE_URL (PostgreSQL)
- SESSION_SECRET
- GOOGLE_OAUTH_CLIENT_ID
- GOOGLE_OAUTH_CLIENT_SECRET

---

Selesai! 🎉
