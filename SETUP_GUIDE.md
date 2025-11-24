# 🚀 Backend CI/CD Setup Guide

This guide will help you set up the CI/CD pipeline for the Techmapperz Backend.

## Prerequisites

- GitHub repository: `TechmapperzBackend_New`
- Hostinger VPS with SSH access
- Node.js 18+ installed on VPS
- PM2 installed globally on VPS
- MongoDB database accessible from VPS

## Step 1: Initial VPS Setup

SSH into your VPS and run:

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version  # Should show v18.x.x
pm2 --version   # Should show PM2 version
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

### VPS Connection
- **VPS_HOST**: Your VPS IP address (e.g., `123.456.789.0`)
- **VPS_USERNAME**: VPS username (usually `root`)
- **VPS_PASSWORD**: VPS password
- **VPS_PORT**: SSH port (usually `22`)

### Backend Configuration
- **MONGO_URL**: MongoDB connection string (e.g., `mongodb://user:pass@host:27017/dbname`)
- **BACKEND_PORT**: Backend port (default: `8000`)
- **JWT_SECRET**: Secret key for JWT tokens
- **EMAIL_USER**: Email address for nodemailer
- **EMAIL_PASS**: Email password for nodemailer
- **IMAGEKIT_PUBLIC_KEY**: ImageKit public key
- **IMAGEKIT_PRIVATE_KEY**: ImageKit private key
- **IMAGEKIT_URL_ENDPOINT**: ImageKit URL endpoint

## Step 3: First Deployment

1. **Commit and push the CI/CD files**:
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline configuration"
   git push origin main
   ```

2. **Monitor the deployment**:
   - Go to GitHub repository → Actions tab
   - Watch the "Deploy Backend to Hostinger VPS" workflow
   - Wait for it to complete

3. **Verify deployment on VPS**:
   ```bash
   ssh root@your-vps-ip
   pm2 status
   pm2 logs techmapperz-backend
   ```

## Step 4: Test the API

Test that the backend is running:

```bash
curl http://your-vps-ip:8000/
# Should return: "welcome to home page"
```

## Step 5: Configure Firewall (if needed)

If your VPS has a firewall, allow the backend port:

```bash
sudo ufw allow 8000/tcp
sudo ufw reload
```

## Troubleshooting

### PM2 not found
```bash
npm install -g pm2
```

### Port already in use
```bash
# Find process using port 8000
sudo lsof -i :8000
# Kill the process or change BACKEND_PORT in secrets
```

### MongoDB connection failed
- Verify MONGO_URL is correct
- Check MongoDB is accessible from VPS
- Verify firewall allows MongoDB port (usually 27017)

### Deployment fails
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure VPS has enough disk space
- Check PM2 logs: `pm2 logs techmapperz-backend`

## Future Deployments

After the initial setup, deployments are automatic:

1. Make code changes
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys
4. Check deployment status in Actions tab

## Manual Deployment

If you need to deploy manually:

```bash
cd /root/techmapperz-backend-prod
chmod +x deploy.sh
./deploy.sh
```

## Monitoring

View application logs:
```bash
pm2 logs techmapperz-backend
```

View application status:
```bash
pm2 status
pm2 show techmapperz-backend
```

Restart application:
```bash
pm2 restart techmapperz-backend
```

## Next Steps

- Set up Nginx reverse proxy (optional)
- Configure SSL certificate (optional)
- Set up monitoring and alerts (optional)

