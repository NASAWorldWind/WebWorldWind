#!/bin/bash

mkdir assetsToPublish
NPM_PACKAGE=$(npm pack)
tar -xf $NPM_PACKAGE -C ./assetsToPublish --strip-components 2
node travis/publishFolderToArtifactory $ARTIFACTORY_API_KEY ./assetsToPublish /artifactory/web/${TRAVIS_TAG#"v"}
