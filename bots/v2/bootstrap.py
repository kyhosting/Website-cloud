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
        config = json.loads(config_json)
        
        logger.info("✅ Config loaded from environment")
        logger.info(f"📦 Bot Token: {'●●●●●●●●●●●●●●●●●●' if config.get('botToken') else 'NOT SET'}")
        logger.info(f"📦 Telegram ID: {config.get('telegramId')}")
        logger.info(f"📦 Bot ID: {config.get('botId')}")
        logger.info(f"📦 User ID: {config.get('userId')}")
        logger.info(f"📦 Premium: {'YES ✓' if config.get('isPremium') else 'NO'}")
        
        # Set environment variables for bot
        os.environ["TELEGRAM_BOT_TOKEN"] = config.get("botToken", "")
        os.environ["OWNER_ID"] = str(config.get("telegramId", "0"))
        os.environ["BOT_ID"] = config.get("botId", "")
        os.environ["USER_ID"] = config.get("userId", "")
        os.environ["IS_PREMIUM"] = str(config.get("isPremium", False)).lower()
        
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
