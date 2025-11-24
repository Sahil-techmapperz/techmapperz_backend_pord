# Apache Backend Proxy Troubleshooting

## Current Issue: Service Unavailable

If you're getting "Service Unavailable" when accessing `https://newbackend.techmapperz.com/`, follow these steps:

## Step 1: Verify Backend is Running

```bash
# Check if backend is running
pm2 status techmapperz-backend

# Test backend directly
curl http://localhost:8080/
# Should return: "welcome to home page"

# Check if port 8080 is listening
lsof -i:8080
netstat -tulpn | grep 8080
```

## Step 2: Check Apache Error Logs

```bash
# Check Apache error logs
tail -50 /var/log/apache2/newbackend_error.log
tail -50 /var/log/apache2/error.log

# Check Apache access logs
tail -50 /var/log/apache2/newbackend_access.log
```

## Step 3: Enable Required Apache Modules

```bash
# Enable proxy modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod ssl

# Restart Apache
sudo systemctl restart apache2
```

## Step 4: Verify Apache Configuration

The VirtualHost should be in `/etc/apache2/sites-available/newbackend.conf`:

```apache
<VirtualHost *:80>
    ServerName newbackend.techmapperz.com
    
    # Enable Reverse Proxy
    ProxyPreserveHost On
    
    # Proxy to backend on port 8080
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    
    # Set proxy headers
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/newbackend_error.log
    CustomLog ${APACHE_LOG_DIR}/newbackend_access.log combined
    
    # Redirect HTTP to HTTPS
    RewriteEngine on
    RewriteCond %{SERVER_NAME} =newbackend.techmapperz.com
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:443>
    ServerName newbackend.techmapperz.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/newbackend.techmapperz.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/newbackend.techmapperz.com/privkey.pem
    
    # Enable Reverse Proxy
    ProxyPreserveHost On
    
    # Proxy to backend on port 8080
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    
    # Set proxy headers for HTTPS
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    RequestHeader set X-Real-IP %{REMOTE_ADDR}s
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/newbackend_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/newbackend_ssl_access.log combined
</VirtualHost>
```

## Step 5: Enable and Test Configuration

```bash
# Enable the site
sudo a2ensite newbackend.conf

# Test Apache configuration
sudo apache2ctl configtest

# If test passes, restart Apache
sudo systemctl restart apache2

# Check Apache status
sudo systemctl status apache2
```

## Step 6: Common Issues and Fixes

### Issue: "AH00957: http: attempt to connect to 127.0.0.1:8080 failed"
**Fix**: Backend is not running or not accessible
```bash
# Start backend
cd /root/techmapperz-backend-prod
pm2 start ecosystem.config.js --env production
```

### Issue: "AH01102: error reading status line from remote server"
**Fix**: Backend is crashing or not responding
```bash
# Check backend logs
pm2 logs techmapperz-backend --lines 50
```

### Issue: Proxy modules not enabled
**Fix**: Enable required modules (see Step 3)

### Issue: Firewall blocking
**Fix**: Ensure localhost connections are allowed
```bash
# Check firewall
sudo ufw status
# Should allow localhost connections by default
```

## Step 7: Test the Configuration

```bash
# Test from server
curl -H "Host: newbackend.techmapperz.com" http://localhost/
curl -k -H "Host: newbackend.techmapperz.com" https://localhost/

# Test from external
curl https://newbackend.techmapperz.com/
```

## Quick Fix Script

Run this to fix common issues:

```bash
#!/bin/bash
# Enable Apache modules
sudo a2enmod proxy proxy_http proxy_balancer headers rewrite ssl

# Ensure backend is running
pm2 restart techmapperz-backend

# Test backend
curl http://localhost:8080/ || echo "Backend not responding!"

# Test Apache config
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2

echo "✅ Configuration updated. Check logs if issues persist."
```

