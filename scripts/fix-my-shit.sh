#!/usr/bin/env bash
rm -rf $TMPDIR/haste-map-react-native-packager-* || true
rm -rf $TMPDIR/react-* || true
rm node_modules/react-native/local-cli/core/__fixtures__/files/package.json || true
watchman watch-del-all || true
