#!/bin/bash
# Creates a zip file of the contents of the dist/ folder

cd ./dist/
zip -rq WebWorldWind.zip ./*
cd ../
