#!/bin/bash
# Creates the npm tarball using the npm pack command then extracts the contents to assetsToDeploy

mkdir assetsToDeploy
npm pack
tar -xvf nasaworldwind-worldwind-*.tgz -C ./assetsToDeploy --strip-components 1
