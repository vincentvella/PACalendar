#!/usr/bin/env bash

APPCENTER_SOURCE_DIRECTORY="$1"
ADD_UNIT_ID_BANNER="$2"
ADD_UNIT_INTERSTITIAL="$3"
CLIENT_ID="$4"
REVERSED_CLIENT_ID="$5"
API_KEY="$6"
MESSAGING_SENDER_ID="$7"
BUNDLE_ID="$8"
PROJECT_ID="$9"
STORAGE_BUCKET=${10}
GOOGLE_APP_ID=${11}
DATABASE_URL=${12}

cat > $APPCENTER_SOURCE_DIRECTORY/ios/AppCenter-Config.plist <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AD_UNIT_ID_FOR_BANNER_TEST</key>
	<string>$ADD_UNIT_ID_BANNER</string>
	<key>AD_UNIT_ID_FOR_INTERSTITIAL_TEST</key>
	<string>$ADD_UNIT_INTERSTITIAL</string>
	<key>CLIENT_ID</key>
	<string>$CLIENT_ID</string>
	<key>REVERSED_CLIENT_ID</key>
	<string>$REVERSED_CLIENT_ID</string>
	<key>API_KEY</key>
	<string>$API_KEY</string>
	<key>GCM_SENDER_ID</key>
	<string>$MESSAGING_SENDER_ID</string>
	<key>PLIST_VERSION</key>
	<string>1</string>
	<key>BUNDLE_ID</key>
	<string>$BUNDLE_ID</string>
	<key>PROJECT_ID</key>
	<string>$OLD_PROJECT_ID</string>
	<key>STORAGE_BUCKET</key>
	<string>$STORAGE_BUCKET</string>
	<key>IS_ADS_ENABLED</key>
	<true></true>
	<key>IS_ANALYTICS_ENABLED</key>
	<false></false>
	<key>IS_APPINVITE_ENABLED</key>
	<true></true>
	<key>IS_GCM_ENABLED</key>
	<true></true>
	<key>IS_SIGNIN_ENABLED</key>
	<true></true>
	<key>GOOGLE_APP_ID</key>
	<string>$GOOGLE_APP_ID</string>
	<key>DATABASE_URL</key>
	<string>$DATABASE_URL</string>
</dict>
</plist>
EOF