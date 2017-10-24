#!/bin/bash

mkdir assetsToPublish
npm pack
tar -xvf nasaworldwind-worldwind-*.tgz -C ./assetsToPublish --strip-components 1
node travis/publishToArtifactory $ARTIFACTORY_API_KEY ${TRAVIS_TAG#"v"} assetsToPublish/
