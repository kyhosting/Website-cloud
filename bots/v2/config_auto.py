"""
🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
This file is auto-generated with bot credentials injected from the platform
DO NOT EDIT MANUALLY - regenerate from dashboard instead
"""

import os
import json

# Load auto-injected credentials from environment
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
OWNER_ID = int(os.getenv("OWNER_ID", "0"))
BOT_ID = os.getenv("BOT_ID", "")
USER_ID = os.getenv("USER_ID", "")
API_BASE_URL = os.getenv("API_BASE_URL", "https://kifzldev-cloud.devpanel.me/api")
WEBHOOK_URL = os.getenv("WEBHOOK_URL", "")
IS_PREMIUM = os.getenv("IS_PREMIUM", "False").lower() == "true"
PREMIUM_EXPIRY = os.getenv("PREMIUM_EXPIRY", "")

# Platform Configuration
PLATFORM_CONFIG = {
    "botId": BOT_ID,
    "userId": USER_ID,
    "apiBaseUrl": API_BASE_URL,
    "webhookUrl": WEBHOOK_URL,
    "isPremium": IS_PREMIUM,
    "premiumExpiry": PREMIUM_EXPIRY
}

# Bot Creator Info
BOT_CREATOR = "KIFZL & PARTNER/SUPPORT IQBAL DEV"
COPYRIGHT = "© 2025 KIFZL & IQBAL DEV. All rights reserved."
WATERMARK = "🎌 IQBAL CV BOT - OFFICIAL VERSION 🎌\nPowered by KIFZL & IQBAL DEV"
