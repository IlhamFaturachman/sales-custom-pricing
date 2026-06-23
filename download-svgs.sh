#!/bin/bash

# Download missing SVGs from maxchat.id
BASE_URL="https://maxchat.id/_astro"
DEST_DIR="/Users/macairm12020/Documents/Maxchat/sales-custom-pricing/public/_astro"

# List of SVGs to download
SVGs=(
  "agency.6eb3998b.svg"
  "analytics.c315ea45.svg"
  "asisten.2f8843bd.svg"
  "brodcast.414c2162.svg"
  "chatbot.bfd99bf8.svg"
  "check-orange.c980f76d.svg"
  "education.0c937ee2.svg"
  "email-primary.da8265b3.svg"
  "facebook.dc8f3817.svg"
  "fb-fill-primary.d9feb476.svg"
  "finance.ef019bd3.svg"
  "flag-US.66157e45.svg"
  "fnb.4580dad5.svg"
  "government.7e19e798.svg"
  "health.8bbe9cf3.svg"
  "ig-fill-primary.dcb3494e.svg"
  "integrasi.c7627089.svg"
  "kepuasan.42cd2d3f.svg"
  "konsultan.e93fbc91.svg"
  "linkedin-fill-primary.272fbff6.svg"
  "location-primary.124e813f.svg"
  "navbar_instagram.fd0ba9f0.svg"
  "ngo.6abc1f5c.svg"
  "pesan.abaa820b.svg"
  "phone-primary.4392015c.svg"
  "properti.78c92cda.svg"
  "retail.9499a1f2.svg"
  "support.04780b5d.svg"
  "telegram.6ce56920.svg"
  "ticketing.d263d07c.svg"
  "travel.7bf7f7c0.svg"
  "utilitas.ea4f3f7e.svg"
  "verify.13b340d5.svg"
  "wa-outlined.aa16af80.svg"
  "whatsapp.d2167c08.svg"
)

echo "Downloading ${#SVGs[@]} SVGs..."

for svg in "${SVGs[@]}"; do
  url="${BASE_URL}/${svg}"
  dest="${DEST_DIR}/${svg}"
  
  if [ -f "$dest" ]; then
    echo "Already exists: $svg"
  else
    echo "Downloading: $svg"
    curl -s -o "$dest" "$url"
    if [ $? -eq 0 ]; then
      echo "  ✓ Downloaded"
    else
      echo "  ✗ Failed"
    fi
  fi
done

echo "Done!"
