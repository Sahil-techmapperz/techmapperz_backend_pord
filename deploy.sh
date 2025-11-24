#!/bin/bash

# Techmapperz Backend Auto Deploy Script
# This script handles the deployment process on the VPS

set -e  # Exit on any error

echo "🚀 Starting backend deployment process..."

# Configuration
PROJECT_DIR="/root/techmapperz-backend-prod"
BACKUP_DIR="/var/backups/techmapperz-backend"
LOG_FILE="/var/log/techmapperz-backend-deploy.log"
APP_NAME="techmapperz-backend"

# Create log entry
echo "$(date): Starting deployment" >> $LOG_FILE

# Function to handle errors
handle_error() {
    echo "❌ Deployment failed! Check logs at $LOG_FILE"
    echo "$(date): Deployment failed - $1" >> $LOG_FILE
    exit 1
}

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
if [ -d "$PROJECT_DIR" ]; then
    cp -r $PROJECT_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S) || handle_error "Backup creation failed"
fi

# Navigate to project directory
cd $PROJECT_DIR || handle_error "Project directory not found"

# Pull latest changes
echo "⬇️ Pulling latest changes from GitHub..."
git pull origin main || handle_error "Git pull failed"

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --production || handle_error "npm install failed"

# Restart PM2 process
echo "🔄 Restarting $APP_NAME application..."
if pm2 list | grep -q $APP_NAME; then
    echo "Found existing $APP_NAME process, restarting..."
    pm2 restart $APP_NAME || handle_error "PM2 restart failed"
    echo "✅ Successfully restarted $APP_NAME"
else
    echo "No existing $APP_NAME process found, starting new one..."
    pm2 start ecosystem.config.js --env production || handle_error "PM2 start failed"
    echo "✅ Successfully started $APP_NAME"
fi

# Show app status
pm2 show $APP_NAME

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "$(date): Deployment completed successfully" >> $LOG_FILE

# Clean old backups (keep only last 5)
echo "🧹 Cleaning old backups..."
if [ -d "$BACKUP_DIR" ]; then
    ls -t $BACKUP_DIR | tail -n +6 | xargs -I {} rm -rf $BACKUP_DIR/{} 2>/dev/null || true
fi

echo "🎉 All done! Your backend is now live."

