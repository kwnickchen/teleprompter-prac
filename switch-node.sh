#!/bin/bash
# Script to switch to Node.js 18 using nvm

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js 18..."
nvm install 18

echo "Switching to Node.js 18..."
nvm use 18

echo "Setting Node.js 18 as default..."
nvm alias default 18

echo ""
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""
echo "You can now run 'npm run dev'!"

