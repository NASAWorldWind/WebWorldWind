#!/bin/bash
# Creates the npm tarball using the npm pack command then extracts the contents to a temporary directory

npm pack
# provides compatibility for both macOS and Linux
npmtmpdir=`mktemp -d 2>/dev/null || mktemp -d -t 'npmtmpdir'`

tar -xvf nasaworldwind-worldwind-*.tgz -C $npmtmpdir --strip-components 1

export NPM_TMP_DIR=$npmtmpdir
