# KIFZLDEV NEO-2025 - Bot Setup Guide

## Directory Structure
```
bots/
├── v1/              # Bot V1 (NodeJS)
│   ├── index.js
│   ├── bootstrap.js (auto-config injector)
│   ├── config.auto.js (auto-generated config)
│   ├── package.json
│   └── ...
└── v2/              # Bot V2 (Python)
    ├── main.py
    ├── bootstrap.py (auto-config injector)
    ├── config_auto.py (auto-generated config)
    ├── requirements.txt
    └── ...
```

## Installation Instructions

### Bot V1 (NodeJS)
```bash
cd bots/v1
npm install
```

### Bot V2 (Python)
```bash
cd bots/v2
pip install -r requirements.txt
```

## Auto-Config Injection System

### How It Works
1. Platform generates bot token + Telegram ID in config
2. Config passed via `BOT_CONFIG` environment variable (JSON)
3. Bootstrap script parses config and sets environment variables
4. Bot main process reads from environment

### Starting Bot with Auto-Config

**Bot V1:**
```bash
export BOT_CONFIG='{"botToken":"xxx","telegramId":"123",...}'
cd bots/v1
node bootstrap.js
```

**Bot V2:**
```bash
export BOT_CONFIG='{"botToken":"xxx","telegramId":"123",...}'
cd bots/v2
python bootstrap.py
```

## API Endpoints

### Get Bot Config (JSON)
```
GET /api/bots/:id/config
Response: { botToken, telegramId, userId, isPremium, ... }
```

### Get Deployment Script
```
GET /api/bots/:id/deploy/v1  # NodeJS deployment script
GET /api/bots/:id/deploy/v2  # Python deployment script
Response: Bash script ready to execute
```

## Environment Variables Auto-Injected

- `TELEGRAM_BOT_TOKEN` - Bot token
- `OWNER_ID` - Telegram ID (bot owner)
- `BOT_ID` - Platform bot ID
- `USER_ID` - Platform user ID
- `BOT_CONFIG` - Full config JSON

## Next Steps

1. ✅ Create bots/v1 and bots/v2 directories
2. ✅ Clone bot repositories from GitHub
3. ⏳ Install dependencies (npm for V1, pip for V2)
4. ✅ Create bootstrap scripts (auto-config injection)
5. ✅ Add API endpoints for config generation
6. ⏳ Test bot activation from dashboard
7. ⏳ Deploy bots to production

## Status

- Bot V1 (NodeJS) repo: **CLONED** ✓ (awaiting npm install)
- Bot V2 (Python) repo: **CLONED** ✓ (awaiting pip install)
- Bootstrap scripts: **CREATED** ✓
- Config injection system: **IMPLEMENTED** ✓
- API endpoints: **READY** ✓
