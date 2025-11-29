"""
🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
This file is auto-generated with bot credentials injected from the platform
DO NOT EDIT MANUALLY - regenerate from dashboard instead
"""

import os
import json

# Load auto-injected credentials from environment
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
OWNER_ID = int(os.getenv("OWNER_ID", "8317563450"))
OWNER_USERNAME = os.getenv("OWNER_USERNAME", "@KIFZLDEV")

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
VIP_EXPIRY_WARNING_HOURS = 24  # Send warning 24 hours before expiry

# Role Hierarchy
ROLE_HIERARCHY = {
    "FREE": 0,
    "VIP": 1,
    "PREMIUM": 2,
    "OWNER": 3
}

# Date Format
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Bot Information
BOT_CREATOR = "KIFZL & PARTNER/SUPPORT IQBAL DEV"
BOT_SUPPORT = "@KIFZLDEV"
BOT_NAME = "KIFZL DEV BOT"
