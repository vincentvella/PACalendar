#!/usr/bin/env bash

APPCENTER_SOURCE_DIRECTORY="$1"
APP_SECRET="$2"
cat > $APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>AppSecret</key>
    <string>$APP_SECRET</string>
  </dict>
</plist>
EOF