#!/bin/bash

# Download missing JS files from maxchat.id
BASE_URL="https://maxchat.id/_astro"
DEST_DIR="/Users/macairm12020/Documents/Maxchat/sales-custom-pricing/public/_astro"

# List of JS files to download
JS_FILES=(
  "CalculatorContent.d4faa00e.js"
  "FloatingWhatsapp.ff55545e.js"
  "Footer.b4cebc97.js"
  "Navbar.c0496627.js"
  "TopBannerWrapper.8bf8fd0b.js"
  "client.31c2c625.js"
  "index.6f5768be.js"
  "i18next.14d98e4e.js"
  "defineProperty.0bdeb0a6.js"
  "index.05f832f2.js"
  "context.f36db113.js"
  "nonIterableRest.deb50422.js"
)

echo "Downloading ${#JS_FILES[@]} JS files..."

for js in "${JS_FILES[@]}"; do
  url="${BASE_URL}/${js}"
  dest="${DEST_DIR}/${js}"
  
  if [ -f "$dest" ]; then
    echo "Already exists: $js"
  else
    echo "Downloading: $js"
    curl -s -o "$dest" "$url"
    if [ $? -eq 0 ]; then
      echo "  ✓ Downloaded"
    else
      echo "  ✗ Failed"
    fi
  fi
done

echo "Done!"
