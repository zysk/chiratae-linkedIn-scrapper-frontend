#!/bin/bash

cd .. &&
rm -rf ./chiratae-linkedIn-scrapper-backend/public &&
cp -r ./chiratae-linkedIn-scrapper-frontend/build ./chiratae-linkedIn-scrapper-backend/public &&
touch ./chiratae-linkedIn-scrapper-backend/public/.gitignore
echo "Build files copied to BE directory!!"
