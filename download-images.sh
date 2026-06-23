#!/bin/bash

# Download missing images from maxchat.id
BASE_URL="https://maxchat.id/_astro"
DEST_DIR="/Users/macairm12020/Documents/Maxchat/sales-custom-pricing/public/_astro"

# List of images to download
IMAGES=(
  "logo-pse.0b17146b.webp"
  "meta-badge.a48c0081.webp"
  "iso.0a3f7e09.png"
)

echo "Downloading ${#IMAGES[@]} images..."

for img in "${IMAGES[@]}"; do
  url="${BASE_URL}/${img}"
  dest="${DEST_DIR}/${img}"
  
  if [ -f "$dest" ]; then
    echo "Already exists: $img"
  else
    echo "Downloading: $img"
    curl -s -o "$dest" "$url"
    if [ $? -eq 0 ]; then
      echo "  ✓ Downloaded"
    else
      echo "  ✗ Failed"
    fi
  fi
done

echo "Done!"
