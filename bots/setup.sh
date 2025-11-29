#!/bin/bash
# KIFZLDEV NEO-2025 - Bot Dependencies Setup Script
# Run this to install all bot dependencies

set -e

echo "🚀 KIFZLDEV Bot Setup - Installing Dependencies"
echo "================================================"

# Bot V1 Setup (NodeJS)
echo ""
echo "📦 Installing Bot V1 (NodeJS) dependencies..."
cd "$(dirname "$0")/v1"
npm install
echo "✅ Bot V1 dependencies installed"

# Bot V2 Setup (Python)
echo ""
echo "📦 Installing Bot V2 (Python) dependencies..."
cd "$(dirname "$0")/v2"
pip install -r requirements.txt
echo "✅ Bot V2 dependencies installed"

echo ""
echo "🎉 All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Add bot credentials in KIFZLDEV dashboard"
echo "2. Copy deployment script from dashboard"
echo "3. Run deployment script on your server"
echo ""
echo "Or test locally with:"
echo "  export BOT_CONFIG='{...}'  # Copy from dashboard"
echo "  cd v1 && node bootstrap.js"
echo "  cd v2 && python bootstrap.py"
