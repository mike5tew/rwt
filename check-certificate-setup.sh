#!/bin/bash

echo "=== Certificate Chain Check ==="
echo "Checking if your web server may need the intermediate certificate:"
echo ""
echo "Your certificate is valid for the current date (May 6, 2025 - May 6, 2026)."
echo "Since your certificate is valid but browsers still show errors, the issue may be:"
echo ""
echo "1. Missing intermediate certificate in the certificate chain:"
echo "   - The 'fullchain.pem' should include your certificate AND the intermediate certificate"
echo "   - Check if the intermediate certificate from Sectigo is included"
echo ""
echo "Finding server certificate location:"
for path in /etc/ssl/certs /etc/letsencrypt/live /etc/pki/tls /var/www/*/ssl /etc/apache2/ssl /etc/nginx/ssl; do
    if [ -d "$path" ]; then
        echo "Looking in $path:"
        ls -la "$path" 2>/dev/null | grep -i "cert\|pem\|key"
    fi
done
echo ""

echo "2. Time zone issues:"
echo "   - Your certificate is valid from May 6, 2025 00:00:00 GMT"
echo "   - Current server time and time zone:"
date
echo "   - If your server is in a time zone behind GMT, it might still be May 5 there"
echo ""

echo "3. Web Server Configuration:"
echo "   - Check that your web server is configured to use the correct certificate files"
echo "   - For Apache, check SSL directives in the VirtualHost configuration"
echo "   - For Nginx, check ssl_certificate and ssl_certificate_key directives"
echo ""

echo "=== How to fix the certificate chain issue ==="
echo "1. Download the Sectigo intermediate certificate from:"
echo "   https://sectigo.com/resource-library/sectigo-root-intermediate-certificates"
echo ""
echo "2. Create a proper fullchain.pem by concatenating your certificate and the intermediate:"
echo "   cat /path/to/your/certificate.crt /path/to/intermediate.crt > /path/to/fullchain.pem"
echo ""
echo "3. Update your web server configuration to use this new fullchain.pem"
echo "4. Restart your web server"
