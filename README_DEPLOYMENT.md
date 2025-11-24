# 🚀 Techmapperz Backend - CI/CD Deployment Guide

This document describes the automated CI/CD pipeline for the Techmapperz Backend API.

## 📋 Overview

The backend uses GitHub Actions to automatically deploy to a Hostinger VPS whenever code is pushed to the `main` branch.

## 🔄 How Auto-Deployment Works

```
GitHub Push → GitHub Actions → Install Dependencies → Deploy to VPS → Restart PM2 → Live API
```

### Deployment Flow

1. **Trigger**: Push to `main` or `master` branch
2. **GitHub Actions**: 
   - Checks out code
   - Sets up Node.js 18
   - Installs dependencies
   - Uploads files to VPS
3. **VPS Deployment**:
   - Pulls latest code from GitHub
   - Creates/updates `.env` file
   - Installs production dependencies
   - Restarts PM2 process
   - Verifies deployment

## 🔧 VPS Configuration

| Component | Details |
|-----------|---------|
| **Server** | Hostinger VPS |
| **OS** | Ubuntu Linux |
| **Runtime** | Node.js 18 |
| **Process Manager** | PM2 |
| **Port** | 8000 (configurable) |
| **Directory** | `/root/techmapperz-backend-prod/` |

## 🔐 Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### VPS Connection Secrets
- `VPS_HOST` - Your VPS IP address
- `VPS_USERNAME` - VPS username (usually 'root')
- `VPS_PASSWORD` - VPS password
- `VPS_PORT` - SSH port (usually 22)

### Backend Environment Variables

**Required:**
- `MONGO_URL` - MongoDB connection string
- `BACKEND_PORT` - Backend server port (default: 8000)

**Optional (only if you plan to use email functionality):**
- `JWT_SECRET` - JWT secret key for authentication (if using JWT)
- `EMAIL_USER` - Email username for nodemailer (currently not used in code)
- `EMAIL_PASS` - Email password for nodemailer (currently not used in code)
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key (if using ImageKit)
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key (if using ImageKit)
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint (if using ImageKit)

## 📁 Project Structure

```
techmapperz-backend-prod/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── config/                 # Configuration files
│   ├── model/                  # MongoDB models
│   ├── routes/                 # API routes
│   └── index.js               # Entry point
├── ecosystem.config.js         # PM2 configuration
├── deploy.sh                   # Manual deployment script
├── package.json
└── README_DEPLOYMENT.md        # This file
```

## 🚀 Manual Deployment

If you need to deploy manually, you can use the `deploy.sh` script:

```bash
cd /root/techmapperz-backend-prod
chmod +x deploy.sh
./deploy.sh
```

## 📊 PM2 Management

### View Status
```bash
pm2 status techmapperz-backend
pm2 show techmapperz-backend
```

### View Logs
```bash
pm2 logs techmapperz-backend
```

### Restart Application
```bash
pm2 restart techmapperz-backend
```

### Stop Application
```bash
pm2 stop techmapperz-backend
```

## 🔍 Health Check

The backend should be accessible at:
- `http://your-vps-ip:8000/` - Should return "welcome to home page"

## 🛠️ Troubleshooting

### Deployment Fails
1. Check GitHub Actions logs for errors
2. Verify all secrets are correctly set
3. Ensure VPS has Node.js 18 installed
4. Check PM2 is installed: `npm install -g pm2`

### Application Not Starting
1. Check PM2 logs: `pm2 logs techmapperz-backend`
2. Verify `.env` file exists and has correct values
3. Check MongoDB connection: Ensure `MONGO_URL` is correct
4. Verify port is not in use: `netstat -tulpn | grep 8000`

### Dependencies Issues
```bash
cd /root/techmapperz-backend-prod
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables

The `.env` file is automatically created during deployment with the following variables:

```env
# Required
MONGO_URL=your_mongodb_connection_string
PORT=8000
NODE_ENV=production

# Optional - only add if you need these features
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_password
# IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
# IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
# IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**Note:** `EMAIL_USER` and `EMAIL_PASS` are currently **not used** in the codebase. The `mail.js` file exists but is not imported anywhere. You only need to add these if you plan to implement email functionality in the future.

## 🔄 Update Process

1. Make changes to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. GitHub Actions will automatically deploy
4. Check deployment status in GitHub Actions tab

## 📞 Support

For issues or questions:
- Check GitHub Actions logs
- Review PM2 logs on VPS
- Verify environment variables are set correctly

