#!/usr/bin/env bash
cd node_modules/react-native ; ./scripts/ios-install-third-party.sh ; cd ../../
cd node_modules/react-native/third-party/glog-0.3.5/ ; sh ../../scripts/ios-configure-glog.sh ; cd ../../../../
rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json || true
