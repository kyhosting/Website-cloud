#!/usr/bin/env python3
"""
Bot V2 Bootstrap Script - Auto-inject config and start bot
Usage: python bootstrap.py
"""

import os
import json
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def bootstrap():
    logger.info("🚀 Bot V2 Bootstrap - KIFZLDEV NEO-2025")
    logger.info("=" * 40)
    
    # Get config from environment
    config_json = os.getenv("BOT_CONFIG")
    
    if not config_json:
        logger.error("❌ BOT_CONFIG environment variable not set!")
        logger.error("   Set it with: export BOT_CONFIG='<json-config>'")
        sys.exit(1)
    
    try:
        bot_config = json.loads(config_json)
        
        logger.info("✅ Config loaded from environment")
        logger.info(f"📦 Bot Token: {'●●●●●●●●●●●●●●●●●●' if bot_config.get('botToken') else 'NOT SET'}")
        logger.info(f"📦 Telegram ID: {bot_config.get('telegramId')}")
        logger.info(f"📦 Bot ID: {bot_config.get('botId')}")
        logger.info(f"📦 User ID: {bot_config.get('userId')}")
        logger.info(f"📦 Premium: {'YES ✓' if bot_config.get('isPremium') else 'NO'}")
        
        # Set environment variables for bot
        os.environ["TELEGRAM_BOT_TOKEN"] = bot_config.get("botToken", "")
        os.environ["OWNER_ID"] = str(bot_config.get("telegramId", "0"))
        os.environ["BOT_ID"] = bot_config.get("botId", "")
        os.environ["USER_ID"] = bot_config.get("userId", "")
        os.environ["IS_PREMIUM"] = str(bot_config.get("isPremium", False)).lower()
        
        # Generate config.py from auto-injected credentials
        config_content = f'''# 🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
# Do not commit this file with real tokens!

# Bot Owner Settings
OWNER_ID = {bot_config.get("telegramId", "8317563450")}
OWNER_USERNAME = "{bot_config.get("userTelegramId", "@KIFZLDEV")}"

# VIP Verification Groups
VIP_GROUPS = [
    "https://t.me/agentviber12",
    "https://t.me/channelviber"
]

# VIP Access Duration (days)
VIP_DURATION_DAYS = 7

# File Paths
USERS_FILE = "users.json"
REDEEM_FILE = "redeem.json"
SESSIONS_FILE = "sessions.json"
ADMINS_FILE = "admins.json"

# Notification Settings
VIP_EXPIRY_WARNING_HOURS = 24

# Role Hierarchy
ROLE_HIERARCHY = {{
    "FREE": 0,
    "VIP": 1,
    "PREMIUM": 2,
    "OWNER": 3
}}

# Date Format
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Bot Information
BOT_CREATOR = "KIFZL & PARTNER/SUPPORT IQBAL DEV"
BOT_SUPPORT = "@KIFZLDEV"
BOT_NAME = "KIFZL DEV BOT"
'''
        
        with open("config.py", "w") as f:
            f.write(config_content)
        
        logger.info("📝 config.py generated from auto-injected credentials")
        
        logger.info("\n✅ All environment variables set!")
        logger.info("🔧 Starting bot main.py...\n")
        
        # Start the main bot
        import main
        
    except json.JSONDecodeError as e:
        logger.error(f"❌ Invalid JSON in BOT_CONFIG: {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Bootstrap failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    bootstrap()
