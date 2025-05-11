#!/bin/bash

echo "=== System Date Check ==="
date
echo "NOTE: Your system date is set to 2025, which is causing your certificate to appear expired!"
echo "To fix system date:"
echo "sudo date -s \"$(TZ=UTC date)\""
echo "sudo hwclock --systohc"
echo ""

echo "=== Certificate Being Served ==="
echo "This shows the actual certificate dates your server is presenting:"
openssl s_client -connect rwtchoir.org:443 -servername rwtchoir.org </dev/null 2>/dev/null | openssl x509 -noout -dates
echo ""

echo "=== Locating SSL Certificate Files ==="
echo "Finding actual certificate files on server:"
find / -name "*.pem" -o -name "*.crt" -o -name "*.key" 2>/dev/null | grep -i ssl
echo ""

echo "=== Common Certificate Paths ==="
for path in /etc/ssl/certs /etc/letsencrypt/live /etc/pki/tls /var/www/*/ssl; do
    if [ -d "$path" ]; then
        echo "Files in $path:"
        ls -la "$path" 2>/dev/null
    fi
done
echo ""

echo "=== Web Server Configuration Check ==="
echo "Looking for certificate file references in web server configs:"
# For Apache
if [ -d /etc/apache2 ]; then
  echo "Apache config files:"
  grep -r "SSLCertificateFile\|SSLCertificateKeyFile\|SSLCertificateChainFile" /etc/apache2/
fi

# For Nginx
if [ -d /etc/nginx ]; then
  echo "Nginx config files:"
  grep -r "ssl_certificate" /etc/nginx/
fi
echo ""

echo "=== Certificate Chain Verification ==="
echo "Checking if the certificate chain is complete:"
openssl verify -verbose /Users/michaelstewart/Coding/RWTProj/ssl/fullchain.pem

echo ""
echo "=== Fix Instructions ==="
echo "1. CRITICAL: Fix your system date first with:"
echo "   sudo date -s \"$(TZ=UTC date)\""
echo "   sudo hwclock --systohc"
echo ""
echo "2. Once the correct certificate files are located, use proper paths in web server config"
echo ""
echo "3. Restart your web server after fixing the date and config:"
echo "   For Apache: sudo systemctl restart apache2"
echo "   For Nginx:  sudo systemctl restart nginx"
