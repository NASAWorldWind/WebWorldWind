#!/bin/bash

mkdir assetsToPublish
NPM_PACKAGE=$(npm pack)
tar -xf $NPM_PACKAGE -C ./assetsToPublish --strip-components 1
node travis/publishFolderToArtifactory $ARTIFACTORY_API_KEY ./assetsToPublish /artifactory/web/${TRAVIS_TAG#"v"}
