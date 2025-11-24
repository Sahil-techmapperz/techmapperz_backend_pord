#!/bin/bash
# Fix Apache configuration to use port 8000 instead of 8080

echo "=== Finding Apache configuration file ==="
CONFIG_FILE=$(find /etc/apache2/sites-available -name "*newbackend*" -o -name "*backend*" | head -1)

if [ -z "$CONFIG_FILE" ]; then
    echo "❌ Configuration file not found. Listing available files:"
    ls -la /etc/apache2/sites-available/
    exit 1
fi

echo "✅ Found configuration file: $CONFIG_FILE"
echo ""

echo "=== Current ProxyPass configuration ==="
grep -n "ProxyPass" "$CONFIG_FILE" || echo "No ProxyPass found"
echo ""

echo "=== Updating port from 8080 to 8000 ==="
# Backup the original file
cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup created: ${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Replace port 8080 with 8000
sed -i 's/127.0.0.1:8080/127.0.0.1:8000/g' "$CONFIG_FILE"
sed -i 's/localhost:8080/localhost:8000/g' "$CONFIG_FILE"

echo "✅ Configuration updated"
echo ""

echo "=== Updated ProxyPass configuration ==="
grep -n "ProxyPass" "$CONFIG_FILE"
echo ""

echo "=== Testing Apache configuration ==="
apache2ctl configtest
echo ""

if [ $? -eq 0 ]; then
    echo "=== Restarting Apache ==="
    systemctl restart apache2
    echo "✅ Apache restarted"
    echo ""
    echo "=== Checking Apache status ==="
    systemctl status apache2 --no-pager -l
    echo ""
    echo "✅ Done! Test your backend at https://newbackend.techmapperz.com/"
else
    echo "❌ Configuration test failed. Please check the errors above."
    exit 1
fi

