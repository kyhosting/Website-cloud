# Bot Deployment Guide - KIFZLDEV NEO-2025

## Quick Start

### For Bot V1 (NodeJS)

**1. Install dependencies:**
```bash
cd bots/v1
npm install
```

**2. Get auto-injected config from dashboard:**
```bash
# Login to KIFZLDEV dashboard
# Go to: Bots → Your Bot → "Get Config" button
# Copy the deployment script
```

**3. Run with auto-config:**
```bash
# Set environment variable with config JSON
export BOT_CONFIG='<paste-config-json-here>'
export NODE_ENV=production

# Start bot with bootstrap
node bootstrap.js

# Or directly run index.js if config already injected
node index.js
```

### For Bot V2 (Python)

**1. Install dependencies:**
```bash
cd bots/v2
pip install -r requirements.txt
```

**2. Get auto-injected config from dashboard:**
```bash
# Same as Bot V1 - copy deployment script
```

**3. Run with auto-config:**
```bash
# Set environment variables
export BOT_CONFIG='<paste-config-json-here>'
export TELEGRAM_BOT_TOKEN='<token-from-config>'
export OWNER_ID='<telegram-id-from-config>'

# Start bot with bootstrap
python bootstrap.py

# Or directly run main.py if config already injected
python main.py
```

## Configuration Variables Auto-Injected

When bot starts via deployment script, these are automatically set:

```bash
# Core credentials
TELEGRAM_BOT_TOKEN=<bot-token>
OWNER_ID=<telegram-id>

# Platform info
BOT_ID=<platform-bot-id>
USER_ID=<platform-user-id>
BOT_CONFIG='<full-json-config>'

# Optional
IS_PREMIUM=true/false
API_BASE_URL=https://kifzldev-cloud.devpanel.me/api
WEBHOOK_URL=https://kifzldev-cloud.devpanel.me/api/webhook/bot/<bot-id>
```

## Deployment on External Server

**1. Download deployment script from KIFZLDEV dashboard:**
```bash
# Script location: Dashboard → Bot → "Download Deploy Script" button
# Script includes all config already set
```

**2. Run on your server:**
```bash
# Download script
scp deploy-bot-v1.sh user@server:/home/user/

# Connect to server
ssh user@server

# Make executable and run
chmod +x /home/user/deploy-bot-v1.sh
/home/user/deploy-bot-v1.sh

# Or run in background
nohup /home/user/deploy-bot-v1.sh > bot.log 2>&1 &
```

## Docker Deployment

**Docker Compose example:**
```yaml
version: '3.8'

services:
  bot-v1:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./bots/v1:/app
    environment:
      BOT_CONFIG: '${BOT_CONFIG_V1}'
      NODE_ENV: production
    command: bash -c "npm install --production && node bootstrap.js"
    restart: unless-stopped

  bot-v2:
    image: python:3.11-slim
    working_dir: /app
    volumes:
      - ./bots/v2:/app
    environment:
      BOT_CONFIG: '${BOT_CONFIG_V2}'
      TELEGRAM_BOT_TOKEN: '${TELEGRAM_BOT_TOKEN_V2}'
    command: bash -c "pip install -r requirements.txt && python bootstrap.py"
    restart: unless-stopped
```

**Run with:**
```bash
export BOT_CONFIG_V1='<config-json>'
export BOT_CONFIG_V2='<config-json>'
docker-compose up -d
```

## Monitoring

**Check bot status in dashboard:**
```
Dashboard → Your Bot → Status (online/offline/error)
Metrics: CPU, RAM, Ping, Uptime
Last active: timestamp
```

**Local logs:**
```bash
# Bot V1 - Node
pm2 logs bot-v1

# Bot V2 - Python
tail -f bot-v2.log
```

## Troubleshooting

### Bot won't start - "BOT_CONFIG not found"
- Ensure `BOT_CONFIG` environment variable is set
- Verify JSON is valid (no syntax errors)
- Check path to bootstrap.js/bootstrap.py is correct

### Bot won't connect to Telegram
- Check `botToken` in config is correct
- Verify `TELEGRAM_BOT_TOKEN` environment variable is set
- Ensure token hasn't expired or been revoked

### Premium features not working
- Check `isPremium` flag in config
- Verify `premiumExpiry` date hasn't passed
- Validate payment status in admin panel

## API Endpoints for Bots

**Get config JSON:**
```bash
curl -X GET https://kifzldev-cloud.devpanel.me/api/bots/:id/config \
  -H "Cookie: <session-cookie>"
```

**Get deployment script:**
```bash
curl -X GET https://kifzldev-cloud.devpanel.me/api/bots/:id/deploy/v1 \
  -H "Cookie: <session-cookie>" \
  > deploy.sh
```

## Support

- Dashboard: https://kifzldev-cloud.devpanel.me
- Admin panel: https://kifzldev-cloud.devpanel.me/kifzldev
- Issues/Bugs: Report in dashboard

---

**Last Updated:** 2025-11-29
**Version:** KIFZLDEV NEO-2025 v1.0
