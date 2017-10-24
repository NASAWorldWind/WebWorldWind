#!/bin/bash

mkdir assetsToPublish
npm pack
tar -xf nasaworldwind-worldwind-*.tgz -C ./assetsToPublish --strip-components 1
node travis/publishFolderToArtifactory $ARTIFACTORY_API_KEY ./assetsToPublish /artifactory/web/${TRAVIS_TAG#"v"}
